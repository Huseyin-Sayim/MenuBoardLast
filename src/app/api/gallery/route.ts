import * as jose from 'jose';
import { createGalleryImage, getAllGalleryImages } from "@/services/galleryServices";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/generated/prisma";


export async function GET(req: Request) {
  try {
    const galleryImages = await getAllGalleryImages()

    return NextResponse.json({
      message: 'Galeri resimleri başarıyla getirildi.',
      data: galleryImages
    }, {status: 200})
  } catch (err : any) {
    console.error('Galeri resimleri çekilirken hata oluştu: ' + err.message);
    return NextResponse.json({
      error: err.message || 'Galeri resimleri çekilemedi.'
    }, {status: 500})
  }
}

export async function POST(req:Request) {
  try {
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get('accessToken')?.value;
    const authHeader = req.headers.get('authorization');
    const headerToken = authHeader?.split(' ')[1];
    const token = headerToken || cookieToken;

    if (!token) {
      return NextResponse.json({
        error: 'Yetkisiz erişim'
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

      console.log('POST /api/gallery - Token verify başarılı');
      console.log('POST /api/gallery - userId:', userId);
      console.log('POST /api/gallery - tokenRole:', tokenRole);
      console.log('POST /api/gallery - payload:', payload);

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
            console.log('POST /api/gallery - Veritabanından alınan role:', userRole);
          } else {
            console.log('POST /api/gallery - Kullanıcı veritabanında bulunamadı');
          }
        } catch (dbError: any) {
          console.error('POST /api/gallery - Veritabanı hatası:', dbError.message);
          // Veritabanı hatası olsa bile token'daki role'ü kullan
        }
      }

      // Role kontrolü (case-insensitive)
      const isAdmin = userRole?.toLowerCase() === 'admin' || userRole === 'admin';
      
      if (!isAdmin) {
        console.log('POST /api/gallery - Admin değil, erişim reddedildi. userRole:', userRole);
        return NextResponse.json({
          error: 'Bu işlem için izniniz yok. Sadece admin yapabilir. (Role: ' + userRole + ')'
        }, { status: 403 })
      }

      console.log('POST /api/gallery - Admin yetkisi doğrulandı, devam ediliyor');
    } catch (tokenError: any) {
      console.error('POST /api/gallery - Token verify hatası:', tokenError.message);
      return NextResponse.json({
        error: 'Geçersiz token: ' + tokenError.message
      }, { status: 401 })
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({
        error: 'Dosya bulunamadı.'
      }, { status: 400 })
    }

    const savedImage = await createGalleryImage(formData)

    return NextResponse.json({
      message: 'Galeri resmi başarıyla yüklendi.',
      data: savedImage
    }, { status: 201 })

  } catch (err : any) {
    console.error('Galeri resmi yüklenirken hata oluştu: ' + err.message);
    return NextResponse.json({
      error: 'Yükleme başarısız',
      details: err.message
    }, { status: 500 });
  }
}










