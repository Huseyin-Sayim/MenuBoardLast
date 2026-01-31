"use client";

import { FunctionComponent } from 'react';
import { template9MenuItems } from "../../template-data";

interface Template9Props {
    menuItems?: Array<{
        name: string;
        price: string;
        categoryId?: string;
        productId?: string;
        image?: string;
    }>;
    backgroundImage?: string;
    menuTitle?: string;
    isEditable?: boolean;
    availableCategories?: Array<{ _id: string; name: string }>;
    availableProductsBySlot?: Record<string, Array<{ _id: string; name: string; pricing: any; category: string; image?: string; img?: string; imageUrl?: string; options?: Array<{ key: string; name: string; price: number }> }>>;
    onCategoryChange?: (index: number, categoryId: string) => void;
    onProductSelect?: (index: number, productId: string) => void;
}

const Template9: FunctionComponent<Template9Props> = ({
    menuItems = template9MenuItems as NonNullable<Template9Props['menuItems']>,
    backgroundImage = "/images/chalkboard_bg.png",
    menuTitle = "Menu",
    isEditable = false,
    availableCategories = [],
    availableProductsBySlot = {},
    onCategoryChange,
    onProductSelect,
}) => {
    return (
        <div
            className="w-full h-full relative flex flex-col text-white font-fredericka-the-great bg-no-repeat"
            style={{
                backgroundImage: `url('${backgroundImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                aspectRatio: '9/16',
            }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 z-[0]" />

            {/* Logo sağ alt köşe */}
            <img
                src="/images/ntx-white.png"
                alt="Logo"
                style={{
                    position: 'absolute',
                    bottom: '50px',
                    right: '50px',
                    height: '70px',
                    objectFit: 'contain',
                    zIndex: 50
                }}
            />

            {/* Spacer - Top */}
            <div className="flex-[0.5]" />

            {/* Menu Title with Glass Image */}
            <div className="relative z-[1] flex items-center justify-between py-12 px-16">
                {/* Menu Title - Left */}
                <h1
                    className="text-white drop-shadow-lg"
                    style={{
                        fontSize: '190px',
                        lineHeight: 1.2
                    }}
                >
                    {menuTitle}
                </h1>

                {/* Glass Image - Right */}
                <img
                    src="/images/template-9-glass.png"
                    alt="Coffee Glass"
                    className="h-auto object-contain drop-shadow-2xl"
                    style={{
                        height: '350px',
                        maxWidth: '45%'
                    }}
                />
            </div>

            {/* Menu Items List */}
            <div className="relative z-[1] flex-[2] flex flex-col justify-center px-12 py-8 font-rubik-dirt">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between py-4 px-4 relative group"
                        style={{ fontSize: '42px' }}
                    >
                        {/* Edit Controls */}
                        {isEditable && (
                            <div className="absolute left-0 top-0 z-50 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-2 rounded">
                                <select
                                    className="text-xs text-black p-1 rounded"
                                    onChange={(e) => onCategoryChange && onCategoryChange(index, e.target.value)}
                                    value={item.categoryId || ""}
                                >
                                    <option value="">Kategori</option>
                                    {availableCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                                <select
                                    className="text-xs text-black p-1 rounded"
                                    onChange={(e) => onProductSelect && onProductSelect(index, e.target.value)}
                                    value={item.productId || ""}
                                >
                                    <option value="">Ürün</option>
                                    {availableProductsBySlot[index]?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Product Name */}
                        <span className="text-white whitespace-nowrap shrink-0">
                            {item.name}
                        </span>

                        {/* Dashed Line */}
                        <div
                            className="flex-1 mx-4 border-t-[3px] border-dashed border-white opacity-60"
                            style={{ minWidth: '30px' }}
                        />

                        {/* Price */}
                        <span className="text-white whitespace-nowrap shrink-0 text-right min-w-[100px]">
                            {item.price}
                        </span>
                    </div>
                ))}
            </div>

            {/* Spacer - Bottom */}
            <div className="flex-[0.5]" />
        </div>
    );
};

export default Template9;
