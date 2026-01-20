// @ts-ignore

import prisma from "@/generated/prisma";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationMail } from "@/lib/mail";


const ACCES_TOKEN_SECRET: string | null = process.env.ACCES_TOKEN_SECRET || null;
const REFRESH_TOKEN_SECRET: string | null = process.env.REFRESH_TOKEN_SECRET || null;

export const register = async (data: { name: string; email: string; password: string; phoneNumber: string; address: string; businessName: string; branchCount: number; estimatedScreen: number }) => {
  const { name, email, password, phoneNumber, address, businessName, branchCount, estimatedScreen } = data;

  const user: { id: string; name: string; email: string; password: string; phoneNumber: string } | null = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { phoneNumber: phoneNumber }
      ]
    }
  })

  if (user) {
    throw new Error('Bu email veya telefon numarası zaten kayıtlı');
  }

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);
  const verifyToken = uuidv4();

  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      password: hashPassword,
      address: address,
      businessName: businessName,
      branchCount: branchCount,
      verifyToken: verifyToken,
      estimatedScreen: estimatedScreen,
      isValidate: false
    },
    select: {
      name: true,
      email: true
    }
  })

  if (!newUser) {
    throw new Error('Kullanıcı oluşturulmadı')
  }

  try {
    await sendVerificationMail(email, verifyToken);
  } catch (err: any) {
    console.error('Mail gönerme hatası(register): ', err);
  }

  return newUser;
}

export const logout = async (data: { token: string }) => {
  try {
    const { token } = data
    if (!token) {
      throw new Error('Token bulunamadı !!')
    }

    const deletedToken = await prisma.refreshToken.delete({
      where: {
        token: token
      }
    })
    return deletedToken;


  } catch (err: any) {
    if (err.code === 'P2025') {
      console.log('Token zaten silinmiş veya bulunamadı');
      return null;
    }
    console.error('Çıkış yaparken bir hata oluştu:', err);
    throw new Error(err.message || 'Token silinirken bir hata oluştu');
  }
}

export const login = async (data: { userData: { email: string; password: string }; devices: string }) => {
  try {
    const { userData, devices } = data;
    const { email, password } = userData;

    if (!password || !email) {
      throw new Error('Şifre ve email boş olamaz');
    }

    if (!email.includes('@')) {
      throw new Error('Geçerli bir email adresi giriniz');
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (!user) {
      throw new Error(`"${email}" adresine kayıtlı kullanıcı bulunamadı`);
    }

    if (!user.password) {
      throw new Error('Kullanıcı şifresi tanımlı değil. Lütfen şifrenizi sıfırlayın.');
    }
    if (!user.isValidate) {
      throw new Error('Giriş yapabilmek için lütfen email adresinizi doğrulayınız. Doğrulama linki email adresinize gönderildi lütfen email kutunuzu kontrol ediniz.')
    }

    let userPassword: string = user.password;
    let isMatch: boolean = await bcrypt.compare(password, userPassword);

    if (!isMatch) {
      throw new Error('Girdiğiniz şifre yanlış. Lütfen tekrar deneyin.');
    }

    if (!ACCES_TOKEN_SECRET) {
      console.error('❌ ACCES_TOKEN_SECRET tanımlı değil!');
      throw new Error("Sunucu yapılandırma hatası: ACCES_TOKEN_SECRET tanımlanmamış. Lütfen sistem yöneticisine başvurun.");
    }

    if (!REFRESH_TOKEN_SECRET) {
      console.error('❌ REFRESH_TOKEN_SECRET tanımlı değil!');
      throw new Error("Sunucu yapılandırma hatası: REFRESH_TOKEN_SECRET tanımlanmamış. Lütfen sistem yöneticisine başvurun.");
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      ACCES_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    try {
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          devices: devices,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      })
    } catch (dbError: any) {
      console.error('❌ Refresh token kaydetme hatası:', dbError);
      if (dbError.code === 'P2002') {
        console.log('⚠️ Refresh token zaten mevcut, devam ediliyor...');
      } else {
        throw new Error('Oturum oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  } catch (error: any) {
    console.error('❌ Login servis hatası:', {
      message: error.message,
      code: error.code,
      name: error.name
    });

    throw error;
  }
}
