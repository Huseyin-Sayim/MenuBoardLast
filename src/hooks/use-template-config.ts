import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IMenuData, IMenuItem, IMenuItemLayout, IMenuItemStyle } from "@/types/menu-data";
import {
  DEFAULT_MENU_SETTINGS,
  generateAutoLayout,
  generateDefaultStyle
} from "@/types/menu-data";

const templateConfigKeys = {
  all: ['templateConfig'] as const,
  detail: (templateId: string, configId?: string) =>
    configId
      ? [...templateConfigKeys.all, templateId, configId] as const
      : [...templateConfigKeys.all, templateId] as const
};

// ═══════════════════════════════════════════════════════════════
// 🧹 NORMALIZATION FUNCTIONS - Veri Temizleme + Layout/Style
// ═══════════════════════════════════════════════════════════════

const DEFAULT_PLACEHOLDER_IMAGE = "/images/placeholder-food.svg";

function cleanPrice(rawPrice: any): number {
  if (typeof rawPrice === "number") return rawPrice;
  if (typeof rawPrice === "string") {
    const cleaned = rawPrice
      .replace(/[₺$€£¥]/g, "")
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".");
    return parseFloat(cleaned) || 0;
  }
  return 0;
}

function cleanTitle(rawTitle: any): string {
  if (typeof rawTitle === "string") return rawTitle.trim().toUpperCase();
  return "";
}

/**
 * Tek item'ı temizle + Layout/Style ata
 */
function cleanMenuItem(
  rawItem: any,
  index: number,
  totalItems: number,
  capacity?: number
): IMenuItem {
  // Layout
  const layout: IMenuItemLayout = rawItem.layout && typeof rawItem.layout === 'object'
    ? rawItem.layout
    : generateAutoLayout(index, totalItems, capacity);

  // Style
  const style: IMenuItemStyle = rawItem.style && typeof rawItem.style === 'object'
    ? rawItem.style
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
 * 🚀 Dashboard verisini TEMİZ IMenuData formatına çevirir
 * Layout ve Style GARANTİLİ olarak atanır
 */
function normalizeToCleanMenuData(rawData: any, capacity?: number): IMenuData {
  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║   🧹 FRONTEND NORMALIZATION - VERİ TEMİZLENİYOR             ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");

  let settings: IMenuData["settings"] = {
    theme: "dark" as const,
    currency: "₺",
    globalTitle: cleanTitle(rawData?.category) || "MENÜ",
  };

  let items: IMenuItem[] = [];

  // Legacy format: { category, data: [...] }
  if (rawData?.data && Array.isArray(rawData.data)) {
    console.log(`║ 📋 Format: Legacy ({ category, data: [...] })`);
    console.log(`║ 📦 Ham ürün sayısı: ${rawData.data.length}`);

    const totalItems = rawData.data.length;
    items = rawData.data.map((item: any, index: number) =>
      cleanMenuItem(item, index, totalItems, capacity)
    );
  }
  // Template-2 format
  else if (rawData?.categories && rawData?.data && !Array.isArray(rawData.data)) {
    console.log(`║ 📋 Format: Template-2`);

    const allItems: any[] = [];
    Object.values(rawData.data).forEach((categoryItems: any) => {
      if (Array.isArray(categoryItems)) allItems.push(...categoryItems);
    });

    const totalItems = allItems.length;
    items = allItems.map((item: any, index: number) =>
      cleanMenuItem(item, index, totalItems, capacity)
    );
  }
  // Zaten IMenuData formatındaysa
  else if (rawData?.settings && Array.isArray(rawData?.items)) {
    console.log(`║ 📋 Format: IMenuData (zaten temiz)`);
    settings = rawData.settings;

    const totalItems = rawData.items.length;
    items = rawData.items.map((item: any, index: number) =>
      cleanMenuItem(item, index, totalItems, capacity)
    );
  }

  // Log
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log("║ ✨ TEMİZLENMİŞ VERİ (Layout & Style dahil):");
  console.log(`║   📦 Ürün Sayısı: ${items.length}`);
  if (items.length > 0) {
    items.slice(0, 3).forEach((item, idx) => {
      console.log(`║   ${idx + 1}. ${item.title} | x:${item.layout.x}%, y:${item.layout.y}%`);
    });
  }
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  return { settings, items };
}

// ═══════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════

export function useTemplateConfig(templateId: string, configId?: string) {
  return useQuery({
    queryKey: templateConfigKeys.detail(templateId, configId),
    queryFn: async () => {
      const url = configId
        ? `/api/templates/${templateId}/config?configId=${configId}`
        : `/api/templates/${templateId}/config`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      return { configData: data.configData || null, configId: data.configId };
    },
    enabled: !!templateId
  });
}

export function useUpdateTemplateConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      templateId,
      configData,
      configId,
      capacity
    }: {
      templateId: string;
      configData: any;
      configId?: string;
      capacity?: number;
    }) => {
      console.log('🔄 Mutation çağrıldı - HAM VERİ');

      // 🚀 NORMALIZATION: API'ye göndermeden ÖNCE temizle + Layout/Style ata
      const cleanedMenuData = normalizeToCleanMenuData(configData, capacity);

      const response = await fetch(`/api/templates/${templateId}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: cleanedMenuData.settings,
          items: cleanedMenuData.items,
          configId,
          useMenuDataFormat: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to update.');
      }

      const result = await response.json();
      console.log('✅ API başarılı - TEMİZ VERİ kaydedildi');
      return { ...result, cleanedMenuData };
    },
    onSuccess: (data, variables) => {
      const savedConfigId = data?.data?.id || variables.configId;
      queryClient.setQueryData(
        templateConfigKeys.detail(variables.templateId, savedConfigId),
        { configData: data.cleanedMenuData, configId: savedConfigId }
      );
    },
    onError: (error) => {
      console.error('❌ Mutation hatası:', error);
    }
  });
}