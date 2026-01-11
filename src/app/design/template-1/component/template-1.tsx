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

interface Template1Props {
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

export default function Template1Content({
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
}: Template1Props) {
  const [editingItemId, setEditingItemId] = useState<string | number | null>(
    null,
  );
  const [editingValue, setEditingValue] = useState<string>("");


  const fixedBurgerItems: BurgerItem[] = Array.from({ length: 6 }, (_, gridIndex) => {
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
  console.log('Template1 - availableCategories:', availableCategories);
  console.log('Template1 - availableProducts:', availableProducts);
  console.log('Template1 - uniqueCategories:', uniqueCategories);
  console.log('Template1 - fixedBurgerItems:', fixedBurgerItems);

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

        <div className="pane-hero">
          <div className="badge-new">ÖZEL SEÇİM</div>
          <h1 className="title-large">
            {heroTitle &&
              heroTitle.split(" ").map((word: string, index: number) => (
                <span key={`${word}-${index}`}>
                  {word}
                  <br />
                </span>
              ))}
          </h1>
            <img src={heroIMG} className="hero-burger" alt="Hero Burger" />
        </div>

        <div className="pane-menu">
          {isEditable && uniqueCategories.length > 0 && (
            <div
              style={{

                textAlign: "center",
                zIndex: 10,
                position: "relative",
              }}
            >
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
            {filteredBurgers.map((burger,index) => (
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
          inset: 0;
          display: grid;
          grid-template-columns: 42% 58%;
          font-family: 'Impact', 'Arial Black', sans-serif;
          color: white;
          width: 100%;
          height: 100%;
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
        }

        .pane-hero {
          padding: 6vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position:relative;
          z-index:1;
        }

        .badge-new {
          background: #fff;
          color: #000;
          padding: 4px 18px;
          width: fit-content;
          font-weight: 900;
          transform: rotate(-3deg);
          box-shadow: 4px 4px 0 #e31818;
          margin-left: 3vh;
        }

        .title-large {
          font-size: 7vw;
          line-height: 0.8;
          margin: 0;
          margin-left: 5vh;
          text-shadow: 6px 6px 0px #000;
        }

        .title-large span { color: #ffcc00; }

        .main-burger-wrapper {
          border-radius: 20% !important;
          position: relative;
          display: flex;
          justify-content: center;
        }
        
        .hero-burger-container {
          width: 100%;
          height: 48vh;
          background-color: rgba(255, 255, 255, 0.05); /* Arka planı hafif belirgin yapabilirsin */
          border-radius: 50px; /* İstediğin yuvarlaklık */
          overflow: hidden;    /* İçindeki resmin taşan kısımlarını keser */
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: -5vh;   /* Senin eski kodundaki kaydırma */
        }

        .hero-burger {
          width: 60vh; 
          height: 45vh;
          object-fit: cover; 
          border-radius: 5% !important;
          object-position: center;
          display: block;
          margin: 0 auto;
        }

        .hours-label {
          font-size: 0.8rem;
          border: 1px solid rgba(255,255,255,0.4);
          padding: 10px;
          width: fit-content;
          background: rgba(0,0,0,0.5);
        }

        .pane-menu {
          width: 95%;
          padding: 6vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height:100vh;
          overflow-y: hidden;
        }

        .grid-layout {
          width: 100%;
          height: 95%;
          margin-top: 5vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: repeat(3, 1fr);
          gap: 5vh 2vw;
          margin-bottom: 3vh;
          overflow: hidden;
        }

        .menu-item-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(0,0,0,0.4);
          padding: 12px;
          border-radius: 60px 15px 15px 60px;
          backdrop-filter: blur(5px);
          border-left: 5px solid #ffcc00;
          min-width: 0;
          overflow: hidden;
        }

        .thumb-box {
          width: 16vh;
          height: 16vh;
          min-width: 16vh;
          min-height: 16vh;
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
          font-size: 2vw;
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
          font-size: 2rem;
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
