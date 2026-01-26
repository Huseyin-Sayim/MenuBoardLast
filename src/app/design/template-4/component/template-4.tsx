"use client";

import type { JSX } from "react";

type Template4Variant = "full" | "preview";

export interface Template4MenuItem {
  name: string;
  price: string;
  description?: string;
  image?: string;
  badge?: string | null;
  productId?: string;
  priceType?: string;
}

interface Template4Props {
  variant?: Template4Variant;
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
];

const promoImage = "/images/burger_menu.svg";
const logoImage = "/images/burger_logo.svg";

export default function Template4BurgerMenu({
  variant = "full",
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
  // Debug: Client-side'da props'ları log'la
  if (typeof window !== 'undefined') {
    console.log('Template4BurgerMenu props:', {
      hasPromoProduct: !!promoProduct,
      promoProduct,
      promoImage,
      promoProductImage: promoProduct?.image,
      displayPromoImage: promoImage || promoProduct?.image || "/images/burger_menu.svg",
      itemsCount: items?.length
    });
  }

  const displayTitle = promoProduct?.name || titleConfig.mainTitle;
  const titleLines = displayTitle.split("\n");
  const displayPrice = promoProduct?.price || titleConfig.price;
  const displayCurrency = promoProduct?.currency || titleConfig.currency;
  const displayCents = promoProduct?.cents || titleConfig.cents;
  const displayPromoImage = promoImage || promoProduct?.image || "/images/burger_menu.svg";
  const displayItems = items.length > 0 ? items : menuItems;

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

              return (
                <div className="menu-item" key={index}>
                  <div
                    className={`item-image${isEditable ? " item-image-editable" : ""}`}
                    onClick={() => {
                      if (isEditable && onImageClick) {
                        onImageClick(index);
                      }
                    }}
                    style={isEditable ? { cursor: "pointer" } : {}}
                  >
                    <img
                      src={item.image || "/images/burger_menu.svg"}
                      alt={item.name}
                      className="item-img"
                    />
                    {item.badge && (
                      <span className={`badge ${item.badge.toLowerCase()}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="item-info">
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
                          <h3 className="item-name">{item.name}</h3>
                          <span className="item-price">{item.price}₺</span>
                        </>
                      )}
                    </div>
                    {item.description && (
                      <p className="item-desc">{item.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`

        body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
          background: #000;
        }
        .burger-menu {
          --scale-x: calc(100vw / 1920);
          --scale-y: calc(100vh / 1080);
          position: fixed;

          background-color: #cc2027;
          width: 100vw;
          height: 100vh;
          display: flex;
          overflow: hidden;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
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
          width: calc(650 * var(--scale-x));
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
        }

        .logo-img {
          width: calc(200 * var(--scale-x));
          height: auto;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, auto);
          gap: calc(25 * var(--scale-y)) calc(20 * var(--scale-x));
          height: 100%;
          align-content: center;
        }

        .menu-item {
          display: flex;
          flex-direction: column;
          gap: calc(8 * var(--scale-y));
        }

        .item-image {
          position: relative;
          height: calc(200 * var(--scale-y));
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
          top: calc(4 * var(--scale-y));
          right: calc(4 * var(--scale-x));
          background-color: rgba(0, 0, 0, 0.6);
          padding: calc(4 * var(--scale-y)) calc(6 * var(--scale-x));
          border-radius: calc(4 * var(--scale-x));
          font-size: calc(14 * var(--scale-x));
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
          gap: calc(4 * var(--scale-y));
        }

        .item-header {
          display: flex;
          align-items: baseline;
          gap: calc(8 * var(--scale-x));
        }

        .item-name {
          font-family: "Bebas Neue", sans-serif;
          font-size: calc(34 * var(--scale-x));
          color: #ffffff;
          letter-spacing: 1px;
        }

        .item-price {
          font-family: "Open Sans", sans-serif;
          font-size: calc(20 * var(--scale-x));
          font-weight: 700;
          color: #f5a623;
          background-color: rgba(0, 0, 0, 0.3);
          padding: calc(4 * var(--scale-y)) calc(12 * var(--scale-x));
          border-radius: calc(10 * var(--scale-x));
        }

        .item-desc {
          font-family: "Open Sans", sans-serif;
          font-size: calc(14 * var(--scale-x));
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.4;
        }

        /* Sadece dashboard düzenleme ekranı için (preview modu) daha küçük tipografi ve biraz daha sıkışık grid */
        .burger-menu.burger-menu--preview .menu-grid {
          gap: calc(20 * var(--scale-y)) calc(16 * var(--scale-x));
        }

        .burger-menu.burger-menu--preview .item-image {
          height: calc(170 * var(--scale-y));
        }

        .burger-menu.burger-menu--preview .item-name {
          font-size: calc(26 * var(--scale-x));
        }

        .burger-menu.burger-menu--preview .item-price {
          font-size: calc(16 * var(--scale-x));
          padding: calc(3 * var(--scale-y)) calc(10 * var(--scale-x));
        }

        .burger-menu.burger-menu--preview .item-desc {
          font-size: calc(12 * var(--scale-x));
          line-height: 1.3;
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
          padding: calc(4 * var(--scale-y)) calc(8 * var(--scale-x));
          border-radius: calc(4 * var(--scale-x));
          border: 1px solid rgba(255, 255, 255, 0.3);
          background-color: rgba(255, 255, 255, 0.9);
          color: #000;
          font-size: calc(12 * var(--scale-x));
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
          padding: calc(2 * var(--scale-y)) calc(8 * var(--scale-x));
          border-radius: calc(4 * var(--scale-x));
          border: 1px solid #f5a623;
          background-color: transparent;
          color: #f5a623;
          font-size: calc(10 * var(--scale-x));
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
          gap: calc(8 * var(--scale-x));
          margin-bottom: calc(4 * var(--scale-y));
        }

        .template-4-category-name {
          font-family: "Bebas Neue", sans-serif;
          font-size: calc(14 * var(--scale-x));
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
        }

        .template-4-select-full {
          width: 100%;
          margin-bottom: calc(4 * var(--scale-y));
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
          gap: calc(6 * var(--scale-x));
        }

        .template-4-price-select {
          padding: calc(2 * var(--scale-y)) calc(4 * var(--scale-x));
          border-radius: calc(4 * var(--scale-x));
          border: 1px solid rgba(255, 255, 255, 0.3);
          background-color: rgba(0, 0, 0, 0.4);
          color: #f5a623;
          font-size: calc(10 * var(--scale-x));
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


