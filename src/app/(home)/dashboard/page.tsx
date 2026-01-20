import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { Suspense } from "react";
import { ImageSlider } from "@/app/(home)/_components/image-slider";
import { Gallery } from "@/app/(home)/dashboard/gallery/components/gallery";
import { getAllGalleryImages } from "@/services/galleryServices";
import { getAllTemplates } from "@/services/templateServices";
import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/generated/prisma";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

// Default config'leri tanımla
const getDefaultConfig = (component: string) => {
  if (component === 'template-1') {
    return {
      category: "Ana Menü",
      data: [
        { name: "Örnek Ürün 1", price: "100,00" },
        { name: "Örnek Ürün 2", price: "150,00" }
      ]
    };
  }

  if (component === 'template-2') {
    return {
      categories: {
        "Ana Yemekler": "#FF5733",
        "İçecekler": "#33FF57",
        "Tatlılar": "#3357FF"
      },
      data: {
        "Ana Yemekler": [
          { name: "Örnek Yemek 1", price: "200,00" }
        ],
        "İçecekler": [
          { name: "Örnek İçecek 1", price: "50,00" }
        ],
        "Tatlılar": []
      }
    };
  }

  return { category: "", data: [] };
};

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

async function getTemplates() {
  try {
    const templates = await getAllTemplates();

    if (!templates || !Array.isArray(templates)) {
      return [];
    }

    return templates.map((template) => ({
      id: template.id,
      name: template.name,
      path: template.path,
      component: template.component,
      defaultConfig: getDefaultConfig(template.component)
    }));
  } catch (error) {
    console.error('Template\'ler getirilemedi:', error);
    return [];
  }
}

export default async function Dashboard({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;

  const cookieStore = await cookies();
  const userCookies = cookieStore.get('user')?.value;

  if (!userCookies) {
    return <div>Kullanıcı oturumu bulunamadı.</div>
  }

  const user = JSON.parse(userCookies) as {id: string};

  const userRole = await getUserRole();
  let galleryImages = [];
  try {
    galleryImages = await getAllGalleryImages();
  } catch (error) {
    console.error('Galeri resimleri çekilirken hata:', error);
    galleryImages = [];
  }

  const formattedData = galleryImages.map((item: any) => ({
    id: item.id,
    name: item.name,
    type: 'image' as 'image' | 'video',
    url: item.url,
    uploadedAt: item.createdAt.toLocaleDateString("tr-TR"),
    duration: 0,
  }));

  const templates = await getTemplates();

  return (
    <>
      <div className="mt-4 space-y-4 md:mt-6 md:space-y-6 2xl:mt-9 2xl:space-y-7.5">
        <div className="w-full">
          {templates.length > 0 ? (
            <ImageSlider templates={templates} />
          ) : (
            <ImageSlider
              images={[
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-02.jpg",
                "/images/carousel/carousel-03.jpg",
                "/images/cover/cover-03.jpg",
                "/images/task/task-01.jpg",
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-02.jpg",
                "/images/carousel/carousel-03.jpg",
                "/images/cover/cover-03.jpg",
                "/images/task/task-01.jpg",
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-02.jpg",
                "/images/carousel/carousel-03.jpg",
                "/images/cover/cover-03.jpg",
                "/images/task/task-01.jpg",
              ]}
            />
          )}
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          <div className="col-span-12 lg:col-span-6">
            <Suspense fallback={<TopChannelsSkeleton />}>
              <TopChannels showActions={false} />
            </Suspense>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <Gallery initialData={formattedData} userRole={userRole} showActions={false} />
          </div>
        </div>
      </div>
    </>
  );
}


