"use client";

import React, { useMemo } from "react";
import type {
    IMenuData,
    IMenuItem,
    IPlaceholderItem,
    INormalizedMenuData,
    ITemplateWrapperProps,
} from "../../types/menu-data";
import { createPlaceholderItem } from "../../types/menu-data";

/**
 * TemplateWrapper - Slice & Placeholder Logic
 * 
 * Bu bileşen tüm template'ler için ortak veri normalizasyonu sağlar:
 * - Eğer items > capacity ise .slice(0, capacity) ile keser
 * - Eğer items < capacity ise placeholder item'lar ekler
 */
export function TemplateWrapper({
    data,
    capacity,
    children,
}: ITemplateWrapperProps): React.ReactNode {
    const normalizedData = useMemo<INormalizedMenuData>(() => {
        const { settings, items } = data;
        const originalCount = items.length;

        let normalizedItems: (IMenuItem | IPlaceholderItem)[];

        if (items.length > capacity) {
            // Slice: Fazla item'ları kes
            normalizedItems = items.slice(0, capacity);
        } else if (items.length < capacity) {
            // Placeholder: Eksik slotları doldur
            const placeholders = Array.from(
                { length: capacity - items.length },
                (_, index) => createPlaceholderItem(items.length + index)
            );
            normalizedItems = [...items, ...placeholders];
        } else {
            // Tam eşleşme
            normalizedItems = [...items];
        }

        return {
            settings,
            items: normalizedItems,
            originalCount,
            capacity,
        };
    }, [data, capacity]);

    return <>{children(normalizedData)}</>;
}

/**
 * useNormalizedMenuData Hook
 * 
 * TemplateWrapper kullanmadan doğrudan hook olarak kullanılabilir
 */
export function useNormalizedMenuData(
    data: IMenuData,
    capacity: number
): INormalizedMenuData {
    return useMemo<INormalizedMenuData>(() => {
        const { settings, items } = data;
        const originalCount = items.length;

        let normalizedItems: (IMenuItem | IPlaceholderItem)[];

        if (items.length > capacity) {
            normalizedItems = items.slice(0, capacity);
        } else if (items.length < capacity) {
            const placeholders = Array.from(
                { length: capacity - items.length },
                (_, index) => createPlaceholderItem(items.length + index)
            );
            normalizedItems = [...items, ...placeholders];
        } else {
            normalizedItems = [...items];
        }

        return {
            settings,
            items: normalizedItems,
            originalCount,
            capacity,
        };
    }, [data, capacity]);
}

export default TemplateWrapper;
