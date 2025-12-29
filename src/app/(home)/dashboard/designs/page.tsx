import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DesignStore } from "./_components/design-store";

export default function DesignsPage() {
  return (
    <>
      <Breadcrumb pageName="" />
      
      <div className="mt-4 md:mt-6 2xl:mt-9">
        <DesignStore />
      </div>
    </>
  );
}

