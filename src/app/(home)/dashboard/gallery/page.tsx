import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Gallery } from "./components/gallery";
import { cookies } from "next/headers";
import * as jose from "jose";
import { getAllGalleryImages } from "@/services/galleryServices";
import prisma from "@/generated/prisma";

async function getUserRole(): Promise<'admin' | 'user'> {
  try {
    const cookieStore = await cookies();
    
    // Önce user cookie'den userId'yi al
    const userCookie = cookieStore.get('user')?.value;
    let userId: string | null = null;

    if (userCookie) {
      try {
        const user = JSON.parse(userCookie) as { id?: string; role?: string };
        userId = user.id || null;
        // Eğer user cookie'de role varsa onu kullan
        if (user.role === 'admin') {
          return 'admin';
        }
      } catch (e) {
        // User cookie parse edilemediyse token'dan al
      }
    }

    // Token'dan userId ve role al
    const cookieToken = cookieStore.get('accessToken')?.value;

    if (cookieToken && process.env.ACCES_TOKEN_SECRET) {
      try {
        const secret = new TextEncoder().encode(process.env.ACCES_TOKEN_SECRET);
        const { payload } = await jose.jwtVerify(cookieToken, secret);
        const tokenUserId = (payload as any).userId;
        const tokenRole = (payload as any).role;

        if (!userId) {
          userId = tokenUserId;
        }

        // Token'dan role alındıysa onu kullan
        if (tokenRole === 'admin') {
          return 'admin';
        }
      } catch (tokenError) {
        console.error('Token verify-mail hatası:', tokenError);
      }
    }

    // Veritabanından user'ı bul ve role'ünü al
    if (userId) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true }
        });

        if (user && user.role === 'admin') {
          return 'admin';
        }
      } catch (dbError) {
        console.error('Veritabanı hatası:', dbError);
      }
    }

    return 'user';
  } catch (error) {
    console.error('Role kontrolü hatası:', error);
    return 'user';
  }
}

export default async function GalleryPage() {
  const userRole = await getUserRole();
  console.log('GalleryPage - userRole:', userRole);
  
  let galleryImages = [];
  try {
    galleryImages = await getAllGalleryImages();
  } catch (error) {
    console.error('Galeri resimleri çekilirken hata:', error);
    galleryImages = [];
  }

  // Format data
  const formattedData = galleryImages.map((item: any) => ({
    id: item.id,
    name: item.name,
    type: 'image' as 'image' | 'video',
    url: item.url,
    uploadedAt: item.createdAt.toLocaleDateString("tr-TR"),
    duration: 0,
  }));

  return (
    <>

      <div className="mt-4 md:mt-6 2xl:mt-9">
        <Gallery initialData={formattedData} userRole={userRole} />
      </div>
    </>
  );
}