/**
 * Menu Data Utilities - Normalization Layer
 * Dashboard'dan gelen ham veriyi temiz IMenuData formatına dönüştürür
 * Layout ve Style otomatik ataması yapar
 */

import type { IMenuData, IMenuItem, IMenuItemLayout, IMenuItemStyle } from "../types/menu-data";
import {
    DEFAULT_MENU_SETTINGS,
    DEFAULT_ITEM_LAYOUT,
    DEFAULT_ITEM_STYLE,
    generateAutoLayout,
    generateDefaultStyle
} from "../types/menu-data";

// Default placeholder görsel URL'i
const DEFAULT_PLACEHOLDER_IMAGE = "/images/placeholder-food.svg";

/**
 * 🧹 Fiyat temizleme fonksiyonu
 * "₺ 850", "₺850", "850₺", "1.200", "1,200" gibi formatları number'a çevirir
 */
export function cleanPrice(rawPrice: any): number {
    if (typeof rawPrice === "number") {
        return rawPrice;
    }
    if (typeof rawPrice === "string") {
        const cleaned = rawPrice
            .replace(/[₺$€£¥]/g, "")
            .replace(/\s/g, "")
            .replace(/\./g, "")
            .replace(/,/g, ".");

        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}

/**
 * 🧹 Başlık temizleme fonksiyonu
 */
export function cleanTitle(rawTitle: any): string {
    if (typeof rawTitle === "string") {
        return rawTitle.trim().toUpperCase();
    }
    return "";
}

/**
 * 🧹 Tek bir item'ı temizler ve IMenuItem formatına çevirir
 * Layout ve Style otomatik atanır
 */
export function cleanMenuItem(
    rawItem: any,
    index: number,
    totalItems: number,
    capacity?: number
): IMenuItem {
    // Layout: Veride varsa kullan, yoksa otomatik hesapla
    const layout: IMenuItemLayout = rawItem.layout && typeof rawItem.layout === 'object'
        ? {
            x: rawItem.layout.x ?? DEFAULT_ITEM_LAYOUT.x,
            y: rawItem.layout.y ?? DEFAULT_ITEM_LAYOUT.y,
            w: rawItem.layout.w ?? DEFAULT_ITEM_LAYOUT.w,
            h: rawItem.layout.h ?? DEFAULT_ITEM_LAYOUT.h,
            z: rawItem.layout.z ?? DEFAULT_ITEM_LAYOUT.z,
        }
        : generateAutoLayout(index, totalItems, capacity);

    // Style: Veride varsa kullan, yoksa default ata
    const style: IMenuItemStyle = rawItem.style && typeof rawItem.style === 'object'
        ? {
            fontSize: rawItem.style.fontSize ?? DEFAULT_ITEM_STYLE.fontSize,
            color: rawItem.style.color ?? DEFAULT_ITEM_STYLE.color,
            fontWeight: rawItem.style.fontWeight ?? DEFAULT_ITEM_STYLE.fontWeight,
            textAlign: rawItem.style.textAlign ?? DEFAULT_ITEM_STYLE.textAlign,
            opacity: rawItem.style.opacity ?? DEFAULT_ITEM_STYLE.opacity,
        }
        : generateDefaultStyle();

    return {
        id: rawItem.productId || rawItem.id || rawItem._id || `item-${index}`,
        title: cleanTitle(rawItem.name || rawItem.title || ""),
        subtitle: (rawItem.description || rawItem.subtitle || "").trim(),
        price: cleanPrice(rawItem.price || rawItem.smallPrice || rawItem.largePrice || 0),
        image: rawItem.image || rawItem.img || rawItem.imageUrl || DEFAULT_PLACEHOLDER_IMAGE,
        isAvailable: rawItem.isAvailable !== undefined ? Boolean(rawItem.isAvailable) : true,
        layout,
        style,
    };
}

/**
 * 🚀 Ana Normalizasyon Fonksiyonu
 * Dashboard'dan gelen her türlü ham veriyi TEMİZ IMenuData formatına çevirir
 * Layout ve Style her item için GARANTİLİ olarak atanır
 */
export function normalizeDashboardDataToMenuData(rawData: any, capacity?: number): IMenuData {
    console.log("\n");
    console.log("╔══════════════════════════════════════════════════════════════╗");
    console.log("║        🧹 NORMALIZATION LAYER - VERİ TEMİZLENİYOR           ║");
    console.log("╠══════════════════════════════════════════════════════════════╣");

    let settings: IMenuData["settings"];
    let items: IMenuItem[];

    // FORMAT 1: Zaten IMenuData formatındaysa
    if (rawData?.settings && Array.isArray(rawData?.items)) {
        console.log("║ 📋 Format: IMenuData (zaten temiz format)");

        settings = {
            theme: rawData.settings.theme || DEFAULT_MENU_SETTINGS.theme,
            currency: rawData.settings.currency || DEFAULT_MENU_SETTINGS.currency,
            globalTitle: (rawData.settings.globalTitle || DEFAULT_MENU_SETTINGS.globalTitle).toUpperCase(),
        };

        const totalItems = rawData.items.length;
        items = rawData.items.map((item: any, index: number) =>
            cleanMenuItem(item, index, totalItems, capacity)
        );
    }
    // FORMAT 2: Legacy format { category: string, data: [...] }
    else if (rawData?.data && Array.isArray(rawData.data)) {
        console.log("║ 📋 Format: Legacy ({ category, data: [...] })");
        console.log(`║ 📁 Kategori: ${rawData.category || "(boş)"}`);
        console.log(`║ 📦 Ham ürün sayısı: ${rawData.data.length}`);

        settings = {
            theme: "dark" as const,
            currency: "₺",
            globalTitle: (rawData.category || "MENÜ").toUpperCase(),
        };

        const totalItems = rawData.data.length;
        items = rawData.data.map((item: any, index: number) =>
            cleanMenuItem(item, index, totalItems, capacity)
        );
    }
    // FORMAT 3: Template-2 format { categories: {}, data: {} }
    else if (rawData?.categories && rawData?.data && !Array.isArray(rawData.data)) {
        console.log("║ 📋 Format: Template-2 ({ categories, data: {} })");

        const allItems: any[] = [];
        Object.values(rawData.data).forEach((categoryItems: any) => {
            if (Array.isArray(categoryItems)) {
                allItems.push(...categoryItems);
            }
        });

        console.log(`║ 📦 Ham ürün sayısı: ${allItems.length}`);

        settings = {
            theme: (rawData.theme as "dark" | "light") || DEFAULT_MENU_SETTINGS.theme,
            currency: rawData.currency || DEFAULT_MENU_SETTINGS.currency,
            globalTitle: (rawData.globalTitle || DEFAULT_MENU_SETTINGS.globalTitle).toUpperCase(),
        };

        const totalItems = allItems.length;
        items = allItems.map((item: any, index: number) =>
            cleanMenuItem(item, index, totalItems, capacity)
        );
    }
    // FORMAT 4: Sadece array geldiyse
    else if (Array.isArray(rawData)) {
        console.log("║ 📋 Format: Array (sadece item listesi)");
        console.log(`║ 📦 Ham ürün sayısı: ${rawData.length}`);

        settings = { ...DEFAULT_MENU_SETTINGS };
        const totalItems = rawData.length;
        items = rawData.map((item: any, index: number) =>
            cleanMenuItem(item, index, totalItems, capacity)
        );
    }
    // FALLBACK: Boş veri
    else {
        console.log("║ ⚠️ Format: Bilinmiyor veya boş veri");
        settings = { ...DEFAULT_MENU_SETTINGS };
        items = [];
    }

    // Temizlenmiş veriyi logla
    console.log("╠══════════════════════════════════════════════════════════════╣");
    console.log("║ ✨ TEMİZLENMİŞ VERİ (Layout & Style dahil):");
    console.log(`║   🎨 Theme: ${settings.theme}`);
    console.log(`║   💰 Currency: ${settings.currency}`);
    console.log(`║   📌 GlobalTitle: ${settings.globalTitle}`);
    console.log(`║   📦 Temiz Ürün Sayısı: ${items.length}`);

    if (items.length > 0) {
        console.log("║   Ürünler:");
        items.slice(0, 5).forEach((item, idx) => {
            const layoutInfo = `x:${item.layout.x}%, y:${item.layout.y}%`;
            console.log(`║     ${idx + 1}. ${item.title} - ${settings.currency}${item.price} | ${layoutInfo}`);
        });
        if (items.length > 5) {
            console.log(`║     ... ve ${items.length - 5} ürün daha`);
        }
    }
    console.log("╚══════════════════════════════════════════════════════════════╝");
    console.log("\n");

    return { settings, items };
}

/**
 * Legacy configData formatını IMenuData formatına dönüştürür
 */
export function convertLegacyConfigToMenuData(configData: any): IMenuData {
    return normalizeDashboardDataToMenuData(configData);
}

/**
 * Ham veriyi IMenuData formatına normalize eder
 */
export function normalizeToMenuData(rawData: any): IMenuData {
    return normalizeDashboardDataToMenuData(rawData);
}

/**
 * Verinin temiz IMenuData formatında olup olmadığını kontrol eder
 */
export function isCleanMenuData(data: any): data is IMenuData {
    return (
        data &&
        typeof data === "object" &&
        data.settings &&
        typeof data.settings.theme === "string" &&
        typeof data.settings.currency === "string" &&
        typeof data.settings.globalTitle === "string" &&
        Array.isArray(data.items) &&
        data.items.every((item: any) =>
            typeof item.id === "string" &&
            typeof item.title === "string" &&
            typeof item.price === "number" &&
            typeof item.isAvailable === "boolean" &&
            item.layout && typeof item.layout.x === "number" &&
            item.style && typeof item.style.fontSize === "string"
        )
    );
}
