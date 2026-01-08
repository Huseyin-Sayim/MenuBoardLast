"use client"

import {useParams, useRouter} from "next/navigation";
import Template1Content from "@/app/design/template-1/component/template-1";
import Template2Content from "@/app/design/template-2/component/template-2";
import {defaultBurgers,menuItems} from "@/app/design/template-data";
import { useEffect, useState } from "react";
import { useTemplateConfig, useUpdateTemplateConfig } from "@/hooks/use-template-config";


type TemplateConfig = {
  id: string;
  name: string;
  component: React.ReactNode;
}

export default function TemplatePage () {
  const params = useParams();
  const router = useRouter();
  const templateId = params?.templateId as string;

  const [selectedCategory,setSelectedCategory] = useState<string>("");
  const [ selectedProducts, setSelectedProducts ] = useState<Array<{
    name:string;
    price:string;
    productId?: string;
    priceType?: string;
  }>>([])
  const [availableCategories, setAvailableCategories] = useState<Array<{_id: string; name: string}>>([]);
  const [availableProducts, setAvailableProducts] = useState<Array<{_id: string; name: string; pricing: any; category: string}>>([]);

  // Fiyat formatlama helper function
  const formatPrice = (currency?: string, price?: number): string => {
    if (typeof price !== 'number') return '';
    
    const currencyCode = currency || 'TRY';
    const currencySymbol = currencyCode === 'TRY' ? '₺' : currencyCode;
    const formattedPrice = new Intl.NumberFormat('tr-TR').format(price);
    
    return `${currencySymbol} ${formattedPrice}`;
  };

  const handleProductChange = (index: number, name: string, price: string, productId?: string, priceType?: string) => {
    setSelectedProducts(prev => {
      const newProducts = [...prev];
      // Array'i 6 elemana kadar genişlet (undefined yerine boş obje)
      while (newProducts.length <= index) {
        newProducts.push({ name: '', price: '' });
      }
      // Mevcut elemanı güncelle veya yeni ekle
      if (newProducts[index]) {
        newProducts[index] = { name, price, productId, priceType };
      } else {
        newProducts[index] = { name, price, productId, priceType };
      }
      return newProducts;
    })
  }

  const { data: configData, isLoading } = useTemplateConfig(templateId)
  const updateConfig = useUpdateTemplateConfig();
  
  // API'den kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Kategoriler çekiliyor...');
        const response = await fetch('http://localhost:5000/api/categories');
        if (response.ok) {
          const data = await response.json();
          console.log('Kategoriler geldi:', data);
          setAvailableCategories(data.data || []);
        } else {
          console.error('Kategoriler çekilemedi:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Kategoriler çekilirken hata:', error);
      }
    };
    fetchCategories();
  }, []);

  // Kategori seçildiğinde ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) {
        setAvailableProducts([]);
        return;
      }
      try {
        console.log('Ürünler çekiliyor, kategori:', selectedCategory);
        // API tüm ürünleri döndürüyor, client-side'da filtreleyeceğiz
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          const products = data.data || [];
          console.log('Tüm ürünler geldi:', products.length, 'adet');
          // Seçilen kategori ID'sine göre filtrele
          const filteredProducts = products.filter((p: any) => p.category === selectedCategory);
          console.log('Filtrelenmiş ürünler:', filteredProducts.length, 'adet');
          setAvailableProducts(filteredProducts);
        } else {
          console.error('Ürünler çekilemedi:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Ürünler çekilirken hata:', error);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    if (configData) {
      setSelectedCategory(configData.category || "");
      setSelectedProducts(configData.data || []);
    }
  }, [configData]);

  // Otomatik kaydetme kaldırıldı - sadece butona tıklayınca kaydedilecek


  // const handleSave = () => {
  //   updateConfig.mutate({
  //     templateId,
  //     configData: { category: selectedCategory, data: selectedProducts }
  //   });
  // };



  const templateConfigs: Record<string, TemplateConfig> = {
    "template-1": {
      id: "template-1",
      name: "Şablon 1",
      component: <Template1Content
        burgerItems={selectedProducts.length > 0
          ? selectedProducts.map((p, i) => ({
              id: i + 1,
              name: p?.name || '',
              price: p?.price ? p.price.replace(/[^\d]/g, '') : '0',
              img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
              category: selectedCategory
            }))
          : defaultBurgers}
        isEditable={true}
        availableProducts={availableProducts}
        availableCategories={availableCategories}
        onProductSelect={(gridIndex: number, productId: string) => {
          const product = availableProducts.find(p => p._id === productId);
          if (product && product.pricing.basePrice) {
            const formattedPrice = formatPrice(
              product.pricing.basePrice.currency,
              product.pricing.basePrice.price
            );
            handleProductChange(gridIndex, product.name, formattedPrice, productId, 'basePrice');
          }
        }}
        onPriceTypeSelect={(gridIndex: number, priceType: string) => {
          const selectedProduct = selectedProducts[gridIndex];
          if (selectedProduct && selectedProduct.productId) {
            const product = availableProducts.find(p => p._id === selectedProduct.productId);
            if (product && product.pricing[priceType]) {
              const formattedPrice = formatPrice(
                product.pricing[priceType].currency,
                product.pricing[priceType].price
              );
              handleProductChange(gridIndex, selectedProduct.name, formattedPrice, selectedProduct.productId, priceType);
            }
          }
        }}
        prices={selectedProducts.reduce((acc, p) => {
          acc[p.name] = p.price;
          return acc;
        }, {} as Record<string, string>)}
        onPriceClick={(index: string, name: string, price: string) => {
          const idx = parseInt(index);
          const currentProduct = selectedProducts[idx];
          handleProductChange(idx, name, price, currentProduct?.productId, currentProduct?.priceType)
        }}
        selectedProducts={selectedProducts}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    },
    "template-2": {
      id: "template-2",
      name: "Şablon 2",
      component: <Template2Content
        menuItems={selectedProducts.length > 0 ? selectedProducts.map((p, i) => ({
          name: p.name,
          price: p.price,
          desc: "",
          category: selectedCategory
        })) : menuItems}
        isEditable={true}
        prices={selectedProducts.reduce((acc, p) => {
          acc[p.name] = p.price;
          return acc;
        }, {} as Record<string, string>)}
        onPriceClick={(itemName: string, currentPrice: string) => {
          const index = selectedProducts.findIndex(p => p.name === itemName);
          if (index !== -1) {
            handleProductChange(index, itemName, currentPrice);
          }
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    }
  }

  const selectedTemplate = templateConfigs[templateId];

  if (!selectedTemplate) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Şablon bulunamadı
          </h2>
          <button
            onClick={() => router.push("/designTemplate")}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Şablonlara Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {/* Header */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/designTemplate")}
          className="rounded-lg bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white dark:bg-gray-dark/90 dark:hover:bg-gray-dark"
        >
          <span className="flex items-center gap-2 text-dark dark:text-white">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-current"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Geri Dön
          </span>
        </button>
        <button
          onClick={() => {
            if (templateId) {
              console.log('Kaydet butonuna tıklandı');
              console.log('templateId:', templateId);
              console.log('selectedCategory:', selectedCategory);
              console.log('selectedProducts:', selectedProducts);
              
              updateConfig.mutate(
                {
                  templateId,
                  configData: {
                    category: selectedCategory || "",
                    data: selectedProducts.length > 0 ? selectedProducts : []
                  }
                },
                {
                  onSuccess: (data) => {
                    console.log('Kaydetme başarılı:', data);
                    alert('Başarıyla kaydedildi!');
                  },
                  onError: (error) => {
                    console.error('Kaydetme hatası:', error);
                    alert('Kaydetme sırasında bir hata oluştu: ' + error.message);
                  }
                }
              );
            } else {
              console.error('templateId bulunamadı');
              alert('Template ID bulunamadı!');
            }
          }}
          disabled={updateConfig.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            {updateConfig.isPending ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Kaydediliyor...
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="text-current"
                >
                  <path
                    d="M16.667 5.833L8.333 14.167 3.333 9.167"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Kaydet
              </>
            )}
          </span>
        </button>
      </div>
      {selectedTemplate.component}
    </div>
  );
}