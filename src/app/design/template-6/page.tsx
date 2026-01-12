import Template6Content from "./component/template-6";
import { defaultBurgers } from "../template-data";
import { cookies } from "next/headers";
import { getTemplateConfig } from "@/services/templateServices";

type Props = {
  searchParams: Promise<{ preview?: string; configId?: string }>;
};

export default async function Template6Page({ searchParams }: Props) {
  const params = await searchParams;
  const isPreview = params.preview === 'true';
  const configId = params.configId;
  
  let burgerItems = defaultBurgers;
  
  if (!isPreview) {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user')?.value;
    
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie) as { id: string };
        
        const { prisma } = await import('@/generated/prisma');
        const template = await prisma.template.findFirst({
          where: { path: '/design/template-6' },
        });
        
        if (template) {
          const config = await getTemplateConfig(user.id, template.id, configId);
          
          if (config && config.configData) {
            const configData = config.configData as {
              category?: string;
              data?: Array<{ name: string; price: string; image?: string }>;
            };
            
            if (configData.data && configData.data.length > 0) {
              burgerItems = configData.data.map((item, index) => ({
                id: index + 1,
                name: item.name || '',
                price: item.price ? item.price.replace(/[^\d]/g, '') : '0',
                img: item.image || "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
                heroIMG: item.image || "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1000&auto=format&fit=crop",
                heroTitle: item.name || 'Menü',
                category: configData.category || '',
              }));
              
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
        }
      } catch (error) {
        console.error('Template config çekilirken hata:', error);
      }
    }
  }
  
  return (
    <>
      <Template6Content burgerItems={burgerItems}/>
    </>
  );
}

