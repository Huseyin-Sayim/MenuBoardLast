// @ts-ignore

import prisma from "@/generated/prisma";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";


const ACCES_TOKEN_SECRET : string | null = process.env.ACCES_TOKEN_SECRET || null;
const REFRESH_TOKEN_SECRET : string | null = process.env.REFRESH_TOKEN_SECRET || null;

export const register = async (data: { name: string; email: string; password: string; phoneNumber: string }) => {
  const {name, email, password, phoneNumber} = data;

  const user : {id: string; name: string; email: string; password: string; phoneNumber: string } | null = await prisma.user.findFirst({
    where: {
      OR: [
        {email : email},
        {phoneNumber : phoneNumber}
      ]
    }
  })

  if (user) {
    throw new Error('Bu email veya telefon numarası zaten kayıtlı');
  }

  const salt = await bcrypt.genSalt(12);

  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      password: hashPassword
    },
    select: {
      name: true,
      email: true
    }
  })

  if (!newUser) {
    throw new Error('Kullanıcı oluşturulmadı')
  }

  return newUser;
}

export const logout = async (data: {token : string}) =>{
  try {
      const { token } = data
      if (!token) {
        throw new Error('Token bulunamadı !!')
      }

      const deletedToken= await  prisma.refreshToken.delete({
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

export const login = async (data : { userData: {email:string; password: string}; devices: string }) => {

  const {userData, devices} = data;
  const {email, password} = userData;

  if (!password || !email) {
    throw new Error('Şifre ve email boş olamaz');
  }

  const user = await prisma.user.findUnique({
    where: {
      email : email
    }
  })

  if (!user) {
    throw new Error('Kullanıcı bulunamadı');
  }

  let userPassword : string = user.password;
  let isMatch: boolean = await bcrypt.compare(password, userPassword);

  if (!isMatch) {
    throw new Error('Şifre yanlış');
  }

  if (!ACCES_TOKEN_SECRET) {
    throw new Error("ACCES_TOKEN_SECRET ortam değişkeni tanımlanmamış! .env dosyasını kontrol et.");
  }

  const accessToken = jwt.sign(
    {userId: user.id, email: user.email, role: user.role},
    ACCES_TOKEN_SECRET,
    {expiresIn: '15m'}
  );

  if (!REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET ortam değişkeni tanımlanmamış! .env dosyasını kontrol et.");
  }

  const refreshToken = jwt.sign(
    {userId: user.id, email: user.email, role: user.role},
    REFRESH_TOKEN_SECRET,
    {expiresIn: '7d'}
  );

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      devices: devices,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  return {
    user: {id: user.id, name: user.name, email: user.email, role: user.role},
    accessToken: accessToken,
    refreshToken: refreshToken
  }
}
