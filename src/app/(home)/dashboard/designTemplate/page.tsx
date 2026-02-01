"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Template = {
  id: string; // Config ID
  templateId: string; // Template ID
  name: string;
  path: string;
  component: string;
  configId: string;
  snapshotUrl?: string; // Snapshot resmi URL'i
  createdAt: string;
  updatedAt: string;
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

  const handleTemplateClick = (templateComponent: string, configId: string) => {
    router.push(`/dashboard/designTemplate/${templateComponent}?configId=${configId}`);
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
    <div className="container w-full mx-auto p-6">


      {templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-4 dark:text-dark-6">
            Henüz şablonunuz bulunmamaktadır. Şablon eklemek için şablonlar sayfasına gidin.
          </p>
        </div>
      ) : (
        <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card h-[75vh] overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-body-2xlg font-bold text-dark dark:text-white mb-2">
              Şablonlar
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group cursor-pointer overflow-hidden rounded-lg border border-stroke bg-white shadow-sm transition-all hover:shadow-lg dark:border-stroke-dark dark:bg-gray-dark"
                onClick={() => handleTemplateClick(template.component, template.configId)}
              >
                {/* Önizleme - Snapshot veya Canlı iframe */}
                <div
                  className="relative w-full bg-gray-2 dark:bg-dark-2"
                  style={{ aspectRatio: '16/9', overflow: 'hidden' }}
                >
                  {template.snapshotUrl ? (
                    <img
                      src={template.snapshotUrl}
                      alt={template.name}
                      className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    /* Snapshot yoksa canlı iframe önizleme */
                    <iframe
                      src={`${template.path}?preview=true&configId=${template.configId}`}
                      className="absolute top-0 left-0 border-0 pointer-events-none"
                      style={{
                        transform: 'scale(0.2)',
                        transformOrigin: 'top left',
                        width: '1920px',
                        height: '1080px',
                      }}
                      title={template.name}
                      scrolling="no"
                    />
                  )}
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
      )}
    </div>
  );
}

