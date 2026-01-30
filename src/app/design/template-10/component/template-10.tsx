"use client";

import { FunctionComponent } from 'react';
import { template10MenuItems, template10FeaturedProducts } from "../../template-data";

interface Template10Props {
    menuItems?: Array<{
        name: string;
        price: string;
        description?: string;
        categoryId?: string;
        productId?: string;
        image?: string;
    }>;
    featuredProducts?: Array<{
        image?: string;
        categoryId?: string;
        productId?: string;
        name?: string;
        price?: string;
    }>;
    heroTitle?: {
        line1: string;
        line2: string;
        valueLine: string;
    };
    isEditable?: boolean;
    availableCategories?: Array<{ _id: string; name: string }>;
    availableProductsBySlot?: Record<number, Array<{ _id: string; name: string; pricing: any; category: string; image?: string; img?: string; imageUrl?: string; options?: Array<{ key: string; name: string; price: number }> }>>;
    onCategoryChange?: (index: number, categoryId: string) => void;
    onProductSelect?: (index: number, productId: string) => void;
    onFeaturedImageClick?: (index: number) => void;
    onMenuItemImageClick?: (index: number) => void;
}

const Template10: FunctionComponent<Template10Props> = ({
    menuItems = template10MenuItems as NonNullable<Template10Props['menuItems']>,
    featuredProducts = template10FeaturedProducts as NonNullable<Template10Props['featuredProducts']>,
    heroTitle = {
        line1: "Kıng",
        line2: "Deals",
        valueLine: "Valu Menu"
    },
    isEditable = false,
    availableCategories = [],
    availableProductsBySlot = {},
    onCategoryChange,
    onProductSelect,

    onFeaturedImageClick,
    onMenuItemImageClick,
}) => {
    return (
        <div
            className="relative flex items-start gap-2.5 font-bangers overflow-hidden"
            style={{
                width: '1920px',
                height: '1080px',
                backgroundColor: '#cc2027',
            }}
        >
            {/* Sol Panel - Hero Bölümü */}
            <div className="self-stretch w-[602px] shrink-0 flex flex-col items-center justify-center py-6 px-0 overflow-hidden">
                {/* Hero Başlık ve Logo */}
                {/* Hero Başlık ve Logo */}
                <div className="self-stretch h-[380px] relative overflow-hidden">
                    {featuredProducts[0]?.name ? (
                        <div
                            className="absolute top-[58px] left-[23px] text-white uppercase"
                            style={{ fontSize: '80px', lineHeight: '0.9', maxWidth: '350px' }}
                        >
                            {featuredProducts[0].name.split(' ').map((word, i) => (
                                <span key={i} className="block">{word}</span>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="absolute top-[58px] left-[23px] text-white"
                            style={{ fontSize: '96px', lineHeight: '1.1' }}
                        >
                            <span>{heroTitle.line1}</span><br />
                            <span>{heroTitle.line2}</span><br />
                            <span style={{ color: '#ff7e22' }}>{heroTitle.valueLine}</span>
                        </div>
                    )}
                    {/* Hero Görsel - Fiyat */}
                    <div
                        className="absolute bg-[#FF7E22] p-4 px-6 rounded-[50px] rotate-[-15deg] top-[48px] right-[70px] text-white"
                        style={{ fontSize: '80px', lineHeight: '1' }}
                    >
                        {featuredProducts[0]?.price || '₺200'}
                    </div>
                </div>

                {/* Ana Ürün Görseli */}
                <div className="self-stretch h-[472px] flex flex-col items-center justify-center p-2.5 relative group">
                    {isEditable && (
                        <div className="absolute left-0 top-0 z-50 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-2 rounded">
                            <select
                                className="text-xs text-black p-1 rounded"
                                onChange={(e) => onCategoryChange?.(100, e.target.value)}
                                value={featuredProducts[0]?.categoryId || ""}
                            >
                                <option value="">Kategori</option>
                                {availableCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                            <select
                                className="text-xs text-black p-1 rounded"
                                onChange={(e) => onProductSelect?.(100, e.target.value)}
                                value={featuredProducts[0]?.productId || ""}
                            >
                                <option value="">Ürün</option>
                                {availableProductsBySlot[100]?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                        </div>
                    )}
                    <img
                        className="self-stretch max-w-full max-h-full object-contain cursor-pointer"
                        src={featuredProducts[0]?.image || "/images/template-10-hero.png"}
                        alt="Main Product"
                        onClick={() => isEditable && onFeaturedImageClick?.(0)}
                    />
                </div>

                {/* Alt Üçlü Görsel Bölümü */}
                <div className="self-stretch h-[170px] flex p-2.5 gap-1.5 overflow-hidden">
                    {[0, 1, 2].map((idx) => {
                        const currentIdx = 101 + idx; // 101, 102, 103 for bottom images
                        return (
                            <div
                                key={idx}
                                className="flex-1 rounded-[20px] overflow-hidden flex flex-col items-center justify-center py-1 px-0 cursor-pointer relative group"
                                style={{ backgroundColor: '#fb333b' }}
                                onClick={() => isEditable && onFeaturedImageClick?.(idx + 1)}
                            >
                                {isEditable && (
                                    <div className="absolute left-0 top-0 z-50 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-2 rounded scale-75 origin-top-left">
                                        <select
                                            className="text-xs text-black p-1 rounded w-full"
                                            onChange={(e) => onCategoryChange?.(currentIdx, e.target.value)}
                                            value={featuredProducts[idx + 1]?.categoryId || ""}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="">Kategori</option>
                                            {availableCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                        <select
                                            className="text-xs text-black p-1 rounded w-full"
                                            onChange={(e) => onProductSelect?.(currentIdx, e.target.value)}
                                            value={featuredProducts[idx + 1]?.productId || ""}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="">Ürün</option>
                                            {availableProductsBySlot[currentIdx]?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                )}
                                <img
                                    className="w-full h-full object-cover"
                                    src={featuredProducts[idx + 1]?.image || ["/images/image-2.png", "/images/image-3.png", "/images/image-4.png"][idx]}
                                    alt={`Featured ${idx + 1}`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Sağ Panel - Menü Grid */}
            <div className="self-stretch flex-1 flex flex-col items-center justify-center py-8 px-0 gap-1 overflow-hidden">
                {/* 3x3 Grid - 9 Menü Kartı */}
                <div className="flex-1 flex flex-wrap items-start gap-2.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                        const item = menuItems[index] || { name: 'SOUTHWEST BBQ', price: '350₺', description: '' };

                        return (
                            <div
                                key={index}
                                className="w-[424px] flex flex-col items-center gap-2.5 relative group"
                            >
                                {/* Düzenleme Kontrolleri */}
                                {isEditable && (
                                    <div className="absolute left-0 top-0 z-50 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-2 rounded">
                                        <select
                                            className="text-xs text-black p-1 rounded"
                                            onChange={(e) => onCategoryChange?.(index, e.target.value)}
                                            value={item.categoryId || ""}
                                        >
                                            <option value="">Kategori</option>
                                            {availableCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </select>
                                        <select
                                            className="text-xs text-black p-1 rounded"
                                            onChange={(e) => onProductSelect?.(index, e.target.value)}
                                            value={item.productId || ""}
                                        >
                                            <option value="">Ürün</option>
                                            {availableProductsBySlot[index]?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                )}

                                {/* Ürün Görseli */}
                                <div className="self-stretch h-[184px] flex flex-col items-center justify-center">
                                    <img
                                        className="w-[278px] flex-1 max-h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                        src={item.image || "/images/template-10-item.png"}
                                        alt={item.name}
                                        onClick={() => isEditable && onMenuItemImageClick?.(index)}
                                    />
                                </div>

                                {/* Ürün Adı ve Fiyat */}
                                <div className="self-stretch h-[86px] flex items-start">
                                    <div className="w-[207px] flex flex-col items-start">
                                        <div
                                            className="self-stretch text-white uppercase"
                                            style={{ fontSize: '40px', lineHeight: '1.1' }}
                                        >
                                            {item.name.split(' ').slice(0, 2).join(' ')}<br />
                                            {item.name.split(' ').slice(2).join(' ')}
                                        </div>
                                    </div>
                                    <div className="self-stretch flex-1 flex flex-col items-center justify-center">
                                        <div
                                            className="w-[111px] h-[61px] rounded-[30px] flex items-center justify-center p-2.5"
                                            style={{ backgroundColor: '#ff7e22' }}
                                        >
                                            <div className="text-white" style={{ fontSize: '40px' }}>
                                                {item.price}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ürün Açıklaması */}
                                {item.description && (
                                    <div className="self-stretch h-[60px] flex flex-col items-start font-inter">
                                        <div
                                            className="w-[303px] capitalize font-semibold"
                                            style={{ fontSize: '16px', color: '#f9a162' }}
                                        >
                                            {item.description}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Template10;
