import { cookies } from "next/headers";
import { prisma } from "@/generated/prisma";
import Template5Content from "./component/template-5";
import { template5Featured, template5Items } from "../template-data";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Promise<{ configId?: string }>;
};

export default async function Template5Page({ searchParams }: Props) {
  const params = await searchParams;
  const configId = params.configId;

  if (!configId) {
    // Config yoksa default göster
    return (
      <div className="w-full h-auto">
        <Template5Content
          featuredProduct={template5Featured}
          menuItems={template5Items}
        />
      </div>
    );
  }

  try {
    const config = await prisma.templateConfig.findUnique({
      where: { id: configId },
      include: { Template: true },
    });

    if (!config || !config.Template || config.Template.component !== 'template-5') {
      notFound();
    }

    const configData = config.configData as any;

    return (
      <div className="w-full h-auto">
        <Template5Content
          featuredProduct={configData?.featuredProduct}
          menuItems={configData?.menuItems}
        />
      </div>
    );
  } catch (error) {
    console.error('Config yüklenirken hata:', error);
    notFound();
  }
}


