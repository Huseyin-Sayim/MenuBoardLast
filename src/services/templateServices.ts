import { prisma } from '@/generated/prisma'
import { generateSnapshotForConfig } from './renderService'

export async function saveTemplateConfig(
  userId: string,
  templateId: string,
  configData: any, // Farklı template'ler farklı formatlar kullanıyor: { category, data } | { categories, data } | { featuredProduct, menuItems }
  configId?: string,
) {
  try {
    console.log('saveTemplateConfig çağrıldı:', { userId, templateId, configData, configId });

    let dbTemplateId = templateId;

    if (templateId.startsWith('template-')) {
      const path = `/design/${templateId}`;
      const templateName = templateId === 'template-1' ? 'Şablon 1' :
        templateId === 'template-2' ? 'Şablon 2' :
          templateId === 'template-3' ? 'Şablon 3' :
            templateId === 'template-3' ? 'Şablon 3' : 'Şablon';
      const component = templateId;

      let template = await prisma.template.findFirst({
        where: { path: path },
      });

      if (!template) {
        throw new Error(`Template bulunamadı: ${templateId}. Lütfen önce template'i oluşturun.`);
      }

      dbTemplateId = template.id;
    } else {
      const existingTemplate = await prisma.template.findUnique({
        where: { id: templateId },
      });

      if (!existingTemplate) {
        throw new Error(`Template bulunamadı: ${templateId}`);
      }
    }

    console.log('Kullanılacak dbTemplateId:', dbTemplateId);

    let saveConfig;

    // Eğer configId varsa, mevcut config'i kontrol et
    let existingConfig = null;
    if (configId) {
      existingConfig = await prisma.templateConfig.findFirst({
        where: {
          id: configId,
          userId, // Güvenlik: sadece kullanıcının kendi config'ini güncelleyebilir
        },
      });

      if (!existingConfig) {
        console.warn(`Config bulunamadı veya yetkiniz yok: ${configId}. Yeni config oluşturulacak.`);
      }
    }

    if (existingConfig) {
      // Mevcut config'i güncelle
      saveConfig = await prisma.templateConfig.update({
        where: {
          id: existingConfig.id,
        },
        data: {
          configData: configData as any,
          updatedAt: new Date(),
        },
      });
      console.log('Config güncellendi:', saveConfig);
    } else {
      // Yeni config oluştur
      saveConfig = await prisma.templateConfig.create({
        data: {
          userId,
          templateId: dbTemplateId,
          configData: configData as any,
        },
      });
      console.log('Config oluşturuldu:', saveConfig);
    }

    console.log('saveConfig sonucu:', saveConfig);

    if (!saveConfig) {
      console.error('saveConfig null veya undefined döndü');
      throw new Error("Tamplate verisi kaydedilemedi !!");
    }

    // Snapshot oluştur (arka planda, hata olsa bile config kaydedilmiş olur)
    // Async olarak çalıştır, response'u bekleme
    (async () => {
      try {
        // Template bilgisini al
        const template = await prisma.template.findUnique({
          where: { id: dbTemplateId },
        });

        if (template) {
          console.log('Generating snapshot for config:', saveConfig.id);

          // Template'e göre doğru path'i belirle
          let templatePath = '/design/configs';
          let snapshotWidth = 1920;
          let snapshotHeight = 1080;

          if (template.component === 'template-4') {
            // Template-4 için kendi sayfasını kullan
            templatePath = '/design/template-4';
          } else if (template.component === 'template-9' || template.component === 'template-11') {
            // Template-9 ve Template-11 dikey (portrait) ekran - 9:16 aspect ratio
            snapshotWidth = 1080;
            snapshotHeight = 1920;

          } else {
            // Diğer template'ler için configs endpoint'ini kullan
            templatePath = '/design/configs';
          }

          const { snapshotUrl, snapshotVersion } = await generateSnapshotForConfig(
            saveConfig.id,
            templatePath,
            snapshotWidth,
            snapshotHeight
          );

          // Snapshot bilgilerini güncelle
          await prisma.templateConfig.update({
            where: { id: saveConfig.id },
            data: {
              snapshotUrl,
              snapshotVersion,
            },
          });

          console.log('Snapshot generated and saved:', { snapshotUrl, snapshotVersion });
        }
      } catch (snapshotError: any) {
        // Snapshot hatası config kaydını engellemez, sadece log'lanır
        console.error('Snapshot oluşturulurken hata:', snapshotError);
      }
    })();

    return saveConfig;
  } catch (err: any) {
    console.error("Template verisi kaydedilirken hata oluştu:", err);
    console.error("Hata detayı:", err.message);
    console.error("Hata stack:", err.stack);

    if (err.code) {
      throw new Error(`Tamplate verisi kaydedilemedi: ${err.code} - ${err.message}`);
    }

    throw new Error(`Tamplate verisi kaydedilemedi: ${err.message}`);
  }
}

export async function getTemplateConfig(userId: string, templateId: string, configId?: string) {
  try {
    // Eğer configId verilmişse, direkt o config'i getir
    if (configId) {
      const config = await prisma.templateConfig.findFirst({
        where: {
          id: configId,
          userId, // Güvenlik: sadece kullanıcının kendi config'ini getirebilir
        },
      });

      if (!config) {
        throw new Error(`Config bulunamadı veya yetkiniz yok: ${configId}`);
      }

      return config;
    }

    let dbTemplateId = templateId;

    if (templateId.startsWith('template-')) {
      const path = `/design/${templateId}`;

      let template = await prisma.template.findFirst({
        where: { path: path },
      });

      if (!template) {
        throw new Error(`Template bulunamadı: ${templateId}. Lütfen önce template'i oluşturun.`);
      }

      dbTemplateId = template.id;
    }

    return await prisma.templateConfig.findFirst({
      where: {
        userId,
        templateId: dbTemplateId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (err: any) {
    console.log('Template verisi getirilirken hata oluştu: ', err.message);
    throw new Error('Tamplate verisi getirilemedi !!', err)
  }

}

export async function getAllTemplateConfigs(userId: string, templateId: string) {
  try {
    let dbTemplateId = templateId;

    if (templateId.startsWith('template-')) {
      const path = `/design/${templateId}`;

      let template = await prisma.template.findFirst({
        where: { path: path },
      });

      if (!template) {
        return []; // Template yoksa boş liste döndür
      }

      dbTemplateId = template.id;
    }

    return await prisma.templateConfig.findMany({
      where: {
        userId,
        templateId: dbTemplateId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (err: any) {
    console.error('Template config listesi getirilirken hata oluştu:', err.message);
    throw new Error('Template config listesi getirilemedi: ' + err.message);
  }
}

export async function getAllTemplates() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    });

    if (!templates || !Array.isArray(templates)) {
      return [];
    }

    return templates;
  } catch (err: any) {
    console.error('Template listesi getirilirken hata oluştu:', err.message);
    return [];
  }
}

export async function createTemplate(data: { name: string; path: string; component: string }) {
  try {
    const template = await prisma.template.create({
      data: {
        name: data.name,
        path: data.path,
        component: data.component,
      },
    });

    return template;
  } catch (err: any) {
    console.error('Template oluşturulurken hata oluştu:', err.message);
    throw new Error('Template oluşturulamadı: ' + err.message);
  }
}

export async function acquireTemplate(userId: string, templateId: string) {
  try {
    let dbTemplateId = templateId;
    let template;

    if (templateId.startsWith('template-')) {
      const path = `/design/${templateId}`;
      template = await prisma.template.findFirst({
        where: { path: path },
      });

      if (!template) {
        throw new Error(`Template bulunamadı: ${templateId}`);
      }

      dbTemplateId = template.id;
    } else {
      template = await prisma.template.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new Error(`Template bulunamadı: ${templateId}`);
      }
    }

    // Her zaman yeni config oluştur (mevcut config kontrolü yok)
    let defaultConfig: any = {};
    if (
      template.component === 'template-1' ||
      template.component === 'template-3' ||
      template.component === 'template-4'
    ) {
      defaultConfig = { category: "", data: [] };
    } else if (template.component === 'template-2') {
      defaultConfig = { categories: {}, data: {} };
    } else if (template.component === 'template-5') {
      defaultConfig = {
        featuredProduct: {
          logoImage: "/images/burger_logo.svg",
          productImage: "/images/burger+patato.png",
          label: "PREMIUM",
          title: "CHEESE",
          name: "WHOPPER",
          pricing: [
            { label: "Per 1", price: "₺0", cal: "300" },
            { label: "Per 2", price: "₺0", cal: "280" }
          ]
        },
        menuItems: Array.from({ length: 8 }, (_, i) => ({
          number: i + 1,
          category: "",
          name: "",
          image: "/images/burger_menu.svg",
          prices: [{ size: "Small", price: "₺0" }],
          isNew: false
        }))
      };
    } else if (template.component === 'template-6') {
      defaultConfig = {
        brandName: "mamaspizza",
        menuItems: Array.from({ length: 9 }, (_, i) => ({
          title: "",
          desc: "",
          price: "",
          image: "/images/pizza1.svg",
          isNew: false,
          isRed: false,
          hasTopPrice: false,
          fullImage: false,
          isLargeTitle: false
        }))
      };
    } else if (template.component === 'template-7') {
      defaultConfig = {
        brand: {
          shortName: "LA",
          fullName: "gyrogreek",
          phone: "(818)356-9676",
          logoImg: ""
        },
        hero: {
          logo: "/images/burger_logo.svg",
          titleTop: "GYRO",
          titleBottom: "FOOD",
          image: "/images/teavuk_dürüm.svg",
          promo: {
            title: "Only Today",
            value: "20%",
            label: "OFF"
          }
        },
        sidebarItems: [{
          title: "",
          desc: "",
          price: ""
        }],
        gridItems: Array.from({ length: 6 }, (_, i) => ({
          title: "",
          desc: "",
          price: "",
          variant: "white",
          image: "/images/teavuk_dürüm.svg"
        }))
      };
    } else if (template.component === 'template-8') {
      defaultConfig = {
        menuItems: [
          { name: "Caramel Macchiato", priceSmall: "₺220", priceLarge: "₺300" },
          { name: "Filtre Kahve", priceSmall: "₺220", priceLarge: "₺300" },
          { name: "White Mocha", priceSmall: "₺220", priceLarge: "₺300" },
          { name: "Mocha", priceSmall: "₺220", priceLarge: "₺300" },
          { name: "Strawbery Macha", priceSmall: "₺220", priceLarge: "₺300" },
          { name: "SALTED CARAMEL MOCHA", priceSmall: "₺220", priceLarge: "₺300" },
          { name: "COCONUT MİLK LATTE", priceSmall: "₺220", priceLarge: "₺300" },
          { name: "CHAI TEA LATTE", priceSmall: "₺220", priceLarge: "₺300" },
          { name: "GİGİBEBE", priceSmall: "₺220", priceLarge: "₺300" },
        ],
        hotItems: [
          {
            name: "AMERİCANO",
            price1Label: "BÜYÜK", price1Value: "₺145",
            price2Label: "KÜÇÜK", price2Value: "₺185"
          },
          {
            name: "LATTE",
            price1Label: "BÜYÜK", price1Value: "₺155",
            price2Label: "KÜÇÜK", price2Value: "₺195"
          },
          {
            name: "ESPRESSO",
            price1Label: "SİNGLE", price1Value: "₺90",
            price2Label: "DUBBLE", price2Value: "₺100"
          }
        ],
        forYouItems: [
          { name: "V60", price: "₺250" },
          { name: "Chemex", price: "₺250" },
          { name: "Cold Brew", price: "₺250" },
          { name: "Syphon", price: "₺250" }
        ]
      };
    } else if (template.component === 'template-9') {
      defaultConfig = {
        menuItems: [
          { name: "Americano", price: "150" },
          { name: "Latte", price: "120" },
          { name: "Filtre Kahve", price: "200" },
          { name: "Risretto", price: "230" },
          { name: "Caramel Machiatto", price: "140" },
          { name: "White Mocha", price: "185" },
          { name: "Mocha", price: "120" },
          { name: "Cappuchino", price: "150" },
          { name: "Flat White", price: "170" },
          { name: "Espresso", price: "100" },
          { name: "Double Espresso", price: "200" }
        ],
        backgroundImage: "/images/chalkboard_bg.png",
        menuTitle: "Menu"
      };
    } else if (template.component === 'template-10') {
      defaultConfig = {
        menuItems: [
          { name: "SOUTHWEST BBQ", price: "350₺", description: "romaine, tomatoes, red onions, persian cucumbers, greek pita, housemade yogurt sauce", image: "/images/burger_menu.svg" },
          { name: "SOUTHWEST BBQ", price: "350₺", description: "romaine, tomatoes, red onions, persian cucumbers, greek pita, housemade yogurt sauce", image: "/images/burger_menu.svg" },
          { name: "SOUTHWEST BBQ", price: "350₺", description: "romaine, tomatoes, red onions, persian cucumbers, greek pita, housemade yogurt sauce", image: "/images/burger_menu.svg" },
          { name: "SOUTHWEST BBQ", price: "350₺", description: "romaine, tomatoes, red onions, persian cucumbers, greek pita, housemade yogurt sauce", image: "/images/burger_menu.svg" },
          { name: "SOUTHWEST BBQ", price: "350₺", description: "romaine, tomatoes, red onions, persian cucumbers, greek pita, housemade yogurt sauce", image: "/images/burger_menu.svg" },
          { name: "SOUTHWEST BBQ", price: "350₺", description: "romaine, tomatoes, red onions, persian cucumbers, greek pita, housemade yogurt sauce", image: "/images/burger_menu.svg" },
          { name: "SOUTHWEST BBQ", price: "350₺", description: "romaine, tomatoes, red onions, persian cucumbers, greek pita, housemade yogurt sauce", image: "/images/burger_menu.svg" },
          { name: "SOUTHWEST BBQ", price: "350₺", description: "romaine, tomatoes, red onions, persian cucumbers, greek pita, housemade yogurt sauce", image: "/images/burger_menu.svg" },
          { name: "SOUTHWEST BBQ", price: "350₺", description: "romaine, tomatoes, red onions, persian cucumbers, greek pita, housemade yogurt sauce", image: "/images/burger_menu.svg" }
        ],
        featuredProducts: [
          { image: "/images/burger_menu.svg" },
          { image: "/images/burger_menu.svg" },
          { image: "/images/burger_menu.svg" },
          { image: "/images/burger_menu.svg" }
        ],
        heroTitle: {
          line1: "Kıng",
          line2: "Deals",
          valueLine: "Valu Menu"
        }
      };
    } else if (template.component === 'template-11') {
      defaultConfig = {
        menuItems: [
          { name: "ESPRESSO SİNGLE", price: "200₺" },
          { name: "CAPPUCCİNO", price: "200₺" },
          { name: "AMERICANO", price: "150₺" },
          { name: "RISRETTO", price: "200₺" },
          { name: "CORTADO", price: "195₺" },
          { name: "TÜRK KAHVESİ", price: "100₺" },
          { name: "DUBLE TÜRK KAHVESİ", price: "200₺" },
          { name: "FİLTRE KAHVE", price: "140₺" },
          { name: "ESPRESSO SİNGLE", price: "200₺" },
          { name: "CAPPUCCİNO", price: "185₺" },
          { name: "AMERICANO", price: "150₺" },
          { name: "RISRETTO", price: "200₺" },
          { name: "CORTADO", price: "195₺" },
          { name: "TÜRK KAHVESİ", price: "100₺" },
          { name: "DUBLE TÜRK KAHVESİ", price: "200₺" },
          { name: "FİLTRE KAHVE", price: "140₺" },
        ],
        featuredImages: [
          "/images/placeholder.png",
          "/images/placeholder-2.png"
        ]
      };
    } else {
      defaultConfig = {};
    }

    const templateConfig = await prisma.templateConfig.create({
      data: {
        userId,
        templateId: dbTemplateId,
        configData: defaultConfig,
      },
    });

    // Config ve component bilgisini döndür
    return {
      ...templateConfig,
      component: template.component,
    };
  } catch (err: any) {
    console.error('Template alınırken hata oluştu:', err);
    throw new Error(`Template alınamadı: ${err.message}`);
  }
}




















