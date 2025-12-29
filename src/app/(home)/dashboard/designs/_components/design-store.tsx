"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Design = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPurchased?: boolean;
};

const mockDesigns: Design[] = [
  {
    id: "1",
    name: "Modern Menü Tasarımı",
    description: "Şık ve modern menü kartı tasarımı",
    price: 99,
    image: "/images/cards/cards-01.png",
    category: "Menü",
  },
  {
    id: "2",
    name: "Klasik Restoran Tasarımı",
    description: "Geleneksel ve zarif restoran menü tasarımı",
    price: 149,
    image: "/images/cards/cards-02.png",
    category: "Menü",
  },
  {
    id: "3",
    name: "Minimalist Tasarım",
    description: "Sade ve minimal menü tasarımı",
    price: 79,
    image: "/images/cards/cards-03.png",
    category: "Menü",
  },
  {
    id: "4",
    name: "Renkli Promosyon Tasarımı",
    description: "Dikkat çekici promosyon menü tasarımı",
    price: 129,
    image: "/images/cards/cards-04.png",
    category: "Promosyon",
  },
  {
    id: "5",
    name: "Lüks Restoran Tasarımı",
    description: "Premium restoran menü tasarımı",
    price: 199,
    image: "/images/cards/cards-05.png",
    category: "Menü",
  },
  {
    id: "6",
    name: "Hızlı Servis Tasarımı",
    description: "Fast food restoranlar için tasarım",
    price: 89,
    image: "/images/cards/cards-06.png",
    category: "Fast Food",
  },
];

export function DesignStore() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [designs, setDesigns] = useState<Design[]>(mockDesigns);

  const categories = ["Tümü", "Menü", "Promosyon", "Fast Food"];

  const filteredDesigns =
    selectedCategory === "Tümü"
      ? designs
      : designs.filter((design) => design.category === selectedCategory);

  const handlePurchase = (id: string) => {
    setDesigns((prev) =>
      prev.map((design) =>
        design.id === id ? { ...design, isPurchased: true } : design
      )
    );
    // Burada gerçek satın alma işlemi yapılabilir
    console.log(`Tasarım ${id} satın alındı`);
  };

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="mb-6">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white mb-4">
          Tasarım Mağazası
        </h2>
        <p className="text-sm text-dark-4 dark:text-dark-6 mb-6">
          Yeni tasarımlar satın alın ve menü tahtanızı güzelleştirin
        </p>

        {/* Kategori Filtreleri */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-2 text-dark-4 hover:bg-gray-3 dark:bg-dark-2 dark:text-dark-6 dark:hover:bg-dark-3"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tasarım Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDesigns.map((design) => (
          <div
            key={design.id}
            className="group relative rounded-lg border border-stroke bg-white overflow-hidden shadow-card hover:shadow-card-2 transition-all dark:border-stroke-dark dark:bg-dark-2"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-gray-2 dark:bg-dark-3">
              <Image
                src={design.image}
                alt={design.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {design.isPurchased && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                    Satın Alındı
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="mb-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {design.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-dark dark:text-white mb-1">
                {design.name}
              </h3>
              <p className="text-sm text-dark-4 dark:text-dark-6 mb-4">
                {design.description}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-dark dark:text-white">
                    ${design.price}
                  </span>
                </div>
                <button
                  onClick={() => handlePurchase(design.id)}
                  disabled={design.isPurchased}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    design.isPurchased
                      ? "bg-gray-3 text-dark-4 cursor-not-allowed dark:bg-dark-3 dark:text-dark-6"
                      : "bg-primary text-white hover:bg-primary/90 active:scale-95"
                  )}
                >
                  {design.isPurchased ? "Satın Alındı" : "Satın Al"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDesigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-dark-4 dark:text-dark-6">
            Bu kategoride tasarım bulunamadı.
          </p>
        </div>
      )}
    </div>
  );
}

