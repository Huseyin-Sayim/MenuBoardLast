"use client";
import { FunctionComponent } from 'react';
import "../../styles/template8.css";
import {
    template8MenuItems,
    template8HotItems,
    template8ForYouItems,
    template8Aromas
} from "../../template-data";

interface Template8Props {
    menuItems?: Array<{
        name: string;
        priceSmall: string;
        priceLarge: string;
        categoryId?: string;
        productId?: string;
        smallOptionKey?: string;
        largeOptionKey?: string;
    }>;
    hotItems?: Array<{
        name: string;
        price1Label: string;
        price1Value: string;
        price2Label: string;
        price2Value: string;
        categoryId?: string;
        productId?: string;
        price1OptionKey?: string;
        price2OptionKey?: string;
    }>;
    forYouItems?: Array<{
        name: string;
        price: string;
        categoryId?: string;
        productId?: string;
        optionKey?: string;
    }>;
    aromaItems?: string[][];

    // Edit mode props
    isEditable?: boolean;
    availableCategories?: Array<{ _id: string; name: string }>;
    availableProductsBySlot?: Record<string, Array<{ _id: string; name: string; pricing: any; category: string; image?: string; img?: string; imageUrl?: string; options?: Array<{ key: string; name: string; price: number }> }>>;

    // Quick Edit Callbacks
    onMenuItemCategoryChange?: (index: number, categoryId: string) => void;
    onMenuItemProductSelect?: (index: number, productId: string) => void;
    onMenuItemOptionSelect?: (index: number, type: 'small' | 'large', optionKey: string) => void;

    onHotItemCategoryChange?: (index: number, categoryId: string) => void;
    onHotItemProductSelect?: (index: number, productId: string) => void;
    onHotItemOptionSelect?: (index: number, type: 'price1' | 'price2', optionKey: string) => void;

    onForYouItemCategoryChange?: (index: number, categoryId: string) => void;
    onForYouItemProductSelect?: (index: number, productId: string) => void;
    onForYouItemOptionSelect?: (index: number, optionKey: string) => void;
}

const Template8: FunctionComponent<Template8Props> = ({
    menuItems = template8MenuItems as NonNullable<Template8Props['menuItems']>,
    hotItems = template8HotItems as NonNullable<Template8Props['hotItems']>,
    forYouItems = template8ForYouItems as NonNullable<Template8Props['forYouItems']>,
    aromaItems = template8Aromas,
    isEditable = false,
    availableCategories = [],
    availableProductsBySlot = {},
    onMenuItemCategoryChange,
    onMenuItemProductSelect,
    onMenuItemOptionSelect,
    onHotItemCategoryChange,
    onHotItemProductSelect,
    onHotItemOptionSelect,
    onForYouItemCategoryChange,
    onForYouItemProductSelect,
    onForYouItemOptionSelect
}) => {

    // Ürün ve Kategori Seçimi (İsim üzerinde) - Kademeli Akış
    const renderProductControls = (index: number, prefix: string, currentCategoryId?: string, currentProductId?: string, onCategoryChange?: any, onProductSelect?: any) => {
        if (!isEditable) return null;
        const slotKey = `${prefix}${index}`;
        const products = availableProductsBySlot[slotKey];

        const handleCategoryChange = (e: any) => {
            onCategoryChange?.(index, e.target.value);
        };

        const handleProductChange = (e: any) => {
            if (e.target.value === "RESET_CATEGORY") {
                onCategoryChange?.(index, ""); // Kategoriyi sıfırla
            } else {
                onProductSelect?.(index, e.target.value);
            }
        };

        // Eğer kategori seçilmemişse -> Kategori Dropdown'u göster
        if (!currentCategoryId) {
            return (
                <div className="absolute top-0 left-0 z-50 min-w-[120px]" onClick={e => e.stopPropagation()}>
                    <select
                        value=""
                        onChange={handleCategoryChange}
                        className="w-full text-xs bg-slate-800 text-white border border-slate-600 rounded p-1 opacity-90 hover:opacity-100 cursor-pointer shadow-lg"
                    >
                        <option value="" disabled>Kategori Seç</option>
                        {availableCategories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            );
        }

        // Kategori seçilmişse -> Ürün Dropdown'u göster (Geri dönme opsiyonlu)
        return (
            <div className="absolute top-0 left-0 z-50 min-w-[120px]" onClick={e => e.stopPropagation()}>
                <select
                    value={currentProductId || ""}
                    onChange={handleProductChange}
                    className="w-full text-xs bg-slate-800 text-white border border-slate-600 rounded p-1 opacity-90 hover:opacity-100 cursor-pointer shadow-lg"
                >
                    <option value="" disabled>Ürün Seç</option>
                    <option value="RESET_CATEGORY" className="bg-red-900 text-white font-bold">← Kategorilere Dön</option>
                    {products && products.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                </select>
            </div>
        );
    };

    // Opsiyon Seçimi (Fiyat üzerinde)
    const renderOptionControls = (
        index: number,
        prefix: string,
        currentProductId?: string,
        onOptionSelect?: any,
        subType?: string,
        currentOptionKey?: string
    ) => {
        if (!isEditable || !currentProductId) return null;

        const slotKey = `${prefix}${index}`;
        const products = availableProductsBySlot[slotKey];
        const selectedProduct = products?.find(p => p._id === currentProductId);

        if (!selectedProduct?.options?.length) return null;

        return (
            <div className="absolute top-0 right-0 z-50 pointer-events-auto" onClick={e => e.stopPropagation()}>
                <select
                    value={currentOptionKey || ""}
                    onChange={(e) => subType
                        ? onOptionSelect?.(index, subType, e.target.value)
                        : onOptionSelect?.(index, e.target.value)
                    }
                    className="text-xs bg-slate-800 text-white border border-slate-600 rounded p-1 opacity-90 hover:opacity-100 max-w-[80px]"
                >
                    <option value="">Seç</option>
                    {selectedProduct.options.map(opt => (
                        <option key={opt.key} value={opt.key}>
                            {opt.name}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    return (
        <div className="w-full h-screen relative bg-lightcyan overflow-hidden flex items-start p-[0.062rem] box-border gap-[1.25rem] text-center text-[2.5rem] text-darkolivegreen font-varela-round">
            <div className="self-stretch w-[72.563rem] overflow-hidden shrink-0 flex flex-col items-end pt-[1.875rem] pb-[0rem] pl-[1.875rem] pr-[0.625rem] box-border">
                <div className="self-stretch flex-1 flex items-start py-[1.25rem] px-[0rem] gap-[0.625rem]">

                    {/* Menu Items List */}
                    <div className="self-stretch w-[43rem] flex flex-col items-start justify-center gap-[0.625rem]">
                        <div className="self-stretch flex-1 flex flex-col items-start" /> {/* Spacer */}
                        {menuItems.map((item, index) => (
                            <div key={index} className="self-stretch flex-1 flex flex-col items-start justify-center relative group">
                                {renderProductControls(index, 'menu-', item.categoryId, item.productId, onMenuItemCategoryChange, onMenuItemProductSelect)}
                                <div className="relative leading-[2.313rem]">{item.name}</div>
                            </div>
                        ))}
                        <div className="self-stretch flex-1 flex flex-col items-start justify-center" /> {/* Spacer */}
                    </div>

                    <div className="self-stretch flex-1 flex flex-col items-start justify-center gap-[0.625rem]">
                        <div className="self-stretch flex-1 flex flex-col items-center justify-center text-[2.188rem]">
                            <div className="relative leading-[2.313rem]">Küçük</div>
                        </div>
                        {menuItems.map((item, index) => (
                            <div key={`s-${index}`} className="self-stretch flex-1 flex flex-col items-center justify-center relative group">
                                {renderOptionControls(index, 'menu-', item.productId, onMenuItemOptionSelect, 'small', item.smallOptionKey)}
                                <div className="relative leading-[2.313rem]">{item.priceSmall}</div>
                            </div>
                        ))}
                        <div className="self-stretch flex-1 flex flex-col items-center justify-center" />
                    </div>

                    <div className="self-stretch flex-1 flex flex-col items-start justify-center gap-[0.625rem]">
                        <div className="self-stretch flex-1 flex flex-col items-center justify-center text-[2.25rem]">
                            <div className="relative leading-[2.313rem]">Büyük</div>
                        </div>
                        {menuItems.map((item, index) => (
                            <div key={`l-${index}`} className="self-stretch flex-1 flex flex-col items-center justify-center relative group">
                                {renderOptionControls(index, 'menu-', item.productId, onMenuItemOptionSelect, 'large', item.largeOptionKey)}
                                <div className="relative leading-[2.313rem]">{item.priceLarge}</div>
                            </div>
                        ))}
                        <div className="self-stretch flex-1 flex flex-col items-center justify-center" />
                    </div>

                </div>
            </div>

            <div className="h-[67.375rem] w-[46.063rem] flex flex-col items-center gap-[0.625rem] text-[2.188rem] text-black">
                <div className="self-stretch h-[14.756rem] flex items-center justify-center p-[0.062rem] box-border shrink-0 text-[7.5rem] text-darkgreen">
                    <div className="h-[13.475rem] flex-1 relative leading-[6.25rem] flex items-center justify-center [text-shadow:1px_0_0_#0d671d,_0_1px_0_#0d671d,_-1px_0_0_#0d671d,_0_-1px_0_#0d671d]">SICAK LEZZETLER</div>
                </div>

                {/* Hot Flavors Items */}
                <div className="self-stretch flex-1 flex items-center justify-center shrink-0 text-[1.875rem]">
                    {hotItems.map((item, index) => (
                        <div key={index} className="h-[11.75rem] w-[15.106rem] flex flex-col items-center justify-center relative group">
                            {renderProductControls(index, 'hot-', item.categoryId, item.productId, onHotItemCategoryChange, onHotItemProductSelect)}
                            <div className="self-stretch h-[6.625rem] flex flex-col items-start">
                                <div className="w-[15rem] h-[6.438rem] relative leading-[6.25rem] flex items-center justify-center shrink-0">{item.name}</div>
                            </div>
                            <div className="self-stretch h-[6.625rem] flex flex-col items-start mt-[-1.5rem] relative text-[1.25rem]">
                                <div className="w-[15rem] h-[6.813rem] relative leading-[1.563rem] whitespace-pre-wrap inline-block shrink-0">
                                    <span className="relative group/p1 inline-block w-full">
                                        {renderOptionControls(index, 'hot-', item.productId, onHotItemOptionSelect, 'price1', item.price1OptionKey)}
                                        {item.price1Label}             {item.price1Value}
                                    </span>
                                    <br />
                                    <span className="relative group/p2 inline-block w-full">
                                        {renderOptionControls(index, 'hot-', item.productId, onHotItemOptionSelect, 'price2', item.price2OptionKey)}
                                        {item.price2Label}             {item.price2Value}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-[46.938rem] h-[0.188rem] relative border-darkgreen border-solid border-t-[3px] box-border shrink-0" />

                <div className="self-stretch h-[14.756rem] overflow-hidden shrink-0 flex flex-col items-start pt-[0.937rem] px-[0rem] pb-[0rem] box-border gap-[0.062rem]">
                    <div className="self-stretch h-[2.506rem] overflow-hidden shrink-0 flex items-center justify-center">
                        <div className="h-[2.506rem] flex-1 relative leading-[6.25rem] flex items-center justify-center">SENİN İÇİN</div>
                    </div>

                    {/* For You Items */}
                    <div className="self-stretch h-[8.438rem] overflow-hidden shrink-0 flex items-center gap-[0.062rem]">
                        {forYouItems.map((item, index) => (
                            <div key={index} className="h-[8.256rem] flex-1 relative leading-[3.125rem] flex items-center justify-center relative group">
                                {renderProductControls(index, 'foryou-', item.categoryId, item.productId, onForYouItemCategoryChange, onForYouItemProductSelect)}
                                {renderOptionControls(index, 'foryou-', item.productId, onForYouItemOptionSelect, undefined, item.optionKey)}
                                <div className="text-center">{item.name}<br />{item.price}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="self-stretch h-[16.313rem] flex flex-col items-start p-[0.062rem] box-border gap-[0.062rem] shrink-0">
                    <div className="self-stretch h-[2.5rem] overflow-hidden shrink-0 flex items-center justify-center">
                        <div className="h-[2.5rem] flex-1 relative leading-[6.25rem] flex items-center justify-center">AROMA SEÇENEKLERİ</div>
                    </div>
                    <div className="self-stretch h-[8.413rem] overflow-hidden shrink-0 flex items-center gap-[0.062rem] text-[1.25rem]">
                        {aromaItems.map((col, index) => (
                            <div key={index} className="h-[8.413rem] flex-1 overflow-hidden flex flex-col items-center justify-center p-[0.125rem] box-border">
                                <div className="self-stretch h-[8.163rem] relative leading-[1.25rem] flex items-center justify-center shrink-0 flex-col gap-4">
                                    {col.map((text, i) => <span key={i}>{text}</span>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Template8;
