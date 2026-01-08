"use client";

import { useRouter } from "next/navigation";

type Template = {
  id: string;
  name: string;
  preview: string;
  path: string;
};

const templates: Template[] = [
  {
    id: "template-1",
    name: "Şablon 1",
    preview: "/images/cover/cover-01.png",
    path: "/design/template-1",
  },
  {
    id: "template-2",
    name: "Şablon 2",
    preview: "/images/cover/cover-02.jpg",
    path: "/design/template-2",
  },
  {
    id: "template-3",
    name: "Şablon 3",
    preview: "/images/cover/cover-03.jpg",
    path: "/design/template-3",
  },
];

export default function DesignTemplatePage() {
  const router = useRouter();

  const handleTemplateClick = (templateId: string) => {
    router.push(`/dashboard/designTemplate/${templateId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold text-dark dark:text-white">
        Şablonlar
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group cursor-pointer overflow-hidden rounded-lg border border-stroke bg-white shadow-sm transition-all hover:shadow-lg dark:border-stroke-dark dark:bg-gray-dark"
            onClick={() => handleTemplateClick(template.id)}
          >
            {/* Önizleme */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-2 dark:bg-dark-2">
              <iframe
                src={template.path}
                className="absolute inset-0 border-0"
                style={{
                  transform: `scale(${Math.min(400 / 1920, 225 / 1080)})`,
                  transformOrigin: "top left",
                  width: "1920px",
                  height: "1080px",
                }}
                title={`${template.name} Önizleme`}
                scrolling="no"
              />
            </div>

            {/* Bilgi */}
            <div className="border-t border-stroke p-4 dark:border-stroke-dark">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {template.name}
              </h3>
              <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
                Şablonu görüntülemek için tıklayın
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}