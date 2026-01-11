import Template2Content from "./component/template-2";
import { menuItems } from "../template-data";
import { getTemplateConfig } from "@/services/templateServices";
import { cookies } from "next/headers";

type Props = {
  searchParams: Promise<{ preview?: string; configId?: string }>;
};

export default async function Template2Page({ searchParams }: Props) {
  const params = await searchParams;
  const isPreview = params.preview === 'true';
  const configId = params.configId;
  
  // Preview modunda sadece default ayarları göster
  let menuItemsData = menuItems;
  
  // Preview değilse kullanıcı config'ini kontrol et
  if (!isPreview) {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user')?.value;

    if (userCookie) {
      try {
        const user = JSON.parse(userCookie) as { id: string };
        const { prisma } = await import('@/generated/prisma');
        const template = await prisma.template.findFirst({
          where: { path: '/design/template-2' },
        });

        if (template) {
          const config = await getTemplateConfig(user.id, template.id, configId);

          if (config && config.configData) {
            const configData = config.configData as {
              categories?: Record<string, string>;
              data?: Record<string, Array<{ name: string; price: string; productId?: string; priceType?: string }>>;
              category?: string;
            };

            // Yeni format: kategori bazlı veri
            if (configData.data && typeof configData.data === 'object' && !Array.isArray(configData.data)) {
              const allItems: typeof menuItems = [];
              Object.entries(configData.data).forEach(([categorySlot, items]) => {
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
            else if (configData.data && Array.isArray(configData.data) && configData.data.length > 0) {
              menuItemsData = configData.data
                .filter(item => item && item.name && item.name.trim() !== '')
                .map((item) => ({
                  name: item.name || '',
                  price: item.price || '0',
                  desc: "",
                  category: configData.category || '',
                }));
            }
          }
        }
      } catch (error) {
        console.error('Template config çekilirken hata:', error);
      }
    }
  }
  
  return (
    <>
      <div style={{ height: '100vh' }} className="w-full rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <Template2Content menuItems={menuItemsData} />
      </div>
    </>
  );
}



