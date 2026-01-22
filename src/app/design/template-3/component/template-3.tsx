"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

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

export default function Template3Content({
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

    useEffect(() => {
        let processedItems = [...items];
        while (processedItems.length < 6) {
            processedItems = [...processedItems, ...items];
        }
        processedItems = processedItems.slice(0, 6);
        setDisplayItems(processedItems);
    }, [items]);

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

                {/* Grid Container */}
                <div className="flex-1 w-full max-w-[1600px] grid grid-cols-2 grid-rows-3 gap-x-16 gap-y-4 my-4">
                    {displayItems.map((item, index) => {
                        const selectedProduct = selectedProducts[index];
                        const slotCategory = selectedCategoriesBySlot[index] || '';
                        const slotProducts = availableProductsBySlot[index] || [];
                        const hasSelectedCategory = slotCategory && slotCategory !== '';
                        const hasSelectedProduct = selectedProduct?.name && selectedProduct.name !== '';

                        const apiProduct = slotProducts.find(p => p.name === item.name);
                        const priceOptions = apiProduct ? getPriceOptions(apiProduct) : [];
                        const hasPriceOptions = priceOptions.length > 0;

                        const basePrice = parseInt(item.price) || 200;
                        const displaySmallPrice = selectedProduct?.smallPrice || `₺${basePrice}`;
                        const displayLargePrice = selectedProduct?.largePrice || `₺${Math.floor(basePrice * 1.15)}`;

                        // Image source: selected image > product image > default
                        const imageSource = selectedProduct?.image || item.img || item.image || "/images/toffeeNut.png";

                        return (
                            <div key={index} className="flex items-center justify-between border-b-2 border-[#00695C]/20 pb-2 relative">
                                {/* Text Content */}
                                <div className="flex flex-col justify-center flex-1 pr-4">

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
                                                <div className="flex flex-col gap-1">
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
                                                        value={item.name || ""}
                                                        onChange={(e) => {
                                                            const product = slotProducts.find(p => p.name === e.target.value);
                                                            if (product && onProductSelect) {
                                                                onProductSelect(index, product._id);
                                                            }
                                                        }}
                                                        className="text-xl font-bold uppercase text-[#004D40] leading-tight mb-2 p-2 rounded-lg border-2 border-[#00695C] bg-white cursor-pointer"
                                                        style={{ outline: 'none', maxWidth: '100%' }}
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
                                        <h3 className="text-3xl font-bold uppercase text-[#004D40] leading-tight mb-2">
                                            {item.name}
                                        </h3>
                                    )}

                                    {/* Price Section */}
                                    <div className="flex flex-col gap-1 text-[#004D40] font-bold text-xl ml-1">
                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-medium opacity-80 w-14">Küçük</span>
                                            {isEditable && hasSelectedProduct && hasPriceOptions ? (
                                                <select
                                                    value={selectedProduct?.smallOptionKey || ''}
                                                    onChange={(e) => {
                                                        const option = priceOptions.find(opt => opt.key === e.target.value);
                                                        if (option && onSmallPriceSelect) {
                                                            onSmallPriceSelect(index, option.key, option.price);
                                                        }
                                                    }}
                                                    className="p-1 rounded-lg border-2 border-[#00695C] bg-[#00695C] text-white font-bold cursor-pointer text-sm"
                                                    style={{ outline: 'none', minWidth: '140px' }}
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
                                            <span className="text-lg font-medium opacity-80 w-14">Büyük</span>
                                            {isEditable && hasSelectedProduct && hasPriceOptions ? (
                                                <select
                                                    value={selectedProduct?.largeOptionKey || ''}
                                                    onChange={(e) => {
                                                        const option = priceOptions.find(opt => opt.key === e.target.value);
                                                        if (option && onLargePriceSelect) {
                                                            onLargePriceSelect(index, option.key, option.price);
                                                        }
                                                    }}
                                                    className="p-1 rounded-lg border-2 border-[#00695C] bg-[#00695C] text-white font-bold cursor-pointer text-sm"
                                                    style={{ outline: 'none', minWidth: '140px' }}
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
                                    className={`relative w-40 h-40 flex-shrink-0 ${isEditable ? 'cursor-pointer group' : ''}`}
                                    onClick={() => isEditable && onImageClick?.(index)}
                                >
                                    <Image
                                        src={imageSource}
                                        alt={item.name || "Ürün"}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Edit Overlay */}
                                    {isEditable && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                <div className="w-full flex justify-end items-end text-[#00695C] opacity-80 mt-4 px-8 pb-4">
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
