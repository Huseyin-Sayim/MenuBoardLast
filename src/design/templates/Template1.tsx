"use client";

import React from "react";
import Image from "next/image";
import type { IMenuData, IMenuItem, IPlaceholderItem } from "../../types/menu-data";
import { useNormalizedMenuData } from "../../components/templates/TemplateWrapper";
import { isPlaceholderItem } from "../../types/menu-data";

/**
 * Template1 - Kapasite: 5
 * Kompakt menü görünümü, 5 ürün slotu
 */

const CAPACITY = 4;

interface Template1Props {
    data: IMenuData;
    isEditable?: boolean;
    onItemClick?: (item: IMenuItem, index: number) => void;
}

export default function Template1({
    data,
    isEditable = false,
    onItemClick,
}: Template1Props): React.ReactElement {
    const { settings, items, originalCount } = useNormalizedMenuData(data, CAPACITY);

    return (
        <div
            className={`min-h-screen p-6 ${settings.theme === "dark"
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
                : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
                }`}
        >
            {/* Header */}
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-wider mb-2">
                    {settings.globalTitle}
                </h1>
                <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />
            </header>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {items.map((item, index) => (
                    <MenuItem
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

            {/* Capacity Info (only in edit mode) */}
            {isEditable && (
                <div className="text-center mt-8 text-sm opacity-60">
                    {originalCount} / {CAPACITY} ürün gösteriliyor
                    {originalCount > CAPACITY && (
                        <span className="text-amber-500 ml-2">
                            ({originalCount - CAPACITY} ürün gizlendi)
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

interface MenuItemProps {
    item: IMenuItem | IPlaceholderItem;
    index: number;
    currency: string;
    theme: "dark" | "light";
    isEditable?: boolean;
    onClick?: () => void;
}

function MenuItem({
    item,
    index,
    currency,
    theme,
    isEditable,
    onClick,
}: MenuItemProps): React.ReactElement {
    const isPlaceholder = isPlaceholderItem(item);

    if (isPlaceholder) {
        return (
            <div
                className={`relative rounded-xl p-4 border-2 border-dashed transition-all duration-300 ${theme === "dark"
                    ? "border-gray-600 bg-gray-800/30"
                    : "border-gray-300 bg-gray-100/50"
                    } ${isEditable ? "cursor-pointer hover:border-amber-500" : ""}`}
                onClick={onClick}
            >
                <div className="flex items-center justify-center h-32">
                    <div className="text-center opacity-40">
                        <div className="text-4xl mb-2">+</div>
                        <div className="text-sm">Boş Slot #{index + 1}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${theme === "dark" ? "bg-gray-800/80" : "bg-white"
                } ${!item.isAvailable ? "opacity-50" : ""} ${isEditable ? "cursor-pointer" : ""
                }`}
            onClick={onClick}
        >
            {/* Image */}
            <div className="relative h-40 bg-gray-700">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAIhAAAQMDBAMAAAAAAAAAAAAAAQIDBAARIQUGEjEHQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEEA/ANq3X5C1bS9SfhQ9JhofZUUrclOOvLKVWIBSgJFxc3ueq2VKCo//2Q=="
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-700">
                        <span className="text-4xl opacity-30">🍽️</span>
                    </div>
                )}
                {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Tükendi</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                    <span className="text-amber-500 font-bold text-lg whitespace-nowrap ml-2">
                        {currency}{item.price.toFixed(2)}
                    </span>
                </div>
                {item.subtitle && (
                    <p
                        className={`text-sm line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        {item.subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

// Export capacity for external use
Template1.capacity = CAPACITY;
