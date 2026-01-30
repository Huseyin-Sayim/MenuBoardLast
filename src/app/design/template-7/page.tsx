import { prisma } from "@/generated/prisma";
import Template7Content from "./component/template-7";
import { template7Grid, template7Hero, template7Sidebar } from "../template-data";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Promise<{ configId?: string }>;
};

export default async function Template7Page({ searchParams }: Props) {
  const params = await searchParams;
  const configId = params.configId;

  if (!configId) {
    // Config yoksa default göster
    return (
      <div className="w-full h-auto">
        <Template7Content
          hero={template7Hero}
          sidebarItems={template7Sidebar}
          gridItems={template7Grid}
        />
      </div>
    );
  }

  try {
    const config = await prisma.templateConfig.findUnique({
      where: { id: configId },
      include: { Template: true },
    });

    if (!config || !config.Template || config.Template.component !== 'template-7') {
      notFound();
    }

    const configData = config.configData as any;

    return (
      <div className="w-full h-auto">
        <Template7Content
          brand={configData?.brand}
          hero={configData?.hero}
          sidebarItems={configData?.sidebarItems}
          gridItems={configData?.gridItems}
        />
      </div>
    );
  } catch (error) {
    console.error('Config yüklenirken hata:', error);
    notFound();
  }
}



