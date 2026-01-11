import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { prisma } from "@/generated/prisma";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('accessToken')?.value;
    const authHeader = req.headers.get('authorization');
    const headerToken = authHeader?.split(' ')[1];
    const token = headerToken || cookieToken;

    if (!token) {
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    try {
      if (!process.env.ACCES_TOKEN_SECRET) {
        return NextResponse.json(
          { message: 'Sunucu yapılandırma hatası' },
          { status: 500 }
        );
      }

      const secret = new TextEncoder().encode(process.env.ACCES_TOKEN_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);
      const userId = (payload as any).userId;

      if (!userId) {
        return NextResponse.json(
          { message: 'Kullanıcı ID bulunamadı' },
          { status: 401 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        }
      });

      if (!user) {
        return NextResponse.json(
          { message: 'Kullanıcı bulunamadı' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        data: user
      }, { status: 200 });

    } catch (tokenError: any) {
      console.error('Token verify hatası:', tokenError);
      return NextResponse.json(
        { message: 'Geçersiz token' },
        { status: 401 }
      );
    }

  } catch (err: any) {
    console.error('Kullanıcı bilgisi getirilirken hata:', err);
    return NextResponse.json(
      { message: 'Kullanıcı bilgisi getirilemedi: ' + err.message },
      { status: 500 }
    );
  }
}

