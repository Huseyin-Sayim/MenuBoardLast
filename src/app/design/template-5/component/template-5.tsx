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

interface Template5Props {
  burgerItems?: BurgerItem[];
  prices?: Record<string, string>;
  onPriceClick?: (index: string, name: string, price:string) => void;
  isEditable?: boolean;
  selectedCategory?: string;
  onCategoryChange?: (value: ((prevState: string) => string) | string) => void;
  availableProducts?: Array<{_id:string; name:string, pricing: any}>
  availableCategories?: Array<{_id: string; name: string}>;
  onProductSelect?: (gridIndex: number, productId: string) => void;
  onPriceTypeSelect?: (gridIndex: number, priceType: string) => void;
  selectedProducts?: Array<{name: string; price: string; productId?: string; priceType?: string}>;
  onImageClick?: (gridIndex: number) => void;
}

export default function Template5Content({
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
}: Template5Props) {
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

  // Debug
  console.log('Template5 - availableCategories:', availableCategories);
  console.log('Template5 - availableProducts:', availableProducts);
  console.log('Template5 - uniqueCategories:', uniqueCategories);
  console.log('Template5 - fixedBurgerItems:', fixedBurgerItems);

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
      <div className="fire-menu-container">
        <div className="bg-fire">
          <img
            src="https://static.vecteezy.com/system/resources/previews/027/179/070/non_2x/realistic-colored-flame-fire-concept-vector.jpg"
            alt="Fire"
          />
          <div className="dark-mask"></div>
        </div>

        {/* Üst kısım: Sol yazı, Sağ fotoğraf */}
        <div className="header-section">
          <div className="header-left">
            <div className="badge-new">ÖZEL SEÇİM</div>
            <h1 className="title-large">
              {heroTitle &&
                heroTitle.split(" ").map((word: string, index: number) => (
                  <span key={`${word}-${index}`}>
                    {` ${word}`}
                  </span>
                ))}
            </h1>
          </div>
          <div className="header-right">
            <img src={heroIMG} className="hero-burger" alt="Hero Burger" />
          </div>
        </div>

        {/* Alt kısım: Ürünler */}
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
                  padding: "10px 20px",
                  fontSize: "1.2rem",
                  borderRadius: "20px",
                  border: "2px solid #ffcc00",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "#ffcc00",
                  fontFamily: "Impact, Arial Black, sans-serif",
                  fontWeight: "bold",
                  cursor: "pointer",
                  outline: "none",
                  minWidth: "200px",
                }}
              >
                <option
                  value=""
                  style={{ backgroundColor: "#000", color: "#ffcc00" }}
                >
                  Tüm Kategoriler
                </option>
                {uniqueCategories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    style={{ backgroundColor: "#000", color: "#ffcc00" }}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid-layout">
            {filteredBurgers.slice(0, 4).map((burger,index) => (
              <div key={`burger-${index}-${burger.name || index}`} className="menu-item-card">
                <div 
                  className="thumb-box"
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
                  <img src={burger.img} alt={burger.name} />
                  {isEditable && onImageClick && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        color: 'white',
                        pointerEvents: 'none'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      Değiştir
                    </div>
                  )}
                </div>
                <div className="item-txt">
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
                        padding: "8px",
                        fontSize: "1.5vw",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "#ffcc00",
                        border: "2px solid #ffcc00",
                        borderRadius: "8px",
                        fontFamily: "Impact, Arial Black, sans-serif",
                        fontWeight: "bold",
                        marginBottom: "5px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        boxSizing: "border-box",
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
                    <h3>{burger.name || "Ürün Seçin"}</h3>
                  )}
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
                          className="price-pill"
                          style={{
                            cursor: "pointer",
                            border: "none",
                            background: "#ffcc00",
                            color: "#000",
                            padding: "2px 14px",
                            borderRadius: "20px",
                            fontWeight: "900",
                            fontSize: "1.5rem",
                            marginTop: "5px",
                            width: "100%",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            boxSizing: "border-box",
                          }}
                        >
                          {Object.entries(apiProduct.pricing)
                            .filter(([key, value]: [string, any]) => {
                              // Sadece belirli fiyat tiplerini göster (whitelist)
                              const allowedPriceTypes = [
                                'packageSalePrice',
                                'thirdFastSalePrice',
                                'secondFastSalePrice',
                                'fastSalePrice',
                                'basePrice',
                                'purchasePrice'
                              ];
                              
                              // Whitelist'te var mı ve price > 0 mı kontrol et
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
                        className="price-pill"
                        style={{
                          color: "white",
                          cursor: "text",
                          border: "1px solid white",
                          background: "inherit",
                          font: "inherit",
                          padding: "2px 14px",
                          outline: "none",
                          width: "auto",
                          minWidth: "60px",
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
                        className="price-pill"
                      >
                        {prices?.[burger.name] || `₺${burger.price}`}
                      </button>
                    )
                  ) : (
                    <span className="price-pill">
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
          background: #000;
        }

        .fire-menu-container {
          position: relative;
          display: flex;
          flex-direction: column;
          font-family: 'Impact', 'Arial Black', sans-serif;
          color: white;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .bg-fire {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .bg-fire img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dark-mask {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(227, 24, 24, 0.4) 0%, rgba(0, 0, 0, 0.9) 80%);
          mix-blend-mode: multiply;
          z-index: 0;
        }

        .header-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2vh;
          padding: 4vh;
          position: relative;
          z-index: 1;
          min-height: 40vh;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2vh;
        }

        .header-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2vh;
        }

        .badge-new {
          background: #fff;
          color: #000;
          padding: 4px 18px;
          width: fit-content;
          font-weight: 900;
          font-size: 3vw;
          transform: rotate(-3deg);
          box-shadow: 4px 4px 0 #e31818;
          margin-bottom: 2vh;
        }

        .title-large {
          font-size: 9vw;
          line-height: 0.9;
          margin: 0;
          text-shadow: 4px 4px 0px #000;
        }

        .title-large span { color: #ffcc00; }

        .hero-burger {
          width: 100%;
          max-width: 40vw;
          height: auto;
          max-height: 35vh;
          object-fit: cover;
          border-radius: 15px;
          object-position: center;
          display: block;
        }

        .products-section {
          flex: 1;
          padding: 3vh 4vh;
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

        .grid-layout {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: repeat(2, 1fr);
          gap: 2vh;
          flex: 1;
        }

        .menu-item-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(0,0,0,0.4);
          padding: 12px;
          backdrop-filter: blur(5px);
          min-width: 0;
          overflow: hidden;
        }

        .grid-layout .menu-item-card:nth-child(odd) {
          border-left: 5px solid #ffcc00;
          border-radius: 60px 10px 10px 60px;
        }

        .grid-layout .menu-item-card:nth-child(even) {
          border-right: 5px solid #ffcc00;
          border-radius: 10px 60px 60px 10px;
        }

        .thumb-box {
          width: clamp(75px, 15vh, 150px);
          height: clamp(75px, 15vh, 150px);
          aspect-ratio: 1;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #fff;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thumb-box img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          display: block;
        }

        .item-txt {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }

        .item-txt h3 {
          font-size: 5vw;
          margin: 0 0 5px 0;
          letter-spacing: -0.5px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        .price-pill {
          background: #ffcc00;
          color: #000;
          padding: 2px 14px;
          border-radius: 20px;
          font-weight: 900;
          font-size: 3rem;
        }

        .slogan-footer {
          background: #fff;
          color: #e31818;
          padding: 2vh;
          text-align: center;
          border-radius: 12px;
          font-size: 1.6vw;
          font-weight: 900;
          text-transform: uppercase;
          z-index: 1;
        }
      `}</style>
    </>
  );
}

