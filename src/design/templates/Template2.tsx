"use client";

import React from "react";
import Image from "next/image";
import type { IMenuData, IMenuItem, IPlaceholderItem } from "../../types/menu-data";
import { useNormalizedMenuData } from "../../components/templates/TemplateWrapper";
import { isPlaceholderItem } from "../../types/menu-data";

/**
 * Template2 - Kapasite: 8
 * Geniş menü görünümü, 8 ürün slotu, 2x4 grid
 */

const CAPACITY = 8;

interface Template2Props {
    data: IMenuData;
    isEditable?: boolean;
    onItemClick?: (item: IMenuItem, index: number) => void;
}

export default function Template2({
    data,
    isEditable = false,
    onItemClick,
}: Template2Props): React.ReactElement {
    const { settings, items, originalCount } = useNormalizedMenuData(data, CAPACITY);

    return (
        <div
            className={`min-h-screen ${settings.theme === "dark"
                ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white"
                : "bg-gradient-to-b from-amber-50 via-white to-amber-50 text-gray-900"
                }`}
        >
            {/* Header */}
            <header
                className={`py-8 px-6 text-center ${settings.theme === "dark"
                    ? "bg-gradient-to-r from-amber-600/20 via-amber-500/30 to-amber-600/20"
                    : "bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100"
                    }`}
            >
                <h1 className="text-5xl font-extrabold tracking-tight mb-3">
                    {settings.globalTitle}
                </h1>
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-16 bg-amber-500" />
                    <span className="text-amber-500 text-2xl">★</span>
                    <div className="h-px w-16 bg-amber-500" />
                </div>
            </header>

            {/* Menu Grid - 2 columns x 4 rows */}
            <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
                    {items.map((item, index) => (
                        <MenuCard
                            key={item.id}
                            item={item}
                            index={index}
                            currency={settings.currency}
                            theme={settings.theme}
                            isEditable={isEditable}
                            onClick={
                                onItemClick && !isPlaceholderItem(item)
                                    ? () => onItemClick(item as IMenuItem, index)
                                    : undefined
                            }
                        />
                    ))}
                </div>
            </div>

            {/* Footer / Capacity Info */}
            {isEditable && (
                <footer className="text-center pb-8 text-sm opacity-50">
                    {originalCount} / {CAPACITY} ürün gösteriliyor
                    {originalCount > CAPACITY && (
                        <span className="text-red-400 ml-2">
                            ⚠️ {originalCount - CAPACITY} ürün kapasiteyi aşıyor
                        </span>
                    )}
                </footer>
            )}
        </div>
    );
}

interface MenuCardProps {
    item: IMenuItem | IPlaceholderItem;
    index: number;
    currency: string;
    theme: "dark" | "light";
    isEditable?: boolean;
    onClick?: () => void;
}

function MenuCard({
    item,
    index,
    currency,
    theme,
    isEditable,
    onClick,
}: MenuCardProps): React.ReactElement {
    const isPlaceholder = isPlaceholderItem(item);

    if (isPlaceholder) {
        return (
            <div
                className={`aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center transition-all duration-300 ${theme === "dark"
                    ? "border-slate-600 bg-slate-800/40 hover:border-amber-500/50"
                    : "border-gray-300 bg-gray-100/60 hover:border-amber-400"
                    } ${isEditable ? "cursor-pointer" : ""}`}
                onClick={onClick}
            >
                <div className="text-center opacity-40">
                    <div className="text-5xl mb-2">📦</div>
                    <div className="text-xs font-medium">Slot {index + 1}</div>
                    {isEditable && <div className="text-xs mt-1">Eklemek için tıkla</div>}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`group relative aspect-square rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] ${theme === "dark" ? "bg-slate-800" : "bg-white"
                } ${!item.isAvailable ? "grayscale opacity-60" : ""} ${isEditable ? "cursor-pointer" : ""
                }`}
            onClick={onClick}
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIhAAAQMDBAMAAAAAAAAAAAAAAQIDBAARIQUGEjEHQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANq3X5C1bS9SfhQ9JhofZUUrclOOvLKVWIBSgJFxc3ueq2VKCo//2Q=="
                    />
                ) : (
                    <div
                        className={`h-full w-full flex items-center justify-center ${theme === "dark"
                            ? "bg-gradient-to-br from-slate-700 to-slate-600"
                            : "bg-gradient-to-br from-amber-100 to-amber-200"
                            }`}
                    >
                        <span className="text-6xl opacity-20">🍴</span>
                    </div>
                )}
            </div>

            {/* Overlay Gradient */}
            <div
                className={`absolute inset-0 bg-gradient-to-t ${theme === "dark"
                    ? "from-black/90 via-black/40 to-transparent"
                    : "from-black/70 via-black/20 to-transparent"
                    }`}
            />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg leading-tight mb-1 drop-shadow-lg">
                    {item.title}
                </h3>
                {item.subtitle && (
                    <p className="text-xs text-white/80 line-clamp-2 mb-2">
                        {item.subtitle}
                    </p>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold text-xl drop-shadow">
                        {currency}{item.price.toFixed(2)}
                    </span>
                    {!item.isAvailable && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Tükendi
                        </span>
                    )}
                </div>
            </div>

            {/* Index Badge (Edit Mode) */}
            {isEditable && (
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center justify-center">
                    {index + 1}
                </div>
            )}
        </div>
    );
}

// Export capacity for external use
Template2.capacity = CAPACITY;
