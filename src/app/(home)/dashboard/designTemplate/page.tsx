"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Template = {
  id: string;
  name: string;
  path: string;
  component: string;
};

export default function DesignTemplatePage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTemplates = async () => {
      try {
        const response = await fetch("/api/userTemplate");
        if (response.ok) {
          const result = await response.json();
          setTemplates(result.data || []);
        } else {
          console.error("Kullanıcı template'leri getirilemedi");
        }
      } catch (error) {
        console.error("Kullanıcı template'leri getirilirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTemplates();
  }, []);

  const handleTemplateClick = (templateComponent: string) => {
    router.push(`/dashboard/designTemplate/${templateComponent}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-6 text-3xl font-bold text-dark dark:text-white">
          Şablonlar
        </h1>
        <div className="flex items-center justify-center py-12">
          <p className="text-dark-4 dark:text-dark-6">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold text-dark dark:text-white">
        Şablonlar
      </h1>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-4 dark:text-dark-6">
            Henüz şablonunuz bulunmamaktadır. Şablon almak için /dashboard/designs sayfasına gidin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group cursor-pointer overflow-hidden rounded-lg border border-stroke bg-white shadow-sm transition-all hover:shadow-lg dark:border-stroke-dark dark:bg-gray-dark"
              onClick={() => handleTemplateClick(template.component)}
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
      )}
    </div>
  );
}