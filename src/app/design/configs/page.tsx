import { cookies } from "next/headers";
import { prisma } from "@/generated/prisma";
import Template1Content from "../template-1/component/template-1";
import Template2Content from "../template-2/component/template-2";
import Template3Content from "../template-3/component/template-3";
import Template4BurgerMenu from "../template-4/component/template-4";
import Template5Content from "../template-5/component/template-5";
import Template6Content from "../template-6/component/template-6";
import Template7Content from "../template-7/component/template-7";
import Template8Content from "../template-8/component/template-8";
import Template9Content from "../template-9/component/template-9";

import { defaultBurgers, menuItems, winterFavorites, template8MenuItems, template8HotItems, template8ForYouItems, template8Aromas, template9MenuItems, template10MenuItems, template10FeaturedProducts } from "../template-data";
import Template10Content from "../template-10/component/template-10";
import Template11Content from "../template-11/component/template-11";
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
        // Template 3 data logic (similar to template 1 or custom)
        let items = winterFavorites;
        if (configData && configData.data && Array.isArray(configData.data) && configData.data.length > 0) {
          // Map config data if available
          items = configData.data.map((item: any, index: number) => ({
            id: index + 1,
            name: item.name || '',
            price: item.price || '0',
            img: item.image || "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
            heroIMG: item.image || "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1000&auto=format&fit=crop",
            heroTitle: item.name || 'Menü',
            category: 'Genel'
          }));
        }

        return (
          <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <Template3Content items={items} />
          </div>
        );
      }

      case 'template-4': {
        let items: Array<{ name: string; price: string; description?: string; image?: string; badge?: string | null }> = [];
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
          promoProduct = {
            name: promo.name,
            price: promo.price,
            currency: promo.currency || '₺',
            cents: promo.cents || '.00',
            image: promo.image,
          };
          promoImage = promo.image;
        }

        return (
          <Template4BurgerMenu
            variant="preview"
            items={items.length > 0 ? items : undefined}
            promoProduct={promoProduct}
            promoImage={promoImage}
          />
        );
      }

      case 'template-5': {
        let featuredProduct = {
          logoImage: "/images/burger_logo.svg",
          productImage: "/images/burger+patato.png",
          label: "PREMIUM",
          title: "CHEESE",
          name: "WHOPPER",
          pricing: [
            { label: "Per 1", price: "$3.25", cal: "300" },
            { label: "Per 2", price: "$8.89", cal: "280" }
          ]
        };

        let menuItems: Array<any> = Array.from({ length: 8 }, (_, i) => ({
          number: i + 1,
          category: "",
          name: "",
          image: "/images/burger_menu.svg",
          prices: [], // Options yoksa boş kalacak
          isNew: false
        }));

        if (configData) {
          if (configData.featuredProduct) {
            featuredProduct = { ...featuredProduct, ...configData.featuredProduct };
          }
          if (configData.menuItems && Array.isArray(configData.menuItems)) {
            menuItems = configData.menuItems;
            while (menuItems.length < 8) {
              menuItems.push({
                number: menuItems.length + 1,
                category: "",
                name: "",
                image: "/images/burger_menu.svg",
                prices: [{ size: "Small", price: "$0" }],
                isNew: false
              });
            }
          }
        }

        return (
          <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <Template5Content
              featuredProduct={featuredProduct}
              menuItems={menuItems}
            />
          </div>
        );
      }

      case 'template-6': {
        let brandName = "mamaspizza";
        let menuItems: Array<any> = Array.from({ length: 9 }, (_, i) => ({
          title: "",
          desc: "",
          price: "",
          image: "/images/pizza1.svg",
          isNew: false,
          isRed: false,
          hasTopPrice: false,
          fullImage: false,
          isLargeTitle: false
        }));

        if (configData) {
          if (configData.brandName) {
            brandName = configData.brandName;
          }
          if (configData.menuItems && Array.isArray(configData.menuItems)) {
            menuItems = configData.menuItems;
            while (menuItems.length < 9) {
              menuItems.push({
                title: "",
                desc: "",
                price: "",
                image: "/images/pizza1.svg",
                isNew: false,
                isRed: false,
                hasTopPrice: false,
                fullImage: false,
                isLargeTitle: false
              });
            }
          }
        }

        return (
          <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <Template6Content
              brandName={brandName}
              menuItems={menuItems}
            />
          </div>
        );
      }

      case 'template-7': {
        let brand = { shortName: "LA", fullName: "gyrogreek", phone: "(818)356-9676", logoImg: "" };
        let hero = {
          logo: "/images/burger_logo.svg",
          titleTop: "GYRO",
          titleBottom: "FOOD",
          image: "/images/teavuk_dürüm.svg",
          promo: { title: "Only Today", value: "20%", label: "OFF" }
        };
        let sidebarItems: Array<any> = [{ title: "", desc: "", price: "" }];
        let gridItems: Array<any> = Array.from({ length: 6 }, (_, i) => ({
          title: "",
          desc: "",
          price: "",
          variant: "white",
          image: "/images/teavuk_dürüm.svg"
        }));

        if (configData) {
          if (configData.brand) {
            brand = { ...brand, ...configData.brand };
          }
          if (configData.hero) {
            hero = { ...hero, ...configData.hero };
          }
          if (configData.sidebarItems && Array.isArray(configData.sidebarItems)) {
            sidebarItems = configData.sidebarItems;
            if (sidebarItems.length === 0) {
              sidebarItems = [{ title: "", desc: "", price: "" }];
            }
          }
          if (configData.gridItems && Array.isArray(configData.gridItems)) {
            gridItems = configData.gridItems;
            while (gridItems.length < 6) {
              gridItems.push({
                title: "",
                desc: "",
                price: "",
                variant: "white",
                image: "/images/teavuk_dürüm.svg"
              });
            }
          }
        }

        return (
          <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <Template7Content
              brand={brand}
              hero={hero}
              sidebarItems={sidebarItems}
              gridItems={gridItems}
            />
          </div>
        );
      }

      case 'template-8': {
        let menuItemsData = template8MenuItems;
        let hotItemsData = template8HotItems;
        let forYouItemsData = template8ForYouItems;
        let aromaItemsData = template8Aromas;

        if (configData) {
          if (configData.menuItems && Array.isArray(configData.menuItems)) {
            menuItemsData = configData.menuItems;
          }
          if (configData.hotItems && Array.isArray(configData.hotItems)) {
            hotItemsData = configData.hotItems;
          }
          if (configData.forYouItems && Array.isArray(configData.forYouItems)) {
            forYouItemsData = configData.forYouItems;
          }
          if (configData.aromaItems && Array.isArray(configData.aromaItems)) {
            aromaItemsData = configData.aromaItems;
          }
        }

        return (
          <div className="w-full h-auto rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <Template8Content
              menuItems={menuItemsData}
              hotItems={hotItemsData}
              forYouItems={forYouItemsData}
              aromaItems={aromaItemsData}
            />
          </div>
        );
      }

      case 'template-9': {
        let menuItemsData = template9MenuItems;
        let backgroundImage = "/images/chalkboard_bg.png";
        let menuTitle = "Menu";

        if (configData) {
          if (configData.menuItems && Array.isArray(configData.menuItems)) {
            menuItemsData = configData.menuItems;
          }
          if (configData.backgroundImage) {
            backgroundImage = configData.backgroundImage;
          }
          if (configData.menuTitle) {
            menuTitle = configData.menuTitle;
          }
        }

        return (
          <div className="w-[1080px] h-[1920px] mx-auto overflow-hidden">
            <Template9Content
              menuItems={menuItemsData}
              backgroundImage={backgroundImage}
              menuTitle={menuTitle}
            />
          </div>
        );
      }

      case 'template-10': {
        let menuItemsData = template10MenuItems;
        let featuredProductsData = template10FeaturedProducts;
        let heroTitleData = {
          line1: "Kıng",
          line2: "Deals",
          valueLine: "Valu Menu"
        };

        if (configData) {
          if (configData.menuItems) menuItemsData = configData.menuItems;
          if (configData.featuredProducts) featuredProductsData = configData.featuredProducts;
          if (configData.heroTitle) heroTitleData = configData.heroTitle;
        }

        return (
          <div className="w-[1920px] h-[1080px] mx-auto overflow-hidden bg-black">
            <Template10Content
              menuItems={menuItemsData}
              featuredProducts={featuredProductsData}
              heroTitle={heroTitleData}
            />
          </div>
        );
      }

      case 'template-11': {
        // Template 11 defaults
        let menuItemsData: any[] = [
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
        ];
        let featuredImagesData = [
          "/images/placeholder.png",
          "/images/placeholder-2.png"
        ];


        if (configData) {
          if (configData.menuItems) menuItemsData = configData.menuItems;
          if (configData.featuredImages) featuredImagesData = configData.featuredImages;
        }

        return (
          <div className="w-[1080px] h-[1920px] mx-auto overflow-hidden">
            <Template11Content
              leftItems={menuItemsData.slice(0, 8)}
              rightItems={menuItemsData.slice(8, 16)}
              featuredImages={featuredImagesData}
            />
          </div>
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

