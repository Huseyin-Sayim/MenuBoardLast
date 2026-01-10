import { login } from "@/services/authServices";
import { NextResponse } from "next/server";

export async function POST (req : Request) {
  try {
    const data = await req.json();

    const result = await login(data);

    return NextResponse.json({
      message: "Giriş Başarılı",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    }, {status: 200})

  } catch (error : any) {
    console.error('❌ Login API Hatası:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    // Daha açıklayıcı hata mesajları
    let errorMessage = "Giriş işlemi sırasında bir hata oluştu";
    
    if (error.message) {
      errorMessage = error.message;
    } else if (error.code === 'P2002') {
      errorMessage = "Bu email zaten kullanılıyor";
    } else if (error.code === 'P2025') {
      errorMessage = "Kullanıcı bulunamadı";
    } else if (error.name === 'PrismaClientKnownRequestError') {
      errorMessage = "Veritabanı hatası oluştu. Lütfen daha sonra tekrar deneyin.";
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = "Token oluşturma hatası. Lütfen sistem yöneticisine başvurun.";
    }

    return NextResponse.json({
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 401 });
  }
}