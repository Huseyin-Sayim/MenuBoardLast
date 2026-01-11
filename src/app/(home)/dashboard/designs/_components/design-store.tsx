"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Template = {
  id: string;
  name: string;
  path: string;
  component: string;
  defaultConfig: any;
};

interface DesignStoreProps {
  templates: Template[];
}

export function DesignStore({ templates }: DesignStoreProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [userTemplateIds, setUserTemplateIds] = useState<string[]>([]);
  const [loadingUserTemplates, setLoadingUserTemplates] = useState(true);
  const [acquiringTemplateId, setAcquiringTemplateId] = useState<string | null>(null);
  const router = useRouter();

  // Kullanıcının sahip olduğu template'leri çek
  useEffect(() => {
    const fetchUserTemplates = async () => {
      try {
        const response = await fetch("/api/userTemplate");
        if (response.ok) {
          const result = await response.json();
          // Template objelerinden sadece ID'leri çıkar
          const templateIds = (result.data || []).map((t: any) => t.id);
          setUserTemplateIds(templateIds);
        } else {
          console.error("Kullanıcı template'leri getirilemedi");
        }
      } catch (error) {
        console.error("Kullanıcı template'leri getirilirken hata:", error);
      } finally {
        setLoadingUserTemplates(false);
      }
    };

    fetchUserTemplates();
  }, []);

  // Şablon al
  const handleAcquireTemplate = async (template: Template, e: React.MouseEvent) => {
    e.stopPropagation(); // Kart'a tıklama event'ini durdur
    
    if (acquiringTemplateId) return; // Zaten bir istek devam ediyorsa
    
    setAcquiringTemplateId(template.id);
    
    try {
      const response = await fetch(`/api/templates/${template.id}/acquire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        // Oluşturulan configId ve component ile yönlendir
        const configId = result.data?.id;
        const component = result.data?.component || template.component;
        
        if (configId) {
          router.push(`/dashboard/designTemplate/${component}?configId=${configId}`);
        } else {
          // Fallback: component ile yönlendir (configId yoksa)
          router.push(`/dashboard/designTemplate/${component}`);
        }
      } else {
        alert(result.message || "Şablon alınırken bir hata oluştu");
      }
    } catch (error: any) {
      console.error("Şablon alınırken hata:", error);
      alert("Şablon alınırken bir hata oluştu: " + error.message);
    } finally {
      setAcquiringTemplateId(null);
    }
  };

  // Config özetini göster
  const getConfigSummary = (template: Template) => {
    const config = template.defaultConfig;

    if (template.component === 'template-1') {
      return `Kategori: ${config.category || 'Yok'}, Ürün Sayısı: ${config.data?.length || 0}`;
    }

    if (template.component === 'template-2') {
      const categoryCount = Object.keys(config.categories || {}).length;
      const totalItems = Object.values(config.data || {}).reduce(
        (sum: number, items: any) => sum + (Array.isArray(items) ? items.length : 0),
        0
      );
      return `Kategori Sayısı: ${categoryCount}, Toplam Ürün: ${totalItems}`;
    }

    return 'Varsayılan ayarlar';
  };

  // Preview URL oluştur - preview=true parametresi ekle
  const getPreviewUrl = (path: string) => {
    return `${path}?preview=true`;
  };

  // Template önizlemesini aç
  const openPreview = (template: Template) => {
    setSelectedTemplate(template);
  };

  // Geri dön
  const closePreview = () => {
    setSelectedTemplate(null);
  };

  // Template tipine göre yükseklik belirle
  const getTemplateHeight = (component: string) => {
    // Template-2 için özel yükseklik (içerik yüksekliğine göre)
    if (component === 'template-2') {
      return { height: '100vh', overflow: 'hidden' };
    }
    // Diğer template'ler için
    return { minHeight: '80vh' };
  };

  // Eğer template seçildiyse, tam görünümü göster
  if (selectedTemplate) {
    const templateStyle = getTemplateHeight(selectedTemplate.component);
    
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-body-2xlg font-bold text-dark dark:text-white mb-2">
              {selectedTemplate.name}
            </h2>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              Şablon Önizlemesi
            </p>
          </div>
          <button
            onClick={closePreview}
            className="flex items-center gap-2 rounded-lg bg-gray-2 px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Geri Dön
          </button>
        </div>

        {/* Template Tam Görünümü */}
        <div 
          className="relative w-full rounded-lg border border-stroke bg-gray-2 dark:border-stroke-dark dark:bg-dark-2"
          style={templateStyle}
        >
          <iframe
            src={getPreviewUrl(selectedTemplate.path)}
            className="w-full border-0"
            style={templateStyle}
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // Liste görünümü
  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-6">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white mb-4">
          Şablonlar
        </h2>
      </div>

      {/* Template Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const hasTemplate = userTemplateIds.includes(template.id);
          const isAcquiring = acquiringTemplateId === template.id;

          return (
            <div
              key={template.id}
              className="group relative rounded-lg border border-stroke bg-white overflow-hidden shadow-card hover:shadow-card-2 transition-all dark:border-stroke-dark dark:bg-dark-2"
            >
              {/* Iframe Önizleme - preview=true ile */}
              <div 
                className="relative aspect-video w-full overflow-hidden bg-gray-2 dark:bg-dark-3 cursor-pointer"
                onClick={() => openPreview(template)}
              >
                <iframe
                  src={getPreviewUrl(template.path)}
                  className="absolute inset-0 border-0 pointer-events-none"
                  style={{
                    transform: 'scale(0.25)',
                    transformOrigin: 'top left',
                    width: '400%',
                    height: '400%'
                  }}
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/90 text-white px-4 py-2 rounded-lg font-medium">
                    Önizlemeyi Aç
                  </div>
                </div>
              </div>

              <div className="p-7">
                <h3 className="text-lg font-semibold text-dark dark:text-white mb-3">
                  {template.name}
                </h3>
                
                {/* Butonlar - Her zaman göster */}
                {!loadingUserTemplates && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleAcquireTemplate(template, e)}
                      disabled={isAcquiring}
                      className="flex-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-600 dark:hover:bg-green-700"
                    >
                      {isAcquiring ? "Alınıyor..." : "Şablon Al"}
                    </button>
                  </div>
                )}
                
                {loadingUserTemplates && (
                  <div className="h-10 flex items-center justify-center">
                    <div className="text-sm text-dark-4 dark:text-dark-6">Yükleniyor...</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-dark-4 dark:text-dark-6">
            Henüz şablon bulunmamaktadır.
          </p>
        </div>
      )}
    </div>
  );
}