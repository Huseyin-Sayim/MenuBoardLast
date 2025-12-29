import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { Suspense } from "react";
import { ImageSlider } from "@/app/(home)/_components/image-slider";
import { MediaGallery } from "@/app/(home)/dashboard/media/_components/media-gallery";
import { getFormattedMedia} from "@/services/mediaServices";
import { cookies } from "next/headers";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Dashboard({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;

  const cookieStore = await cookies();
  const userCookies = cookieStore.get('user')?.value;

  if (!userCookies) {
    return <div>Kullanıcı oturumu bulunamadı.</div>
  }

  const user = JSON.parse(userCookies) as {id: string};

  const formattedData = await getFormattedMedia(user.id);
  return (
    <>
      <div className=" mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        {/* Ekranlar Tablosu/Medya Tablosu */}
        <div className="col-span-6 media-screen">
          <div className="col-span-12 xl:col-span-6">
            <Suspense fallback={<TopChannelsSkeleton />}>
              <TopChannels showActions={false} />
            </Suspense>
          </div>
          <div className="w-full mt-4 md:mt-6 2xl:mt-9">
            <MediaGallery showActions={false} initialData={formattedData} gridCols="grid-cols-4" maxHeight="400px" disableClick={true} />
          </div>
        </div>

        {/* Image Slider */}
        <div className="col-span-12 xl:col-span-6">
          <ImageSlider
            images={[
              "/images/carousel/carousel-01.jpg",
              "/images/carousel/carousel-02.jpg",
              "/images/carousel/carousel-03.jpg",
              "/images/cover/cover-01.png",
              "/images/cover/cover-02.jpg",
              "/images/cover/cover-03.jpg",
              "/images/cover/cover-04.jpg",
              "/images/cover/cover-05.jpg",
              "/images/product/product-01.png",
              "/images/product/product-02.png",
              "/images/cards/cards-01.png",
              "/images/cards/cards-02.png",
            ]}
          />
        </div>
      </div>
    </>
  );
}


