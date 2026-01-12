"use client";

import { useState } from "react";

interface BurgerItem {
  name: string;
  price: string;
  img: string;
  heroIMG?: string;
  heroTitle?: string;
  category?: string;
}

interface Template6Props {
  burgerItems?: BurgerItem[];
  prices?: Record<string, string>;
  onPriceClick?: (index: string, name: string, price:string) => void;
  isEditable?: boolean;
  selectedCategory?: string;
  onCategoryChange?: (value: ((prevState: string) => string) | string) => void;
  availableProducts?: Array<{_id:string; name:string, pricing: any; image?: string; img?: string; imageUrl?: string}>
  availableCategories?: Array<{_id: string; name: string}>;
  onProductSelect?: (gridIndex: number, productId: string) => void;
  onPriceTypeSelect?: (gridIndex: number, priceType: string) => void;
  selectedProducts?: Array<{name: string; price: string; productId?: string; priceType?: string; image?: string}>;
  onImageClick?: (gridIndex: number) => void;
}

export default function Template6Content({
  burgerItems,
  prices,
  onPriceClick,
  isEditable = false,
  availableProducts,
  availableCategories,
  onProductSelect,
  onPriceTypeSelect,
  selectedProducts,
  selectedCategory,
  onCategoryChange,
  onImageClick,
}: Template6Props) {
  const [editingItemId, setEditingItemId] = useState<string | number | null>(
    null,
  );
  const [editingValue, setEditingValue] = useState<string>("");


  // Max 4 ürün
  const fixedBurgerItems: BurgerItem[] = Array.from({ length: 4 }, (_, gridIndex) => {
    if (burgerItems && burgerItems[gridIndex] && burgerItems[gridIndex]?.name) {
      return burgerItems[gridIndex];
    }
    return {
      id: gridIndex + 1,
      name: '',
      price: '0',
      img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
      category: ''
    };
  });

  const uniqueCategories = availableCategories && availableCategories.length > 0
    ? availableCategories.map(cat => ({ id: cat._id, name: cat.name }))
    : Array.from(new Set(fixedBurgerItems.map((item) => item.category).filter((cat): cat is string => cat !== undefined && cat !== null))).map(cat => ({ id: cat, name: cat }));

  const filteredBurgers = fixedBurgerItems;

  const heroItem = filteredBurgers[0];

  if (!heroItem) {
    return (
      <div style={{ color: "white", padding: "50px", textAlign: "center" }}>
        Menü Yükleniyor...
      </div>
    );
  }

  const heroIMG = heroItem.heroIMG || heroItem.img;
  const heroTitle = heroItem.heroTitle || heroItem.name || "Menü";


  return (
    <>
      <div className="minimal-menu-container">
        <div className="background-layer"></div>

        {/* Üst Hero Bölümü - Tam Genişlik */}
        <div className="hero-section">
          <div className="hero-image-container">
            <img src={heroIMG} className="hero-image" alt="Hero" />
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <div className="badge-minimal">ÖZEL SEÇİM</div>
            <h1 className="title-minimal">
              {heroTitle &&
                heroTitle.split(" ").map((word: string, index: number) => (
                  <span key={`${word}-${index}`}>
                    {word}
                  </span>
                ))}
            </h1>
          </div>
        </div>

        {/* Alt Ürünler Bölümü */}
        <div className="products-section">
          {isEditable && uniqueCategories.length > 0 && (
            <div className="category-selector">
              <select
                value={selectedCategory || ""}
                onChange={(e) => {
                  if (onCategoryChange) {
                    onCategoryChange(e.target.value);
                  }
                }}
                style={{
                  padding: "12px 24px",
                  fontSize: "1.1rem",
                  borderRadius: "30px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  color: "#fff",
                  fontFamily: "'Poppins', 'Arial', sans-serif",
                  fontWeight: "500",
                  cursor: "pointer",
                  outline: "none",
                  minWidth: "200px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <option
                  value=""
                  style={{ backgroundColor: "#1a1a1a", color: "#fff" }}
                >
                  Tüm Kategoriler
                </option>
                {uniqueCategories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    style={{ backgroundColor: "#1a1a1a", color: "#fff" }}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="products-list">
            {filteredBurgers.slice(0, 4).map((burger,index) => (
              <div key={`burger-${index}-${burger.name || index}`} className="product-card-horizontal">
                <div 
                  className="product-image-wrapper"
                  onClick={() => {
                    if (isEditable && onImageClick) {
                      onImageClick(index);
                    }
                  }}
                  style={{
                    cursor: isEditable && onImageClick ? 'pointer' : 'default',
                    position: 'relative'
                  }}
                >
                  <img src={burger.img} alt={burger.name} className="product-image" />
                  {isEditable && onImageClick && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        color: 'white',
                        pointerEvents: 'none'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      Değiştir
                    </div>
                  )}
                </div>
                <div className="product-name-section">
                  {isEditable && availableProducts && availableProducts.length > 0 ? (
                    <select
                      value={burger.name || ""}
                      onChange={(e) => {
                        const selectedProduct = availableProducts.find(p => p && p.name && p.name === e.target.value);
                        if (selectedProduct && selectedProduct._id && onProductSelect) {
                          onProductSelect(index, selectedProduct._id);
                        }
                      }}
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        padding: "8px 12px",
                        fontSize: "2.2vw",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        border: "2px solid rgba(255,255,255,0.2)",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', 'Arial', sans-serif",
                        fontWeight: "600",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        boxSizing: "border-box",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <option value="">Ürün Seçin</option>
                      {availableProducts.map(product => (
                        <option key={product._id} value={product.name}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <h3 className="product-name">{burger.name || "Ürün Seçin"}</h3>
                  )}
                </div>
                <div className="product-price-section">
                  {isEditable && onPriceTypeSelect && availableProducts && burger.name && burger.name.trim() !== '' ? (
                    (() => {
                      const currentProduct = selectedProducts?.find(p => p && p.name && p.name === burger.name);
                      const apiProduct = availableProducts.find(p => p && p.name && p.name === burger.name);
                      const currentPriceType = currentProduct?.priceType || 'basePrice';
                      
                      if (!apiProduct || !apiProduct.pricing) return null;
                      
                      return (
                        <select
                          value={currentPriceType}
                          onChange={(e) => {
                            onPriceTypeSelect(index, e.target.value);
                          }}
                          className="price-tag"
                          style={{
                            cursor: "pointer",
                            border: "none",
                            background: "rgba(255,255,255,0.95)",
                            color: "#000",
                            padding: "8px 20px",
                            borderRadius: "25px",
                            fontWeight: "700",
                            fontSize: "2rem",
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            boxSizing: "border-box",
                          }}
                        >
                          {Object.entries(apiProduct.pricing)
                            .filter(([key, value]: [string, any]) => {
                              const allowedPriceTypes = [
                                'packageSalePrice',
                                'thirdFastSalePrice',
                                'secondFastSalePrice',
                                'fastSalePrice',
                                'basePrice',
                                'purchasePrice'
                              ];
                              
                              return allowedPriceTypes.includes(key) && 
                                     value && 
                                     typeof value.price === "number" && 
                                     value.price > 0;
                            })
                            .map(([key, value]: [string, any]) => {
                              const currencyCode = value.currency || 'TRY';
                              const currencySymbol = currencyCode === 'TRY' ? '₺' : currencyCode;
                              const formattedPrice = new Intl.NumberFormat('tr-TR').format(value.price);
                              return (
                                <option key={key} value={key}>
                                  {currencySymbol} {formattedPrice}
                                </option>
                              );
                            })}
                        </select>
                      );
                    })()
                  ) : isEditable && onPriceClick ? (
                    editingItemId === burger.name ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => {
                          const newPrice = editingValue.trim()
                            ? `₺${editingValue.trim()}`
                            : prices?.[burger.name] || `₺${burger.price}`;
                          onPriceClick(String(index), burger.name, newPrice);
                          setEditingItemId(null);
                          setEditingValue("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const newPrice = editingValue.trim()
                              ? `₺${editingValue.trim()}`
                              : prices?.[burger.name] || `₺${burger.price}`;
                            onPriceClick(String(index),burger.name, newPrice);
                            setEditingItemId(null);
                            setEditingValue("");
                          } else if (e.key === "Escape") {
                            setEditingItemId(null);
                            setEditingValue("");
                          }
                        }}
                        autoFocus
                        className="price-tag"
                        style={{
                          color: "#000",
                          cursor: "text",
                          border: "2px solid rgba(255,255,255,0.5)",
                          background: "rgba(255,255,255,0.9)",
                          font: "inherit",
                          padding: "8px 20px",
                          outline: "none",
                          width: "auto",
                          minWidth: "100px",
                          borderRadius: "25px",
                          fontSize: "2rem",
                          fontWeight: "700",
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => {
                          const currentPrice =
                            prices?.[burger.name] || `₺${burger.price}`;
                          setEditingValue(currentPrice.replace("₺", ""));
                          setEditingItemId(burger.name);
                        }}
                        className="price-tag"
                      >
                        {prices?.[burger.name] || `₺${burger.price}`}
                      </button>
                    )
                  ) : (
                    <span className="price-tag">
                      {prices?.[burger.name] || `₺${burger.price}`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        :global(html, body) {
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
          background: #0a0a0a;
        }

        .minimal-menu-container {
          position: relative;
          display: flex;
          flex-direction: column;
          font-family: 'Poppins', 'Arial', sans-serif;
          color: white;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .background-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
        }

        /* Hero Bölümü - Tam Genişlik, Üstte */
        .hero-section {
          position: relative;
          width: 100%;
          height: 30vh;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .hero-image-container {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 4vh 5vw;
          text-align: center;
        }

        .badge-minimal {
          background: rgba(255,255,255,0.2);
          color: #fff;
          padding: 8px 24px;
          width: fit-content;
          margin: 0 auto 2vh;
          font-weight: 600;
          font-size: 0.9vw;
          border-radius: 50px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .title-minimal {
          font-size: 6.5vw;
          line-height: 1.1;
          margin: 0;
          font-weight: 300;
          color: #fff;
          letter-spacing: -1px;
        }

        .title-minimal span {
          display: inline-block;
          margin: 0 0.5vw;
        }

        /* Ürünler Bölümü - Alt Yarı */
        .products-section {
          flex: 1;
          padding: 4vh 5vw;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .category-selector {
          text-align: center;
          margin-bottom: 3vh;
          position: relative;
          z-index: 10;
        }

        /* Ürünler Liste - Alt Alta */
        .products-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2vh;
          flex: 1;
        }

        /* Ürün Kartları - Yatay Düzen (İnce Uzun) */
        .product-card-horizontal {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.05);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
          height: 14vh;
          min-height: 100px;
        }

        .product-image-wrapper {
          width: 15vh;
          min-width: 100px;
          height: 100%;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-name-section {
          flex: 1;
          padding: 0 3vw;
          display: flex;
          align-items: center;
          min-width: 0;
        }

        .product-name {
          font-size: 2.8vw;
          margin: 0;
          font-weight: 600;
          color: #fff;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-price-section {
          padding-right: 3vw;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .price-tag {
          background: rgba(255,255,255,0.95);
          color: #000;
          padding: 8px 20px;
          border-radius: 25px;
          font-weight: 700;
          font-size: 2rem;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}
