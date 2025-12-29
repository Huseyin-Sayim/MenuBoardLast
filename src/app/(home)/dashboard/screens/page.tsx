import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Suspense } from "react";

export default function ScreensPage() {
  return (
    <>
      <Breadcrumb pageName="" />
      
      <div className="mt-4 md:mt-6 2xl:mt-9">
        <Suspense fallback={<TopChannelsSkeleton />}>
          <TopChannels />
        </Suspense>
      </div>
    </>
  );
}

