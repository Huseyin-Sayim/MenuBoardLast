import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from 'jose';
import { deleteGalleryImage } from "@/services/galleryServices";
import prisma from "@/generated/prisma";


export async function DELETE( req: Request, { params }: { params: Promise<{ id: string }>}) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({
        error: 'Galeri resmi ID çekilemedi.'
      }, { status: 400 })
    }

    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('accessToken')?.value;
    const authHeader = req.headers.get('authorization');
    const headerToken = authHeader?.split(' ')[1];
    const token = headerToken || cookieToken;

    if (!token) {
      return NextResponse.json({
        error: 'Yetkisiz erişim.'
      }, { status: 401 })
    }

    try {
      if (!process.env.ACCES_TOKEN_SECRET) {
        console.error('ACCES_TOKEN_SECRET bulunamadı');
        return NextResponse.json({
          error: 'Sunucu yapılandırma hatası'
        }, { status: 500 })
      }

      const secret = new TextEncoder().encode(process.env.ACCES_TOKEN_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);
      const userId = (payload as any).userId;
      const tokenRole = (payload as any).role;

      console.log('DELETE /api/gallery/[id] - Token verify-mail başarılı');
      console.log('DELETE /api/gallery/[id] - userId:', userId);
      console.log('DELETE /api/gallery/[id] - tokenRole:', tokenRole);

      // Veritabanından kullanıcının gerçek role'ünü kontrol et
      let userRole = tokenRole;
      if (userId) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
          });

          if (user) {
            userRole = user.role;
            console.log('DELETE /api/gallery/[id] - Veritabanından alınan role:', userRole);
          } else {
            console.log('DELETE /api/gallery/[id] - Kullanıcı veritabanında bulunamadı');
          }
        } catch (dbError: any) {
          console.error('DELETE /api/gallery/[id] - Veritabanı hatası:', dbError.message);
          // Veritabanı hatası olsa bile token'daki role'ü kullan
        }
      }

      // Role kontrolü (case-insensitive)
      const isAdmin = userRole?.toLowerCase() === 'admin' || userRole === 'admin';
      
      if (!isAdmin) {
        console.log('DELETE /api/gallery/[id] - Admin değil, erişim reddedildi. userRole:', userRole);
        return NextResponse.json({
          error: 'Bu işlem için izniniz yok. Sadece admin yapabilir. (Role: ' + userRole + ')'
        }, { status: 403 })
      }

      console.log('DELETE /api/gallery/[id] - Admin yetkisi doğrulandı, devam ediliyor');
    } catch (tokenError: any) {
      console.error('DELETE /api/gallery/[id] - Token verify-mail hatası:', tokenError.message);
      return NextResponse.json({
        error: 'Geçersiz token: ' + tokenError.message
      }, { status: 401 });
    }

      const deletedImage = await deleteGalleryImage(id);

      return NextResponse.json({
        message: 'Galeri resmi başarıyla silindi.',
        data:deletedImage
      }, { status: 200 })

  } catch (err: any) {
    console.error("Galeri resmi silinirken hata:", err);

    if (err.message.includes('bulunamadı')) {
      return NextResponse.json({
        error: "Galeri resmi bulunamadı"
      }, { status: 404 });
    }

    return NextResponse.json({
      error: err.message || "Galeri resmi silinirken bir hata oluştu"
    }, { status: 500 });
  }
}