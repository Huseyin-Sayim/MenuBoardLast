"use client";

import React from "react";
import Template1 from "@/design/templates/Template1";
import Template2 from "@/design/templates/Template2";
import type { IMenuData } from "@/types/menu-data";

/**
 * Test sayfası - Template1 ve Template2'yi görmek için
 * http://localhost:3005/design/test-templates adresinden erişebilirsiniz
 */

// Örnek veri
const sampleMenuData: IMenuData = {
    settings: {
        theme: "dark",
        currency: "₺",
        globalTitle: "BURGER MENÜ",
    },
    items: [
        {
            id: "1",
            title: "Big Mac",
            subtitle: "İki kat et, özel sos, marul, peynir",
            price: 149.99,
            image: "/images/burger_menu.svg",
            isAvailable: true,
            layout: { x: 2, y: 2, w: 23, h: 45, z: 1 },
            style: { fontSize: '1.2vw', color: '#FFFFFF', fontWeight: '600', textAlign: 'center', opacity: 1 },
        },
        {
            id: "2",
            title: "Whopper",
            subtitle: "Közlenmiş et, taze sebzeler",
            price: 139.99,
            image: "/images/burger_menu.svg",
            isAvailable: true,
            layout: { x: 27, y: 2, w: 23, h: 45, z: 1 },
            style: { fontSize: '1.2vw', color: '#FFFFFF', fontWeight: '600', textAlign: 'center', opacity: 1 },
        },
        {
            id: "3",
            title: "Chicken Burger",
            subtitle: "Çıtır tavuk, mayonez, marul",
            price: 119.99,
            image: "/images/burger_menu.svg",
            isAvailable: false, // Tükendi
            layout: { x: 52, y: 2, w: 23, h: 45, z: 1 },
            style: { fontSize: '1.2vw', color: '#FFFFFF', fontWeight: '600', textAlign: 'center', opacity: 0.5 },
        },
        {
            id: "4",
            title: "Double Cheeseburger",
            subtitle: "Çift kat peynir, turşu, hardal",
            price: 159.99,
            image: "/images/burger_menu.svg",
            isAvailable: true,
            layout: { x: 77, y: 2, w: 23, h: 45, z: 1 },
            style: { fontSize: '1.2vw', color: '#FFFFFF', fontWeight: '600', textAlign: 'center', opacity: 1 },
        },
    ],
};

export default function TestTemplatesPage() {
    const [activeTemplate, setActiveTemplate] = React.useState<1 | 2>(1);

    const handleItemClick = (item: any, index: number) => {
        alert(`Tıklanan ürün: ${item.title} (index: ${index})`);
    };

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Template Seçici */}
            <div className="fixed top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={() => setActiveTemplate(1)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTemplate === 1
                        ? "bg-amber-500 text-black"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                >
                    Template1 (5 slot)
                </button>
                <button
                    onClick={() => setActiveTemplate(2)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTemplate === 2
                        ? "bg-amber-500 text-black"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                >
                    Template2 (8 slot)
                </button>
            </div>

            {/* Template Gösterimi */}
            {activeTemplate === 1 ? (
                <Template1
                    data={sampleMenuData}
                    isEditable={true}
                    onItemClick={handleItemClick}
                />
            ) : (
                <Template2
                    data={sampleMenuData}
                    isEditable={true}
                    onItemClick={handleItemClick}
                />
            )}

            {/* Bilgi Kutusu */}
            <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-4 rounded-lg max-w-sm">
                <h3 className="font-bold text-amber-500 mb-2">📋 Test Bilgisi</h3>
                <p className="text-sm text-gray-300">
                    <strong>Veri:</strong> 4 ürün gönderildi
                    <br />
                    <strong>Template1:</strong> 5 slot → 4 ürün + 1 boş slot
                    <br />
                    <strong>Template2:</strong> 8 slot → 4 ürün + 4 boş slot
                </p>
            </div>
        </div>
    );
}
