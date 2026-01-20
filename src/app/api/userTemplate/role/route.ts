import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { prisma } from "@/generated/prisma";

export async function GET(req: Request) {
  console.log("[API /userTemplate/role] Role kontrolü isteği alındı");
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('accessToken')?.value;
    const authHeader = req.headers.get('authorization');
    const headerToken = authHeader?.split(' ')[1];
    const token = headerToken || cookieToken;

    console.log("[API /userTemplate/role] Token kontrolü:");
    console.log("  - Cookie token var mı:", !!cookieToken);
    console.log("  - Header token var mı:", !!headerToken);
    console.log("  - Kullanılacak token:", token ? "Mevcut" : "Yok");

    if (!token) {
      console.error("[API /userTemplate/role] Token bulunamadı. Yetkisiz erişim.");
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    try {
      if (!process.env.ACCES_TOKEN_SECRET) {
        console.error("[API /userTemplate/role] ACCES_TOKEN_SECRET environment variable bulunamadı");
        return NextResponse.json(
          { message: 'Sunucu yapılandırma hatası' },
          { status: 500 }
        );
      }

      console.log("[API /userTemplate/role] Token doğrulanıyor...");
      const secret = new TextEncoder().encode(process.env.ACCES_TOKEN_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);
      const userId = (payload as any).userId;
      const tokenRole = (payload as any).role;

      console.log("[API /userTemplate/role] Token payload:");
      console.log("  - userId:", userId);
      console.log("  - token'daki role:", tokenRole);

      if (!userId) {
        console.error("[API /userTemplate/role] Token'dan userId çıkarılamadı");
        return NextResponse.json(
          { message: 'Kullanıcı ID bulunamadı' },
          { status: 401 }
        );
      }

      console.log("[API /userTemplate/role] Veritabanından kullanıcı sorgulanıyor. userId:", userId);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        }
      });

      console.log("[API /userTemplate/role] Veritabanı sorgu sonucu:");
      console.log("  - Kullanıcı bulundu mu:", !!user);
      if (user) {
        console.log("  - Kullanıcı ID:", user.id);
        console.log("  - Kullanıcı adı:", user.name);
        console.log("  - Kullanıcı email:", user.email);
        console.log("  - Kullanıcı role (DB):", user.role);
        console.log("  - Token'daki role:", tokenRole);
        console.log("  - Role eşleşiyor mu:", user.role === tokenRole);
      }

      if (!user) {
        console.error("[API /userTemplate/role] Veritabanında kullanıcı bulunamadı. userId:", userId);
        return NextResponse.json(
          { message: 'Kullanıcı bulunamadı' },
          { status: 404 }
        );
      }

      console.log("[API /userTemplate/role] Başarılı. Kullanıcı bilgileri döndürülüyor. Role:", user.role);
      return NextResponse.json({
        data: user
      }, { status: 200 });

    } catch (tokenError: any) {
      console.error('[API /userTemplate/role] Token verify-mail hatası:', tokenError);
      console.error('[API /userTemplate/role] Hata detayı:', tokenError.message);
      return NextResponse.json(
        { message: 'Geçersiz token' },
        { status: 401 }
      );
    }

  } catch (err: any) {
    console.error('[API /userTemplate/role] Kullanıcı bilgisi getirilirken hata:', err);
    console.error('[API /userTemplate/role] Hata mesajı:', err.message);
    console.error('[API /userTemplate/role] Hata stack:', err.stack);
    return NextResponse.json(
      { message: 'Kullanıcı bilgisi getirilemedi: ' + err.message },
      { status: 500 }
    );
  }
}

