import { prisma } from "@/generated/prisma";
import Template4BurgerMenu, { Template4MenuItem } from "./component/template-4";

type Props = {
  searchParams: Promise<{ configId?: string }>;
};

export default async function Template4Page({ searchParams }: Props) {
  const params = await searchParams;
  const configId = params.configId;

  // Eğer configId yoksa default menuItems ile göster
  if (!configId) {
    return <Template4BurgerMenu />;
  }

  try {
    const config = await prisma.templateConfig.findUnique({
      where: { id: configId },
      include: {
        Template: true,
      },
    });

    // Config bulunamadıysa veya template-4 değilse default menuItems ile göster
    if (!config || !config.Template || config.Template.component !== 'template-4') {
      return <Template4BurgerMenu />;
    }

    // Prisma'dan gelen configData JSON olabilir, parse et
    let configData: any;
    try {
      configData = typeof config.configData === 'string' 
        ? JSON.parse(config.configData) 
        : config.configData;
    } catch (e) {
      configData = config.configData;
    }
    
    console.log('Template-4 public route configData:', JSON.stringify(configData, null, 2));
    console.log('Template-4 public route configData type:', typeof config.configData);
    console.log('Template-4 public route configData.promoProduct:', configData?.promoProduct);
    let items: Template4MenuItem[] = [];
    let promoProduct: { name?: string; price?: string; currency?: string; cents?: string; image?: string } | undefined = undefined;
    let promoImage: string | undefined = undefined;

    if (configData && configData.data && Array.isArray(configData.data)) {
      items = configData.data
        .filter((item: any) => item && item.name && item.name.trim() !== '')
        .map((item: any) => ({
          name: item.name || '',
          price: item.price ? item.price.replace(/[^\d]/g, '') : '0',
          description: item.description || '',
          image: item.image || "/images/burger_menu.svg",
          badge: null,
        }));

      // En az 8 item olmalı (template-4'te 8 slot var)
      while (items.length < 8) {
        items.push({
          name: '',
          price: '0',
          description: '',
          image: "/images/burger_menu.svg",
          badge: null,
        });
      }
    }

    // Promo product'ı çek
    if (configData && configData.promoProduct) {
      const promo = configData.promoProduct;
      console.log('Template-4 public route promoProduct found:', JSON.stringify(promo, null, 2));
      // Image'i önce al, sonra promoProduct'ı oluştur
      const promoImageValue = promo.image || undefined;
      promoProduct = {
        name: promo.name,
        price: promo.price,
        currency: promo.currency || '₺',
        cents: promo.cents || '.00',
        image: promoImageValue,
      };
      // Promo image'i ayrı prop olarak da geç
      promoImage = promoImageValue;
    } else {
      console.log('Template-4 public route: No promoProduct in configData');
    }

    console.log('Template-4 public route final props:', { 
      itemsCount: items.length, 
      promoProduct: JSON.stringify(promoProduct, null, 2), 
      promoImage 
    });

    return (
      <Template4BurgerMenu 
        items={items.length > 0 ? items : undefined}
        promoProduct={promoProduct}
        promoImage={promoImage}
      />
    );
  } catch (error) {
    console.error('Config yüklenirken hata:', error);
    // Hata durumunda default menuItems ile göster
    return <Template4BurgerMenu />;
  }
}


