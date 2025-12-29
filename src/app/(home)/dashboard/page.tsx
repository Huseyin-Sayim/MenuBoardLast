import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { OverviewCardsGroup } from "@/app/(home)/_components/overview-cards";
import { OverviewCardsSkeleton } from "@/app/(home)/_components/overview-cards/skeleton";
import { ImageSlider } from "@/app/(home)/_components/image-slider";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Dashboard({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        {/* Ekranlar Tablosu */}
        <div className="col-span-12 xl:col-span-6">
          <Suspense fallback={<TopChannelsSkeleton />}>
            <TopChannels showActions={false} />
          </Suspense>
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


