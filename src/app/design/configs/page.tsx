import { cookies } from "next/headers";
import { prisma } from "@/generated/prisma";
import Template1Content from "../template-1/component/template-1";
import Template2Content from "../template-2/component/template-2";
import Template3Content from "../template-3/component/template-3";
import Template4Content from "../template-4/component/template-4";
import Template5Content from "../template-5/component/template-5";
import Template6Content from "../template-6/component/template-6";
import { defaultBurgers } from "../template-data";
import { menuItems } from "../template-data";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Promise<{ configId?: string; preview?: string }>;
};

export default async function ConfigsPage({ searchParams }: Props) {
  const params = await searchParams;
  const configId = params.configId;
  const isPreview = params.preview === 'true';

  if (!configId) {
    notFound();
  }

  if (isPreview) {
    return (
      <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <Template2Content menuItems={menuItems} />
      </div>
    );
  }

  try {
    const config = await prisma.templateConfig.findUnique({
      where: { id: configId },
      include: {
        Template: true,
      },
    });

    if (!config) {
      return (
        <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="text-center text-red-500">
            Config bulunamadı veya bu config'e erişim yetkiniz yok.
          </div>
        </div>
      );
    }

    if (!config.Template) {
      return (
        <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="text-center text-red-500">
            Template bilgisi bulunamadı.
          </div>
        </div>
      );
    }

    const component = config.Template.component;
    const configData = config.configData as any;

    // Component'e göre ilgili template'i render et
    switch (component) {
      case 'template-1': {
        let burgerItems = defaultBurgers;

        if (configData) {
          const template1Data = configData as {
            category?: string;
            data?: Array<{ name: string; price: string; image?: string }>;
          };

          if (template1Data.data && Array.isArray(template1Data.data) && template1Data.data.length > 0) {
            burgerItems = template1Data.data.map((item, index) => ({
              id: index + 1,
              name: item.name || '',
              price: item.price ? item.price.replace(/[^\d]/g, '') : '0',
              img: item.image || "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
              heroIMG: item.image || "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1000&auto=format&fit=crop",
              heroTitle: item.name || 'Menü',
              category: template1Data.category || '',
            }));

            // En az 6 item olmalı
            while (burgerItems.length < 6) {
              const defaultItem = defaultBurgers[burgerItems.length];
              burgerItems.push(defaultItem || {
                id: burgerItems.length + 1,
                name: '',
                price: '0',
                img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
                heroIMG: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1000&auto=format&fit=crop",
                heroTitle: 'Menü',
                category: '',
              });
            }
          }
        }

        return (
          <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <Template1Content burgerItems={burgerItems} />
          </div>
        );
      }

      case 'template-2': {
        let menuItemsData = menuItems;

        if (configData) {
          const template2Data = configData as {
            categories?: Record<string, string>;
            data?: Record<string, Array<{ name: string; price: string; productId?: string; priceType?: string }>>;
            category?: string;
          };

          // Yeni format: kategori bazlı veri
          if (template2Data.data && typeof template2Data.data === 'object' && !Array.isArray(template2Data.data)) {
            const allItems: typeof menuItems = [];
            Object.entries(template2Data.data).forEach(([categorySlot, items]) => {
              if (Array.isArray(items)) {
                items.forEach((item) => {
                  if (item && item.name && item.name.trim() !== '') {
                    allItems.push({
                      name: item.name || '',
                      price: item.price || '0',
                      desc: "",
                      category: categorySlot,
                    });
                  }
                });
              }
            });
            if (allItems.length > 0) {
              menuItemsData = allItems;
            }
          }
          // Eski format: tek kategori
          else if (template2Data.data && Array.isArray(template2Data.data) && template2Data.data.length > 0) {
            menuItemsData = template2Data.data
              .filter(item => item && item.name && item.name.trim() !== '')
              .map((item) => ({
                name: item.name || '',
                price: item.price || '0',
                desc: "",
                category: template2Data.category || '',
              }));
          }
        }

        return (
          <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <Template2Content menuItems={menuItemsData} />
          </div>
        );
      }

      case 'template-3': {
        return (
          <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <Template3Content />
          </div>
        );
      }

      case 'template-4': {
        return (
          <Template4Content />
        );
      }

      case 'template-5': {
        let burgerItems = defaultBurgers;

        if (configData) {
          const template5Data = configData as {
            category?: string;
            data?: Array<{ name: string; price: string; image?: string }>;
          };

          if (template5Data.data && Array.isArray(template5Data.data) && template5Data.data.length > 0) {
            burgerItems = template5Data.data.map((item, index) => ({
              id: index + 1,
              name: item.name || '',
              price: item.price ? item.price.replace(/[^\d]/g, '') : '0',
              img: item.image || "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
              heroIMG: item.image || "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1000&auto=format&fit=crop",
              heroTitle: item.name || 'Menü',
              category: template5Data.category || '',
            }));

            // En az 4 item olmalı (template-5 için max 4)
            while (burgerItems.length < 4) {
              const defaultItem = defaultBurgers[burgerItems.length];
              burgerItems.push(defaultItem || {
                id: burgerItems.length + 1,
                name: '',
                price: '0',
                img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
                heroIMG: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1000&auto=format&fit=crop",
                heroTitle: 'Menü',
                category: '',
              });
            }
          }
        }

        // Template-5 için maksimum 4 ürün
        if (Array.isArray(burgerItems) && burgerItems.length > 4) {
          burgerItems = burgerItems.slice(0, 4);
        }

        return (
          <Template5Content burgerItems={burgerItems} />
        );
      }

      case 'template-6': {
        let burgerItems = defaultBurgers;

        if (configData) {
          const template6Data = configData as {
            category?: string;
            data?: Array<{ name: string; price: string; image?: string }>;
          };

          if (template6Data.data && Array.isArray(template6Data.data) && template6Data.data.length > 0) {
            burgerItems = template6Data.data.map((item, index) => ({
              id: index + 1,
              name: item.name || '',
              price: item.price ? item.price.replace(/[^\d]/g, '') : '0',
              img: item.image || "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
              heroIMG: item.image || "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1000&auto=format&fit=crop",
              heroTitle: item.name || 'Menü',
              category: template6Data.category || '',
            }));

            // En az 4 item olmalı (template-6 için max 4)
            while (burgerItems.length < 4) {
              const defaultItem = defaultBurgers[burgerItems.length];
              burgerItems.push(defaultItem || {
                id: burgerItems.length + 1,
                name: '',
                price: '0',
                img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
                heroIMG: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1000&auto=format&fit=crop",
                heroTitle: 'Menü',
                category: '',
              });
            }
          }
        }

        // Template-6 için maksimum 4 ürün
        if (Array.isArray(burgerItems) && burgerItems.length > 4) {
          burgerItems = burgerItems.slice(0, 4);
        }

        return (
          <Template6Content burgerItems={burgerItems} />
        );
      }

      default:
        return (
          <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="text-center text-red-500">
              Bilinmeyen template component: {component}
            </div>
          </div>
        );
    }
  } catch (error) {
    console.error('Config yüklenirken hata:', error);
    return (
      <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="text-center text-red-500">
          Config yüklenirken bir hata oluştu.
        </div>
      </div>
    );
  }
}

