"use client";

import type { JSX } from "react";
import type { IMenuData, IMenuItem } from "@/types/menu-data";

type Template4Variant = "full" | "preview";

// 🎯 Template-4 Kapasite
const CAPACITY = 8;

export interface Template4MenuItem {
  name: string;
  price: string;
  description?: string;
  image?: string;
  badge?: string | null;
  productId?: string;
  priceType?: string;
  // 🆕 IMenuData fields
  layout?: { x: number; y: number; w: number; h: number; z: number };
  style?: { fontSize: string; color: string; fontWeight: string; textAlign: any; opacity: number };
}

interface Template4Props {
  variant?: Template4Variant;
  // 🆕 IMenuData desteği - yeni sistemle uyumluluk
  menuData?: IMenuData;
  // Legacy props
  items?: Template4MenuItem[];
  isEditable?: boolean;
  availableCategories?: Array<{ _id: string; name: string }>;
  availableProductsBySlot?: Record<number, Array<{ _id: string; name: string; pricing: any; category: string; description?: string; image?: string; img?: string; imageUrl?: string }>>;
  selectedCategoriesBySlot?: Record<number, string>;
  onCategoryChangeBySlot?: (slotIndex: number, categoryId: string) => void;
  onProductSelect?: (slotIndex: number, productId: string) => void;
  onPriceTypeSelect?: (slotIndex: number, priceType: string) => void;
  onProductReset?: (slotIndex: number) => void;
  onImageClick?: (slotIndex: number) => void;
  // Sol taraf (promo) için props
  promoProduct?: {
    name?: string;
    price?: string;
    currency?: string;
    cents?: string;
    categoryId?: string;
    productId?: string;
    priceType?: string;
    image?: string;
  };
  promoImage?: string;
  promoCategoryId?: string;
  promoAvailableProducts?: Array<{ _id: string; name: string; pricing: any; category: string; image?: string; img?: string; imageUrl?: string }>;
  onPromoCategoryChange?: (categoryId: string) => void;
  onPromoProductSelect?: (productId: string) => void;
  onPromoPriceTypeSelect?: (priceType: string) => void;
  onPromoImageClick?: () => void;
}

// Static configuration copied from legacy BurgerMenu template
const titleConfig = {
  mainTitle: "KING\nDEALS",
  currency: "₺",
  price: "299",
  cents: ".95",
  subtitle: "VALUE MENU",
};

const menuItems = [
  {
    name: "SOUTHWEST BBQ",
    price: "300",
    description:
      "Cheddar cheese, bacon, onion straws, BBQ sauce, chipotle mayo, lettuce, tomato, pickles",
    image: "/images/burger_menu.svg",
    badge: null as string | null,
  },
  {
    name: "THE CLASSIC",
    price: "249",
    description:
      "American cheese, pickles, lettuce, tomato, caramelized onions, Burger Shop dressing",
    image: "/images/burger_menu.svg",
    badge: null as string | null,
  },
  {
    name: "BACON CHEDDAR",
    price: "350",
    description:
      "Cheddar cheese, bacon, lettuce, tomato, red onion, pickles, mustard, ketchup, mayo",
    image: "/images/burger_menu.svg",
    badge: null as string | null,
  },
  {
    name: "BLUE CHEESE BURGER",
    price: "299",
    description: "With pesto aioli, lettuce, tomato and red onions.",
    image: "/images/burger_menu.svg",
    badge: "",
  },
  {
    name: "THE TURKEY BURGER",
    price: "250",
    description:
      "Fresh ground turkey broiled and served with lettuce, tomato, pickles, red onion and mayo.",
    image: "/images/burger_menu.svg",
    badge: null as string | null,
  },
  {
    name: "THE HAWAIIAN BURGER",
    price: "350",
    description: "With grilled pineapple and teriyaki sauce on a bun.",
    image: "/images/burger_menu.svg",
    badge: null as string | null,
  },
  {
    name: "BBQ BURGER",
    price: "300",
    description: "Bacon, crispy onion ring, American cheese and BBQ sauce",
    image: "/images/burger_menu.svg",
    badge: "",
  },
  {
    name: "THE ORIGINAL",
    price: "300",
    description: "American cheese, pickles, onion, mustard, ketchup",
    image: "/images/burger_menu.svg",
    badge: null as string | null,
  },
] as Template4MenuItem[];

const promoImage = "/images/burger_menu.svg";
const logoImage = "/images/burger_logo.svg";

// 🎯 Kapasite export
Template4BurgerMenu.capacity = CAPACITY;

export default function Template4BurgerMenu({
  variant = "full",
  menuData,
  items = menuItems,
  isEditable = false,
  availableCategories = [],
  availableProductsBySlot = {},
  selectedCategoriesBySlot = {},
  onCategoryChangeBySlot,
  onProductSelect,
  onPriceTypeSelect,
  onProductReset,
  onImageClick,
  promoProduct,
  promoImage,
  promoCategoryId,
  promoAvailableProducts = [],
  onPromoCategoryChange,
  onPromoProductSelect,
  onPromoPriceTypeSelect,
  onPromoImageClick,
}: Template4Props): JSX.Element {
  // 📝 Detaylı Debug Loglama
  if (typeof window !== 'undefined') {
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                 🍔 TEMPLATE-4 RENDER                         ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log(`║ 📊 Kapasite: ${CAPACITY}`);
    console.log(`║ 📦 Gelen Item Sayısı: ${items?.length || 0}`);
    console.log(`║ 🆕 IMenuData Kullanılıyor: ${!!menuData}`);
    console.log(`║ ✏️ Düzenleme Modu: ${isEditable}`);
    if (menuData) {
      console.log(`║ 🎨 Tema: ${menuData.settings?.theme}`);
      console.log(`║ 💰 Para Birimi: ${menuData.settings?.currency}`);
      console.log(`║ 📌 Başlık: ${menuData.settings?.globalTitle}`);
      console.log(`║ 📦 IMenuData Item Sayısı: ${menuData.items?.length || 0}`);
    }
    if (promoProduct) {
      console.log(`║ 🎁 Promo Ürün: ${promoProduct.name || 'Belirtilmemiş'}`);
    }
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('\n');
  }

  // 🆕 VERİ TEMİZ GELİYOR - Doğrudan kullan
  // Normalization Layer sayesinde artık item.title, item.price (number), item.image garantili

  // IMenuData varsa doğrudan Template4MenuItem formatına çevir
  // Legacy items varsa olduğu gibi kullan
  const processedItems: Template4MenuItem[] = menuData?.items?.map((item: IMenuItem) => ({
    name: item.title,  // IMenuData'da title olarak geliyor, template name bekliyor
    price: `${menuData.settings?.currency || "₺"}${item.price}`,  // number → formatted string
    description: item.subtitle || "",
    image: item.image || "/images/placeholder-food.svg",
    badge: null,
    productId: item.id,
    layout: item.layout, // 🆕 Layout aktar
    style: item.style,   // 🆕 Style aktar
  })) || items.map((item: any, index: number) => ({
    name: item.title || item.name || "",
    price: typeof item.price === "number" ? `₺${item.price}` : item.price || "",
    description: item.description || item.subtitle || "",
    image: item.image || "/images/placeholder-food.svg",
    badge: item.badge || null,
    productId: item.productId || `item-${index}`,
    layout: item.layout,
    style: item.style
  }));

  // Slice logic - kapasite aşımını kontrol et
  let finalItems = processedItems;
  if (processedItems.length > CAPACITY) {
    finalItems = processedItems.slice(0, CAPACITY);
    console.log(`[Template-4] ⚠️ ${processedItems.length - CAPACITY} ürün kesildi (kapasite: ${CAPACITY})`);
  }

  const displayTitle = promoProduct?.name || (menuData?.settings?.globalTitle) || titleConfig.mainTitle;
  const displayTitleString = typeof displayTitle === 'string' ? displayTitle : String(displayTitle);
  const titleLines = displayTitleString.split("\n");
  const displayPrice = promoProduct?.price || titleConfig.price;
  const displayCurrency = promoProduct?.currency || (menuData?.settings?.currency) || titleConfig.currency;
  const displayCents = promoProduct?.cents || titleConfig.cents;
  const displayPromoImage = promoImage || promoProduct?.image || "/images/burger_menu.svg";
  const displayItems = finalItems.length > 0 ? finalItems : menuItems;

  return (
    <>
      <div
        className={`burger-menu${variant === "preview" ? " burger-menu--preview" : ""
          }`}
      >
        <div className="yellow-wave" />

        <div className="left-section">
          <div className="title-section">
            <h1 className="king-title">
              {titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < titleLines.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <div className="price-tag">
              <span className="dollar">{displayCurrency}</span>
              <span className="amount">{displayPrice}</span>
              <span className="cents">{displayCents}</span>
            </div>
          </div>

          <h2 className="value-menu">{titleConfig.subtitle}</h2>

          <div
            className={`promo-image-area`}>
            <img src={displayPromoImage} alt="Promo Combo" className="promo-img" />
          </div>
        </div>

        <div className="right-section">
          <div className="logo-area">
            <img src={logoImage} alt="Logo" className="logo-img" />
          </div>

          <div className="menu-grid">
            {displayItems.map((item, index) => {
              const slotProducts = availableProductsBySlot[index] || [];
              const selectedCategoryId = selectedCategoriesBySlot[index] || "";
              const currentItem = items[index];
              const selectedProduct = currentItem?.productId
                ? slotProducts.find((p) => p._id === currentItem.productId)
                : currentItem?.name
                  ? slotProducts.find((p) => p.name === currentItem.name)
                  : null;

              const hasCategory = !!selectedCategoryId;
              const hasProduct = !!selectedProduct;

              // Layout defaults if missing
              const layout = item.layout || { x: 0, y: 0, w: 23, h: 45, z: 1 };
              const style = item.style || { fontSize: '1vw', color: '#FFFFFF', fontWeight: 'bold', textAlign: 'left', opacity: 1 };

              return (
                <div
                  className="menu-item absolute"
                  key={index}
                  style={{
                    left: `${layout.x}%`,
                    top: `${layout.y}%`,
                    width: `${layout.w}%`,
                    height: `${layout.h}%`,
                    zIndex: layout.z,
                    opacity: style.opacity,
                  }}
                >
                  <div
                    className={`item-image${isEditable ? " item-image-editable" : ""}`}
                    onClick={() => {
                      if (isEditable && onImageClick) {
                        onImageClick(index);
                      }
                    }}
                    style={{
                      ...(isEditable ? { cursor: "pointer" } : {}),
                      height: '65%', // Image takes 65% of item height
                      position: 'relative'
                    }}
                  >
                    <img
                      src={item.image || "/images/placeholder-food.svg"}
                      alt={item.name}
                      className="item-img"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                    {item.badge && (
                      <span className={`badge ${item.badge.toLowerCase()}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="item-info" style={{ height: '35%', overflow: 'hidden' }}>
                    <div className="item-header">
                      {isEditable ? (
                        <>
                          {/* Kategori seçimi veya seçilmişse kategori adı + Değiştir */}
                          {!hasCategory ? (
                            <select
                              value={selectedCategoryId}
                              onChange={(e) => {
                                if (onCategoryChangeBySlot) {
                                  onCategoryChangeBySlot(index, e.target.value);
                                }
                              }}
                              className="template-4-select template-4-select-full"
                              style={{ maxHeight: '100%' }}
                            >
                              <option value="">Kategori Seç</option>
                              {availableCategories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <>
                              {/* Kategori adı + Değiştir butonu */}
                              <div className="template-4-category-header">
                                <span className="template-4-category-name">
                                  {availableCategories.find(c => c._id === selectedCategoryId)?.name || 'Kategori'}
                                </span>
                                <button
                                  onClick={() => {
                                    if (onProductReset) {
                                      onProductReset(index);
                                    }
                                  }}
                                  className="template-4-change-btn"
                                >
                                  Değiştir
                                </button>
                              </div>

                              {/* Ürün seçimi dropdown */}
                              <select
                                value={currentItem?.productId || ""}
                                onChange={(e) => {
                                  if (onProductSelect && e.target.value) {
                                    onProductSelect(index, e.target.value);
                                  }
                                }}
                                className="template-4-select template-4-select-full"
                              >
                                <option value="">Ürün Seç</option>
                                {slotProducts.map((product: any) => (
                                  <option key={product._id} value={product._id}>
                                    {product.name}
                                  </option>
                                ))}
                              </select>

                              {/* Fiyat seçimi dropdown */}
                              {hasProduct && selectedProduct?.pricing && (
                                <select
                                  value={currentItem?.priceType || "basePrice"}
                                  onChange={(e) => {
                                    if (onPriceTypeSelect) {
                                      onPriceTypeSelect(index, e.target.value);
                                    }
                                  }}
                                  className="template-4-select template-4-price-dropdown"
                                >
                                  {Object.keys(selectedProduct.pricing).map((priceType) => {
                                    const priceValue = selectedProduct.pricing[priceType]?.price || 0;
                                    const priceLabel = priceType === "basePrice"
                                      ? "Ana Fiyat"
                                      : priceType === "small"
                                        ? "Küçük"
                                        : priceType === "large"
                                          ? "Büyük"
                                          : priceType;
                                    return (
                                      <option key={priceType} value={priceType}>
                                        {priceLabel} - ₺{priceValue}
                                      </option>
                                    );
                                  })}
                                </select>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <h3 className="item-name" style={{ fontSize: '1.4em' }}>{item.name}</h3>
                          <span className="item-price" style={{ fontSize: '0.9em' }}>{item.price}</span>
                        </>
                      )}
                    </div>
                    {item.description && !isEditable && (
                      <p className="item-desc" style={{ fontSize: '0.7em', lineHeight: 1.2 }}>{item.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .burger-menu {
          --scale-x: calc(100vw / 1920);
          --scale-y: calc(100vh / 1080);

          background-color: #cc2027;
          width: 100vw;
          height: 100vh;
          position: relative;
          display: flex;
          overflow: hidden;
        }

        /* Preview modunda orijinal boyut */
        .burger-menu.burger-menu--preview {
          transform: scale(1);
          transform-origin: top left;
        }

        .yellow-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: calc(500 * var(--scale-x));
          height: calc(120 * var(--scale-y));
          background: #f5a623;
          border-radius: 0 100% 0 0;
          z-index: 1;
        }

        .left-section {
          width: 34%; /* Fixed percentage width */
          padding: calc(50 * var(--scale-y)) calc(50 * var(--scale-x));
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 2;
        }

        .title-section {
          display: flex;
          align-items: flex-start;
          gap: calc(20 * var(--scale-x));
        }

        .king-title {
          font-family: "Bebas Neue", sans-serif;
          font-size: calc(100 * var(--scale-x));
          color: #ffffff;
          line-height: 0.9;
          text-shadow: 3px 3px 0 #000;
        }

        .price-tag {
          display: flex;
          align-items: flex-start;
          color: #ffffff;
          font-family: "Bebas Neue", sans-serif;
        }

        .price-tag .dollar {
          font-size: calc(40 * var(--scale-x));
          margin-top: calc(10 * var(--scale-y));
        }

        .price-tag .amount {
          font-size: calc(120 * var(--scale-x));
          line-height: 1;
        }

        .price-tag .cents {
          font-size: calc(50 * var(--scale-x));
          margin-top: calc(10 * var(--scale-y));
        }

        .value-menu {
          font-family: "Bebas Neue", sans-serif;
          font-size: calc(60 * var(--scale-x));
          color: #f5a623;
          margin-top: calc(10 * var(--scale-y));
          text-shadow: 2px 2px 0 #000;
        }

        .promo-image-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: calc(20 * var(--scale-y)) 0;
        }

        .promo-img {
          max-width: 120%;
          max-height: calc(550 * var(--scale-y));
          object-fit: contain;
          filter: drop-shadow(8px 15px 30px rgba(0, 0, 0, 0.5));
        }

        .right-section {
          flex: 1;
          padding: calc(30 * var(--scale-y)) calc(40 * var(--scale-x));
          position: relative;
        }

        .logo-area {
          position: absolute;
          top: calc(0 * var(--scale-y));
          right: calc(40 * var(--scale-x));
          z-index: 10;
        }

        .logo-img {
          width: calc(200 * var(--scale-x));
          height: auto;
        }

        .menu-grid {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
        }

        .menu-item {
          display: flex;
          flex-direction: column;
          gap: 0; /* Reset gap, use height percentages */
          overflow: visible; /* Allow dropdowns to overflow */
        }

        .item-image {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-image-editable:hover {
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .item-image-editable::after {
          content: "📷";
          position: absolute;
          top: 5px;
          right: 5px;
          background-color: rgba(0, 0, 0, 0.6);
          padding: 4px 6px;
          border-radius: 4px;
          font-size: 14px;
          pointer-events: none;
        }

        .item-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: drop-shadow(3px 5px 10px rgba(0, 0, 0, 0.3));
        }

        .badge {
          position: absolute;
          top: 0;
          right: 0;
          padding: calc(5 * var(--scale-y)) calc(12 * var(--scale-x));
          border-radius: calc(20 * var(--scale-x));
          font-family: "Open Sans", sans-serif;
          font-size: calc(12 * var(--scale-x));
          font-weight: 700;
          z-index: 2;
        }

        .badge.new {
          background-color: #f5a623;
          color: #000;
        }

        .badge.offer {
          background-color: #ffffff;
          color: #cc2027;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 100%;
        }

        .item-header {
          display: flex;
          align-items: baseline;
          gap: 5px;
          width: 100%;
        }

        .item-name {
          font-family: "Bebas Neue", sans-serif;
          color: #ffffff;
          letter-spacing: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-price {
          font-family: "Open Sans", sans-serif;
          font-weight: 700;
          color: #f5a623;
          background-color: rgba(0, 0, 0, 0.3);
          padding: 2px 8px;
          border-radius: 8px;
        }

        .item-desc {
          font-family: "Open Sans", sans-serif;
          color: rgba(255, 255, 255, 0.9);
        }

        /* Sadece dashboard düzenleme ekranı için (preview modu) */
        .burger-menu.burger-menu--preview .menu-grid {
          /* No specific grid adjustments needed for absolute */
        }

        .template-4-editor-controls {
          display: flex;
          flex-direction: column;
          gap: calc(4 * var(--scale-y));
          margin-bottom: calc(8 * var(--scale-y));
          padding: calc(8 * var(--scale-y)) calc(8 * var(--scale-x));
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: calc(8 * var(--scale-x));
        }

        .template-4-select {
          padding: 2px 4px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background-color: rgba(255, 255, 255, 0.9);
          color: #000;
          font-size: 11px;
          font-family: "Open Sans", sans-serif;
          cursor: pointer;
        }

        .template-4-select:hover {
          background-color: rgba(255, 255, 255, 1);
        }

        .template-4-select:focus {
          outline: none;
          border-color: #f5a623;
        }

        .promo-editor-controls {
          display: flex;
          flex-direction: column;
          gap: calc(4 * var(--scale-y));
          margin-bottom: calc(20 * var(--scale-y));
          padding: calc(8 * var(--scale-y)) calc(8 * var(--scale-x));
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: calc(8 * var(--scale-x));
        }

        .promo-image-editable:hover {
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .promo-image-editable::after {
          content: "📷";
          position: absolute;
          top: calc(10 * var(--scale-y));
          right: calc(10 * var(--scale-x));
          background-color: rgba(0, 0, 0, 0.6);
          padding: calc(6 * var(--scale-y)) calc(8 * var(--scale-x));
          border-radius: calc(6 * var(--scale-x));
          font-size: calc(18 * var(--scale-x));
          pointer-events: none;
          z-index: 10;
        }

        .template-4-change-btn {
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #f5a623;
          background-color: transparent;
          color: #f5a623;
          font-size: 9px;
          font-family: "Open Sans", sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }

        .template-4-change-btn:hover {
          background-color: #f5a623;
          color: #000;
        }

        .template-4-category-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 2px;
        }

        .template-4-category-name {
          font-family: "Bebas Neue", sans-serif;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
        }

        .template-4-select-full {
          width: 100%;
          margin-bottom: 2px;
        }

        .template-4-price-dropdown {
          width: 100%;
          background-color: #1a8754;
          color: #fff;
          border-color: #1a8754;
        }

        .template-4-price-dropdown:hover {
          background-color: #158d4e;
        }

        .item-price-container {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .template-4-price-select {
          padding: 2px 4px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background-color: rgba(0, 0, 0, 0.4);
          color: #f5a623;
          font-size: 10px;
          font-family: "Open Sans", sans-serif;
          cursor: pointer;
        }

        .template-4-price-select:hover {
          background-color: rgba(0, 0, 0, 0.6);
        }

        .template-4-price-select:focus {
          outline: none;
          border-color: #f5a623;
        }
      `}</style>
    </>
  );
}
