"use client"

import {useParams, useRouter, useSearchParams} from "next/navigation";
import Template1Content from "@/app/design/template-1/component/template-1";
import Template2Content from "@/app/design/template-2/component/template-2";
import {defaultBurgers,menuItems} from "@/app/design/template-data";
import { useEffect, useState } from "react";
import { useTemplateConfig, useUpdateTemplateConfig } from "@/hooks/use-template-config";
import { MediaGallery, MediaItem } from "@/app/(home)/dashboard/media/_components/media-gallery";


type TemplateConfig = {
  id: string;
  name: string;
  component: React.ReactNode;
}

export default function TemplatePage () {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = params?.templateId as string;
  const configId = searchParams.get('configId') || undefined;

  const [selectedCategory,setSelectedCategory] = useState<string>("");
  const [ selectedProducts, setSelectedProducts ] = useState<Array<{
    name:string;
    price:string;
    productId?: string;
    priceType?: string;
    image?: string;
  }>>([])
  const [availableCategories, setAvailableCategories] = useState<Array<{_id: string; name: string}>>([]);
  const [availableProducts, setAvailableProducts] = useState<Array<{_id: string; name: string; pricing: any; category: string; image?: string; img?: string; imageUrl?: string}>>([]);
  
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({});
  const [selectedProductsByCategory, setSelectedProductsByCategory] = useState<Record<string, Array<{
    name: string;
    price: string;
    productId?: string;
    priceType?: string;
    image?: string;
  }>>>({});
  
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedImageCategorySlot, setSelectedImageCategorySlot] = useState<string | null>(null);
  const [availableMedia, setAvailableMedia] = useState<MediaItem[]>([]);

  const formatPrice = (currency?: string, price?: number): string => {
    if (typeof price !== 'number') return '';
    
    const currencyCode = currency || 'TRY';
    const currencySymbol = currencyCode === 'TRY' ? '₺' : currencyCode;
    const formattedPrice = new Intl.NumberFormat('tr-TR').format(price);
    
    return `${currencySymbol} ${formattedPrice}`;
  };

  const handleProductChange = (index: number, name: string, price: string, productId?: string, priceType?: string, image?: string) => {
    setSelectedProducts(prev => {
      const newProducts = [...prev];
      while (newProducts.length <= index) {
        newProducts.push({ name: '', price: '', image: undefined });
      }
      if (newProducts[index]) {
        newProducts[index] = { name, price, productId, priceType, image };
      } else {
        newProducts[index] = { name, price, productId, priceType, image };
      }
      return newProducts;
    })
  }

  const { data: configResponse, isLoading } = useTemplateConfig(templateId, configId)
  const updateConfig = useUpdateTemplateConfig();
  
  // configResponse artık { configData, configId } formatında
  const configData = configResponse?.configData;
  const currentConfigId = configResponse?.configId || configId;
  
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

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) {
        setAvailableProducts([]);
        return;
      }
      try {
        console.log('Ürünler çekiliyor, kategori:', selectedCategory);
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          const products = data.data || [];
          console.log('Tüm ürünler geldi:', products.length, 'adet');
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
    if (templateId === "template-1") {
      fetchProducts();
    }
  }, [selectedCategory, templateId]);

  useEffect(() => {
    const fetchProductsForCategories = async () => {
      if (templateId !== "template-2") return;
      
      const categoryIds = Object.values(selectedCategories).filter(Boolean);
      if (categoryIds.length === 0) {
        setAvailableProducts([]);
        return;
      }
      
      try {
        console.log('Template-2 için ürünler çekiliyor, kategoriler:', categoryIds);
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          const products = data.data || [];
          console.log('Tüm ürünler geldi:', products.length, 'adet');
          // Tüm seçili kategorilere ait ürünleri filtrele
          const filteredProducts = products.filter((p: any) => 
            categoryIds.includes(p.category)
          );
          console.log('Filtrelenmiş ürünler:', filteredProducts.length, 'adet');
          setAvailableProducts(filteredProducts);
        } else {
          console.error('Ürünler çekilemedi:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Ürünler çekilirken hata:', error);
      }
    };
    
    fetchProductsForCategories();
  }, [selectedCategories, templateId]);

  useEffect(() => {
    if (configData) {
      if (templateId === "template-2") {
        const config = configData as any;
        if (config?.categories) {
          setSelectedCategories(config.categories || {});
        }
        if (config?.data) {
          setSelectedProductsByCategory(config.data || {});
        }
      } else {
        setSelectedCategory((configData as any)?.category || "");
        setSelectedProducts((configData as any)?.data || []);
      }
    }
  }, [configData, templateId]);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        console.log('Galeri fotoğrafları yükleniyor...');
        const response = await fetch(`/api/gallery`);
        console.log('Galeri response status:', response.status);
        if (response.ok) {
          const result = await response.json();
          console.log('Galeri response data:', result);
          const rawData = result.data || [];
          console.log('Raw galeri data:', rawData);
          const formattedData = rawData.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: "image" as "image" | "video",
            url: item.url,
            uploadedAt: new Date(item.createdAt).toLocaleDateString("tr-TR"),
            duration: 0,
          }));
          console.log('Formatted galeri data:', formattedData);
          setAvailableMedia(formattedData);
        } else {
          console.error('Galeri yüklenemedi:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Galeri yüklenirken hata:', error);
      }
    };
    loadGallery();
  }, []);

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
              img: p?.image || "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
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
            // Harici API'den image'ı al (product.image veya product.img veya product.imageUrl)
            const productImage = product.image || product.img || product.imageUrl || undefined;
            handleProductChange(gridIndex, product.name, formattedPrice, productId, 'basePrice', productImage);
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
              // Mevcut image'ı koru (eğer varsa)
              const currentImage = selectedProduct.image || product.image || product.img || product.imageUrl || undefined;
              handleProductChange(gridIndex, selectedProduct.name, formattedPrice, selectedProduct.productId, priceType, currentImage);
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
          handleProductChange(idx, name, price, currentProduct?.productId, currentProduct?.priceType, currentProduct?.image)
        }}
        selectedProducts={selectedProducts}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onImageClick={(gridIndex: number) => {
          setSelectedImageIndex(gridIndex);
          setSelectedImageCategorySlot(null);
          if (availableMedia.length === 0) {
            const loadGallery = async () => {
              try {
                const response = await fetch(`/api/gallery`);
                if (response.ok) {
                  const result = await response.json();
                  const rawData = result.data || [];
                  const formattedData = rawData.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    type: "image" as "image" | "video",
                    url: item.url,
                    uploadedAt: new Date(item.createdAt).toLocaleDateString("tr-TR"),
                    duration: 0,
                  }));
                  setAvailableMedia(formattedData);
                }
              } catch (error) {
                console.error('Galeri yüklenirken hata:', error);
              }
            };
            loadGallery();
          }
          setIsImageSelectorOpen(true);
        }}
      />
    },
    "template-2": {
      id: "template-2",
      name: "Şablon 2",
      component: <Template2Content
        menuItems={menuItems}
        isEditable={true}
        availableProducts={availableProducts}
        availableCategories={availableCategories}
        selectedCategories={selectedCategories}
        onCategorySlotChange={(categorySlot: string, categoryId: string) => {
          setSelectedCategories(prev => ({
            ...prev,
            [categorySlot]: categoryId
          }));
          setSelectedProductsByCategory(prev => {
            const newProducts = { ...prev };
            newProducts[categorySlot] = [];
            return newProducts;
          });
        }}
        selectedProductsByCategory={selectedProductsByCategory}
        onProductSelectByCategory={(categorySlot: string, itemIndex: number, productId: string) => {
          const product = availableProducts.find(p => p._id === productId);
          if (product && product.pricing.basePrice) {
            const formattedPrice = formatPrice(
              product.pricing.basePrice.currency,
              product.pricing.basePrice.price
            );
            const productImage = product.image || product.img || product.imageUrl || undefined;
            
            setSelectedProductsByCategory(prev => {
              const categoryProducts = prev[categorySlot] || [];
              const newProducts = [...categoryProducts];
              while (newProducts.length <= itemIndex && newProducts.length < 4) {
                newProducts.push({ name: '', price: '', image: undefined });
              }
              if (newProducts[itemIndex]) {
                newProducts[itemIndex] = {
                  name: product.name,
                  price: formattedPrice,
                  productId: productId,
                  priceType: 'basePrice',
                  image: productImage
                };
              }
              return {
                ...prev,
                [categorySlot]: newProducts.slice(0, 4)
              };
            });
          }
        }}
        onPriceTypeSelectByCategory={(categorySlot: string, itemIndex: number, priceType: string) => {
          const categoryProducts = selectedProductsByCategory[categorySlot] || [];
          const currentProduct = categoryProducts[itemIndex];
          
          if (currentProduct && currentProduct.productId) {
            const product = availableProducts.find(p => p._id === currentProduct.productId);
            if (product && product.pricing[priceType]) {
              const formattedPrice = formatPrice(
                product.pricing[priceType].currency,
                product.pricing[priceType].price
              );
              const currentImage = currentProduct.image || product.image || product.img || product.imageUrl || undefined;
              
              setSelectedProductsByCategory(prev => {
                const categoryProducts = [...(prev[categorySlot] || [])];
                if (categoryProducts[itemIndex]) {
                  categoryProducts[itemIndex] = {
                    ...categoryProducts[itemIndex],
                    price: formattedPrice,
                    priceType: priceType,
                    image: currentImage
                  };
                }
                return {
                  ...prev,
                  [categorySlot]: categoryProducts
                };
              });
            }
          }
        }}
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
            onClick={() => router.push("/dashboard/designTemplate")}
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
              console.log('templateId:', templateId);
              console.log('selectedCategory:', selectedCategory);
              console.log('selectedProducts:', selectedProducts);
              
              const configData = templateId === "template-2"
                ? {
                    categories: selectedCategories,
                    data: selectedProductsByCategory
                  }
                : {
                    category: selectedCategory || "",
                    data: selectedProducts.length > 0 ? selectedProducts : []
                  };
              
              updateConfig.mutate(
                {
                  templateId,
                  configData: configData as any,
                  configId: currentConfigId
                },
                {
                  onSuccess: (data) => {
                    const savedConfigId = data?.data?.id || currentConfigId;
                    
                    // Eğer yeni config oluşturulduysa (currentConfigId yoktu), configId ile sayfayı yenile
                    if (!currentConfigId && savedConfigId) {
                      router.push(`/dashboard/designTemplate/${templateId}?configId=${savedConfigId}`);
                    } else {
                      alert('Başarıyla kaydedildi!');
                    }
                  },
                  onError: (error) => {
                    alert('Kaydetme sırasında bir hata oluştu: ' + error.message);
                  }
                }
              );
            } else {
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
      
      {/* Image Selector Modal */}
      {isImageSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] rounded-lg bg-white shadow-xl dark:bg-gray-dark overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-stroke-dark">
              <h2 className="text-xl font-bold text-dark dark:text-white">
                Fotoğraf Seç
              </h2>
              <button
                onClick={() => {
                  setIsImageSelectorOpen(false);
                  setSelectedImageIndex(null);
                  setSelectedImageCategorySlot(null);
                }}
                className="rounded-lg p-2 text-dark-4 transition-all hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-2 dark:hover:text-white"
              >
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {availableMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg
                    className="mb-4 size-12 text-dark-4 dark:text-dark-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-dark-4 dark:text-dark-6">
                    Fotoğraf yükleniyor...
                  </p>
                  <p className="mt-2 text-sm text-dark-4 dark:text-dark-6">
                    Henüz yüklenmiş fotoğraf yoksa, önce galeri sayfasından fotoğraf yükleyin.
                  </p>
                </div>
              ) : (
                <MediaGallery
                  initialData={availableMedia}
                  showActions={false}
                  selectionMode={true}
                  onImageSelect={(imageUrl: string) => {
                    if (selectedImageIndex !== null && selectedImageCategorySlot === null) {
                      // Template-1 için
                      setSelectedProducts(prev => {
                        const newProducts = [...prev];
                        if (newProducts[selectedImageIndex]) {
                          newProducts[selectedImageIndex] = {
                            ...newProducts[selectedImageIndex],
                            image: imageUrl
                          };
                        }
                        return newProducts;
                      });
                    } else if (selectedImageCategorySlot !== null && selectedImageIndex !== null) {
                      // Template-2 için
                      setSelectedProductsByCategory(prev => {
                        const categoryProducts = [...(prev[selectedImageCategorySlot] || [])];
                        if (categoryProducts[selectedImageIndex]) {
                          categoryProducts[selectedImageIndex] = {
                            ...categoryProducts[selectedImageIndex],
                            image: imageUrl
                          };
                        }
                        return {
                          ...prev,
                          [selectedImageCategorySlot]: categoryProducts
                        };
                      });
                    }
                    setIsImageSelectorOpen(false);
                    setSelectedImageIndex(null);
                    setSelectedImageCategorySlot(null);
                  }}
                  gridCols="grid-cols-4 sm:grid-cols-5 md:grid-cols-6"
                  maxHeight="600px"
                  disableClick={true}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}