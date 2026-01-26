/**
 * Template Index - Tüm template'lerin merkezi export noktası
 */

// Template bileşenleri
export { default as Template1 } from "./Template1";
export { default as Template2 } from "./Template2";

// Template kapasiteleri
export const TEMPLATE_CAPACITIES: Record<string, number> = {
    "template-1": 5,
    "template-2": 8,
    "template-3": 6,
    "template-4": 8,
} as const;

/**
 * Template ID'ye göre kapasite döndürür
 */
export function getTemplateCapacity(templateId: string): number {
    const normalizedId = templateId.toLowerCase().replace(/[^a-z0-9-]/g, "");
    return TEMPLATE_CAPACITIES[normalizedId] ?? 6; // Default: 6
}

/**
 * Mevcut template bilgileri
 */
export const TEMPLATE_INFO = [
    {
        id: "template-1",
        name: "Kompakt Menü",
        capacity: 5,
        description: "5 ürün slotlu kompakt görünüm",
        preview: "/images/preview/template-1.png",
    },
    {
        id: "template-2",
        name: "Geniş Menü",
        capacity: 8,
        description: "8 ürün slotlu 2x4 grid görünüm",
        preview: "/images/preview/template-2.png",
    },
    {
        id: "template-3",
        name: "Modern Menü",
        capacity: 6,
        description: "6 ürün slotlu modern tasarım",
        preview: "/images/preview/template-3.png",
    },
    {
        id: "template-4",
        name: "Burger Menü",
        capacity: 8,
        description: "8 ürün slotlu promosyon destekli tasarım",
        preview: "/images/preview/template-4.png",
    },
] as const;
