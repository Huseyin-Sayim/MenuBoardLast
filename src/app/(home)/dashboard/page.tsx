import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { Suspense } from "react";
import { ImageSlider } from "@/app/(home)/_components/image-slider";
import { MediaGallery } from "@/app/(home)/dashboard/media/_components/media-gallery";
import { getFormattedMedia} from "@/services/mediaServices";
import { getAllTemplates } from "@/services/templateServices";
import { cookies } from "next/headers";

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

  const formattedData = await getFormattedMedia(user.id);
  const templates = await getTemplates();

  return (
    <>
      <div className="mt-4 space-y-4 md:mt-6 md:space-y-6 2xl:mt-9 2xl:space-y-7.5">
        {/* Template Slider - Üstte tam genişlikte */}
        <div className="w-full">
          {templates.length > 0 ? (
            <ImageSlider templates={templates} />
          ) : (
            <ImageSlider
              images={[
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-01.jpg",
                "/images/carousel/carousel-01.jpg",
              ]}
            />
          )}
        </div>

        {/* Screens ve Media - Altta yan yana */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          {/* Ekranlar Tablosu */}
          <div className="col-span-12 lg:col-span-6">
            <Suspense fallback={<TopChannelsSkeleton />}>
              <TopChannels showActions={false} />
            </Suspense>
          </div>

          {/* Medya Tablosu */}
          <div className="col-span-12 lg:col-span-6">
            <MediaGallery showActions={false} initialData={formattedData} gridCols="grid-cols-4" maxHeight="400px" disableClick={true} />
          </div>
        </div>
      </div>
    </>
  );
}


