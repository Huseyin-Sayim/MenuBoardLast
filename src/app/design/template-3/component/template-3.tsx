"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { IMenuData, IMenuItem } from "@/types/menu-data";

// 🎯 Template-3 Kapasite
const CAPACITY = 6;

interface ProductOption {
    key: string;
    name: string;
    price: number;
    packageSalePrice?: number;
}

interface GalleryItem {
    id: string;
    name: string;
    url: string;
}

interface Template3Props {
    // 🆕 IMenuData desteği - yeni sistemle uyumluluk
    menuData?: IMenuData;
    // Legacy props - geriye uyumluluk için
    items: any[];
    isEditable?: boolean;
    availableCategories?: Array<{ _id: string; name: string }>;
    availableProductsBySlot?: Record<number, Array<{ _id: string; name: string; pricing: any; options?: ProductOption[]; category: string; image?: string; img?: string; imageUrl?: string }>>;
    selectedCategoriesBySlot?: Record<number, string>;
    onCategoryChangeBySlot?: (slotIndex: number, categoryId: string) => void;
    onProductSelect?: (gridIndex: number, productId: string) => void;
    onSmallPriceSelect?: (gridIndex: number, optionKey: string, price: number) => void;
    onLargePriceSelect?: (gridIndex: number, optionKey: string, price: number) => void;
    onImageClick?: (gridIndex: number) => void;
    galleryImages?: GalleryItem[];
    isGalleryOpen?: boolean;
    selectedImageSlot?: number | null;
    onGalleryClose?: () => void;
    onImageSelect?: (gridIndex: number, imageUrl: string) => void;
    selectedProducts?: Array<{
        name: string;
        price: string;
        productId?: string;
        smallOptionKey?: string;
        largeOptionKey?: string;
        smallPrice?: string;
        largePrice?: string;
        image?: string;
        categoryId?: string
    }>;
}

// 🎯 Kapasite export
Template3Content.capacity = CAPACITY;

export default function Template3Content({
    menuData,
    items,
    isEditable = false,
    availableCategories = [],
    availableProductsBySlot = {},
    selectedCategoriesBySlot = {},
    onCategoryChangeBySlot,
    onProductSelect,
    onSmallPriceSelect,
    onLargePriceSelect,
    onImageClick,
    galleryImages = [],
    isGalleryOpen = false,
    selectedImageSlot = null,
    onGalleryClose,
    onImageSelect,
    selectedProducts = []
}: Template3Props) {
    const [displayItems, setDisplayItems] = useState<any[]>([]);

    // 🔍 IMenuData formatını algıla
    // menuData prop'u varsa VEYA items array içinde settings/items yapısı varsa
    const isMenuDataFormat = !!(menuData?.settings && menuData?.items) ||
        !!(items && (items as any).settings && (items as any).items);

    // Eğer items aslında IMenuData ise, onu menuData olarak kullan
    const effectiveMenuData = menuData || (isMenuDataFormat ? items as any : null);

    // 📝 Debug Loglama
    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('\n');
            console.log('╔══════════════════════════════════════════════════════════════╗');
            console.log('║                 🎨 TEMPLATE-3 RENDER                         ║');
            console.log('╠══════════════════════════════════════════════════════════════╣');
            console.log(`║ 📊 Kapasite: ${CAPACITY}`);
            console.log(`║ 📦 Gelen Item Sayısı: ${Array.isArray(items) ? items.length : 'N/A'}`);
            console.log(`║ 🆕 IMenuData Kullanılıyor: ${!!effectiveMenuData}`);
            if (effectiveMenuData) {
                console.log(`║ 🎨 Tema: ${effectiveMenuData.settings?.theme}`);
                console.log(`║ 💰 Para Birimi: ${effectiveMenuData.settings?.currency}`);
                console.log(`║ 📌 Başlık: ${effectiveMenuData.settings?.globalTitle}`);
                console.log(`║ 📦 IMenuData Item Sayısı: ${effectiveMenuData.items?.length || 0}`);
                if (effectiveMenuData.items?.length > 0) {
                    const firstItem = effectiveMenuData.items[0];
                    console.log(`║ 📍 İlk ürün layout: x:${firstItem.layout?.x}%, y:${firstItem.layout?.y}%`);
                }
            }
            console.log('╚══════════════════════════════════════════════════════════════╝');
            console.log('\n');
        }
    }, [items, effectiveMenuData]);

    useEffect(() => {
        // 🆕 IMenuData FORMATI ALGILANDI - Doğrudan kullan
        let sourceItems: any[];

        if (effectiveMenuData?.items && Array.isArray(effectiveMenuData.items)) {
            // ✅ IMenuData formatı - temiz veri, doğrudan kullan
            console.log('[Template-3] ✅ IMenuData formatı algılandı - temiz veri kullanılıyor');
            sourceItems = effectiveMenuData.items;
        } else if (Array.isArray(items)) {
            // Legacy format - dönüştür
            console.log('[Template-3] ⚠️ Legacy format - dönüştürülüyor');
            sourceItems = items.map((item: any, index: number) => ({
                id: item.productId || `item-${index}`,
                title: item.name || item.title || "",
                subtitle: item.description || "",
                price: typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[^\d.-]/g, "")) || 0,
                image: item.image || "/images/placeholder-food.svg",
                isAvailable: true,
                layout: item.layout || { x: 0, y: 0, w: 25, h: 20, z: 1 },
                style: item.style || { fontSize: '1.2vw', color: '#FFFFFF', fontWeight: '600', textAlign: 'center', opacity: 1 },
            }));
        } else {
            sourceItems = [];
        }

        let processedItems = [...sourceItems];

        // Slice Logic - kapasite kontrolü
        if (processedItems.length > CAPACITY) {
            processedItems = processedItems.slice(0, CAPACITY);
            console.log(`[Template-3] ⚠️ ${sourceItems.length - CAPACITY} ürün kesildi (kapasite: ${CAPACITY})`);
        } else if (processedItems.length < CAPACITY && processedItems.length > 0) {
            while (processedItems.length < CAPACITY) {
                processedItems = [...processedItems, ...sourceItems];
            }
            processedItems = processedItems.slice(0, CAPACITY);
        }

        setDisplayItems(processedItems);
    }, [items, effectiveMenuData]);

    // Helper: Get all available price options from product
    const getPriceOptions = (product: any): Array<{ key: string; name: string; price: number }> => {
        const priceOptions: Array<{ key: string; name: string; price: number }> = [];

        if (product?.options && product.options.length > 0) {
            product.options.forEach((opt: ProductOption) => {
                if (opt.price > 0) {
                    priceOptions.push({
                        key: `option_${opt.key}`,
                        name: opt.name,
                        price: opt.price
                    });
                }
            });
        }

        if (product?.pricing) {
            const pricingLabels: Record<string, string> = {
                'basePrice': 'Ana Fiyat',
                'fastSalePrice': 'Hızlı Satış',
                'secondFastSalePrice': 'İkinci Satış',
                'thirdFastSalePrice': 'Üçüncü Satış',
                'packageSalePrice': 'Paket Satış',
                'purchasePrice': 'Alış Fiyatı'
            };

            Object.entries(product.pricing).forEach(([key, value]: [string, any]) => {
                if (value && typeof value.price === 'number' && value.price > 0) {
                    priceOptions.push({
                        key: `pricing_${key}`,
                        name: pricingLabels[key] || key,
                        price: value.price
                    });
                }
            });
        }

        return priceOptions;
    };

    return (
        <>
            <div className="w-full h-screen flex flex-col items-center justify-between p-8 font-sans overflow-hidden relative"
                style={{
                    background: "linear-gradient(to bottom, #E0F7FA 0%, #E0F2F1 100%)",
                    color: "#004D40",
                }}>

                {/* Header */}
                <h1 className="text-6xl font-black uppercase tracking-wide text-[#00695C] mt-4 mb-2 drop-shadow-sm"
                    style={{ fontFamily: "'Arial Black', Gadget, sans-serif" }}>
                    Kışlık Favoriler
                </h1>

                {/* Absolute Layout Container */}
                <div className="flex-1 w-full h-full relative my-4">
                    {displayItems.map((item, index) => {
                        const selectedProduct = selectedProducts[index];
                        const slotCategory = selectedCategoriesBySlot[index] || '';
                        const slotProducts = availableProductsBySlot[index] || [];
                        const hasSelectedCategory = slotCategory && slotCategory !== '';
                        const hasSelectedProduct = selectedProduct?.name && selectedProduct.name !== '';

                        const apiProduct = slotProducts.find(p => p.name === (item.title || item.name));
                        const priceOptions = apiProduct ? getPriceOptions(apiProduct) : [];
                        const hasPriceOptions = priceOptions.length > 0;

                        const basePrice = typeof item.price === "number" ? item.price : parseInt(String(item.price)) || 200;
                        const displaySmallPrice = selectedProduct?.smallPrice || `₺${basePrice}`;
                        const displayLargePrice = selectedProduct?.largePrice || `₺${Math.floor(basePrice * 1.15)}`;

                        // Image source: selected image > product image > default
                        const imageSource = selectedProduct?.image || item.image || item.img || "/images/placeholder-food.svg";

                        // Layout değerleri (varsayılan değerler ile)
                        const layout = item.layout || { x: 0, y: 0, w: 25, h: 20, z: 1 };
                        const style = item.style || { fontSize: '1.2vw', color: '#004D40', fontWeight: 'bold', textAlign: 'center', opacity: 1 };

                        return (
                            <div
                                key={index}
                                className="absolute flex items-center justify-between border-b-2 border-[#00695C]/20 pb-2 overflow-hidden transition-all duration-300"
                                style={{
                                    left: `${layout.x}%`,
                                    top: `${layout.y}%`,
                                    width: `${layout.w}%`,
                                    height: `${layout.h}%`,
                                    zIndex: layout.z,
                                    opacity: style.opacity,
                                }}
                            >
                                {/* Text Content */}
                                <div className="flex flex-col justify-center flex-1 pr-4 h-full">

                                    {/* Edit Mode: Category -> Product Flow */}
                                    {isEditable ? (
                                        <>
                                            {!hasSelectedCategory && availableCategories.length > 0 && (
                                                <select
                                                    value=""
                                                    onChange={(e) => onCategoryChangeBySlot?.(index, e.target.value)}
                                                    className="text-xl font-bold text-[#004D40] mb-2 p-2 rounded-lg border-2 border-[#00695C] bg-white cursor-pointer"
                                                    style={{ outline: 'none', maxWidth: '100%' }}
                                                >
                                                    <option value="">Kategori Seçin</option>
                                                    {availableCategories.map((cat) => (
                                                        <option key={cat._id} value={cat._id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}

                                            {hasSelectedCategory && (
                                                <div className="flex flex-col gap-1 w-full">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs text-[#00695C] opacity-70">
                                                            {availableCategories.find(c => c._id === slotCategory)?.name || 'Kategori'}
                                                        </span>
                                                        <button
                                                            onClick={() => onCategoryChangeBySlot?.(index, '')}
                                                            className="text-xs text-red-500 hover:text-red-700 underline"
                                                        >
                                                            Değiştir
                                                        </button>
                                                    </div>

                                                    <select
                                                        value={item.title || item.name || ""}
                                                        onChange={(e) => {
                                                            const product = slotProducts.find(p => p.name === e.target.value);
                                                            if (product && onProductSelect) {
                                                                onProductSelect(index, product._id);
                                                            }
                                                        }}
                                                        className="text-xl font-bold uppercase text-[#004D40] leading-tight mb-2 p-2 rounded-lg border-2 border-[#00695C] bg-white cursor-pointer w-full"
                                                        style={{ outline: 'none' }}
                                                    >
                                                        <option value="">Ürün Seçin</option>
                                                        {slotProducts.map((product) => (
                                                            <option key={product._id} value={product.name}>
                                                                {product.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <h3
                                            className="uppercase leading-tight mb-2 truncate w-full"
                                            style={{
                                                fontSize: '1.5vw', // style.fontSize yerine responsive scale için orantılı
                                                color: style.color || '#004D40',
                                                fontWeight: style.fontWeight || 'bold',
                                                textAlign: style.textAlign || 'left' as any
                                            }}
                                        >
                                            {item.title || item.name}
                                        </h3>
                                    )}

                                    {/* Price Section */}
                                    <div className="flex flex-col gap-1 text-[#004D40] font-bold ml-1" style={{ fontSize: '1vw' }}>
                                        <div className="flex items-center gap-4">
                                            <span className="opacity-80 w-14">Küçük</span>
                                            {isEditable && hasSelectedProduct && hasPriceOptions ? (
                                                <select
                                                    value={selectedProduct?.smallOptionKey || ''}
                                                    onChange={(e) => {
                                                        const option = priceOptions.find(opt => opt.key === e.target.value);
                                                        if (option && onSmallPriceSelect) {
                                                            onSmallPriceSelect(index, option.key, option.price);
                                                        }
                                                    }}
                                                    className="p-1 rounded-lg border-2 border-[#00695C] bg-[#00695C] text-white font-bold cursor-pointer text-xs"
                                                    style={{ outline: 'none', minWidth: '100px' }}
                                                >
                                                    <option value="">Fiyat Seçin</option>
                                                    {priceOptions.map((opt) => (
                                                        <option key={opt.key} value={opt.key}>
                                                            {opt.name} - ₺{opt.price}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span>{displaySmallPrice}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="opacity-80 w-14">Büyük</span>
                                            {isEditable && hasSelectedProduct && hasPriceOptions ? (
                                                <select
                                                    value={selectedProduct?.largeOptionKey || ''}
                                                    onChange={(e) => {
                                                        const option = priceOptions.find(opt => opt.key === e.target.value);
                                                        if (option && onLargePriceSelect) {
                                                            onLargePriceSelect(index, option.key, option.price);
                                                        }
                                                    }}
                                                    className="p-1 rounded-lg border-2 border-[#00695C] bg-[#00695C] text-white font-bold cursor-pointer text-xs"
                                                    style={{ outline: 'none', minWidth: '100px' }}
                                                >
                                                    <option value="">Fiyat Seçin</option>
                                                    {priceOptions.map((opt) => (
                                                        <option key={opt.key} value={opt.key}>
                                                            {opt.name} - ₺{opt.price}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span>{displayLargePrice}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Image - Clickable in Edit Mode */}
                                <div
                                    className={`relative h-full aspect-square flex-shrink-0 ${isEditable ? 'cursor-pointer group' : ''}`}
                                    onClick={() => isEditable && onImageClick?.(index)}
                                >
                                    <Image
                                        src={imageSource}
                                        alt={item.name || "Ürün"}
                                        fill
                                        className="object-cover rounded-md"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    {/* Edit Overlay */}
                                    {isEditable && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                            <div className="text-white text-center">
                                                <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-xs">Değiştir</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="w-full flex justify-end items-end text-[#00695C] opacity-80 mt-2 px-8 pb-4">
                    <div className="text-right text-xs max-w-md leading-relaxed">
                        <p>Fiyatlarımız KDV dahildir.</p>
                    </div>
                </div>
            </div>

            {/* Gallery Modal */}
            {isGalleryOpen && selectedImageSlot !== null && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-xl font-bold text-gray-800">Fotoğraf Seç</h3>
                            <button
                                onClick={onGalleryClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Gallery Grid */}
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            {galleryImages.length > 0 ? (
                                <div className="grid grid-cols-4 gap-4">
                                    {galleryImages.map((img) => (
                                        <div
                                            key={img.id}
                                            className="relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-[#00695C] transition-colors"
                                            onClick={() => {
                                                onImageSelect?.(selectedImageSlot, img.url);
                                                onGalleryClose?.();
                                            }}
                                        >
                                            <Image
                                                src={img.url}
                                                alt={img.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <p>Fotoğraf bulunamadı.</p>
                                    <p className="text-sm mt-2">Önce Galeri sayfasından fotoğraf yükleyin.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
