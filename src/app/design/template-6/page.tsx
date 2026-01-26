import { prisma } from "@/generated/prisma";
import Template6Content from "./component/template-6";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Promise<{ configId?: string }>;
};

export default async function Template6Page({ searchParams }: Props) {
  const params = await searchParams;
  const configId = params.configId;

  if (!configId) {
    // Config yoksa default göster
    return (
      <div className="w-full h-auto">
        <Template6Content />
      </div>
    );
  }

  try {
    const config = await prisma.templateConfig.findUnique({
      where: { id: configId },
      include: { Template: true },
    });

    if (!config || !config.Template || config.Template.component !== 'template-6') {
      notFound();
    }

    const configData = config.configData as any;

    return (
      <div className="w-full h-auto">
        <Template6Content
          brandName={configData?.brandName}
          menuItems={configData?.menuItems}
        />
      </div>
    );
  } catch (error) {
    console.error('Config yüklenirken hata:', error);
    notFound();
  }
}


