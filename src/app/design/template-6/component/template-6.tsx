"use client";

import "../../styles/mamaspizza.css";
import Image from "next/image";

interface MenuItem {
  title?: string;
  desc?: string;
  price?: string;
  image?: string;
  isNew?: boolean;
  isRed?: boolean;
  hasTopPrice?: boolean;
  fullImage?: boolean;
  isLargeTitle?: boolean;
  categoryId?: string;
  productId?: string;
}

interface Template6Props {
  brandName?: string;
  menuItems?: MenuItem[];
  isEditable?: boolean;
  // Edit mode props
  availableCategories?: Array<{ _id: string; name: string }>;
  availableProductsBySlot?: Record<number, Array<{ _id: string; name: string; pricing: any; category: string; image?: string; img?: string; imageUrl?: string; options?: Array<{key: string; name: string; price: number}> }>>;
  onBrandNameChange?: (brandName: string) => void;
  onMenuItemCategoryChange?: (slotIndex: number, categoryId: string) => void;
  onMenuItemProductSelect?: (slotIndex: number, productId: string) => void;
  onMenuItemPriceTypeSelect?: (slotIndex: number, priceType: string) => void;
  onMenuItemImageClick?: (slotIndex: number) => void;
}

export default function Template6Content({
  brandName = "mamaspizza",
  menuItems = [],
  isEditable = false,
  availableCategories = [],
  availableProductsBySlot = {},
  onBrandNameChange,
  onMenuItemCategoryChange,
  onMenuItemProductSelect,
  onMenuItemPriceTypeSelect,
  onMenuItemImageClick,
}: Template6Props) {
  // Ensure we have 9 items (3x3 grid)
  const displayItems: MenuItem[] = Array.from({ length: 9 }, (_, i) => 
    menuItems[i] || { title: "", desc: "", price: "", image: "/images/pizza1.svg" }
  );

  return (
    <div className="mamas-pizza-container">
      <div className="mamas-main-grid">
        {/* --- LEFT SECTION --- */}
        <div className="mamas-left">
          <div className="mamas-logo-area">
            {isEditable ? (
              <input
                type="text"
                value={brandName}
                onChange={(e) => onBrandNameChange?.(e.target.value)}
                className="mamas-logo-text"
                style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '1vh 1vw', fontSize: '1.2vw' }}
                placeholder="Brand Name"
              />
            ) : (
              <div className="mamas-logo-text">{brandName}</div>
            )}
          </div>

          <div className="lets-eat-promo">
            <span className="text-lets">Let's</span>
            <span className="text-eat">• Eat</span>
            <div style={{ margin: '1vw 0' }}>
              <span className="text-authentic">Authentic</span>
              <span className="text-italian">Italian</span>
            </div>
            <span className="text-pizza-big">PIZZA</span>
          </div>

          <div className="best-ingredients-list">
            <span className="best-item">BEST INGREDIENTS</span>
            <span className="best-item best-delicious">• Delicious</span>
            <span className="best-item best-fresh">Fresh</span>
            <span className="best-item best-tasty">TASTY</span>
          </div>
        </div>

        {/* --- RIGHT SECTION - GRID --- */}
        <div className="mamas-right">
          {displayItems.map((item, idx) => (
            <div key={idx} className={`menu-card ${item.isRed ? 'card-red' : ''}`}>
              {item.hasTopPrice && item.price && (
                <span className="price-tag-bubble">{item.price}</span>
              )}

              <div className="card-content" style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
                {isEditable ? (
                  <div style={{ position: 'relative', zIndex: 20, pointerEvents: 'auto' }}>
                    {/* Category Select */}
                    <select
                      value={item.categoryId || ""}
                      onChange={(e) => onMenuItemCategoryChange?.(idx, e.target.value)}
                      className="mb-1 text-xs template-6-select"
                      style={{ 
                        background: '#1b0a2e', 
                        color: '#ffffff', 
                        border: '1px solid rgba(255,255,255,0.5)',
                        padding: '0.2vh 0.3vw',
                        borderRadius: '0.2vw',
                        fontSize: '0.7vw',
                        width: '100%',
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: 20,
                        pointerEvents: 'auto'
                      }}
                    >
                      <option value="" style={{ background: '#1b0a2e', color: '#ffffff' }}>Kategori Seç</option>
                      {availableCategories.map(cat => (
                        <option key={cat._id} value={cat._id} style={{ background: '#1b0a2e', color: '#ffffff' }}>{cat.name}</option>
                      ))}
                    </select>
                    {/* Product Select */}
                    {item.categoryId && availableProductsBySlot[idx] && (
                      <select
                        value={item.productId || ""}
                        onChange={(e) => onMenuItemProductSelect?.(idx, e.target.value)}
                        className="mb-1 text-xs template-6-select"
                        style={{ 
                          background: '#1b0a2e', 
                          color: '#ffffff', 
                          border: '1px solid rgba(255,255,255,0.5)',
                          padding: '0.2vh 0.3vw',
                          borderRadius: '0.2vw',
                          fontSize: '0.7vw',
                          width: '100%',
                          cursor: 'pointer',
                          position: 'relative',
                          zIndex: 10
                        }}
                      >
                        <option value="" style={{ background: '#1b0a2e', color: '#ffffff' }}>Ürün Seç</option>
                        {availableProductsBySlot[idx].map(product => (
                          <option key={product._id} value={product._id} style={{ background: '#1b0a2e', color: '#ffffff' }}>{product.name}</option>
                        ))}
                      </select>
                    )}
                    {/* Price Type Select - Sadece options varsa göster */}
                    {item.productId && (() => {
                      const selectedProduct = availableProductsBySlot[idx]?.find(p => p._id === item.productId);
                      const hasOptions = selectedProduct?.options && selectedProduct.options.length > 0;
                      
                      if (hasOptions) {
                        return (
                          <select
                            onChange={(e) => onMenuItemPriceTypeSelect?.(idx, e.target.value)}
                            className="mb-1 text-xs template-6-select"
                            style={{ 
                              background: '#1b0a2e', 
                              color: '#ffffff', 
                              border: '1px solid rgba(255,255,255,0.5)',
                              padding: '0.2vh 0.3vw',
                              borderRadius: '0.2vw',
                              fontSize: '0.7vw',
                              width: '100%',
                              cursor: 'pointer',
                              position: 'relative',
                              zIndex: 10
                            }}
                          >
                            <option value="" style={{ background: '#1b0a2e', color: '#ffffff' }}>Fiyat Tipi Seç</option>
                            {Object.keys(selectedProduct?.pricing || {}).map(priceType => (
                              <option key={priceType} value={priceType} style={{ background: '#1b0a2e', color: '#ffffff' }}>{priceType}</option>
                            ))}
                          </select>
                        );
                      }
                      return null;
                    })()}
                  </div>
                ) : null}
                
                <h3 
                  className="card-title" 
                  style={item.isLargeTitle ? { fontSize: '2.2vw' } : {}}
                >
                  {item.title || "Pizza"}
                </h3>
                {item.desc && <p className="card-desc">{item.desc}</p>}
                {item.isRed && item.price && (
                  <span style={{ fontSize: '2vw', fontWeight: 900 }}>{item.price}</span>
                )}
              </div>

              {!item.isRed && !item.hasTopPrice && item.price && (
                <span className="card-price-red">{item.price}</span>
              )}

              <div 
                className="card-img-area"
                onClick={() => isEditable && onMenuItemImageClick?.(idx)}
                style={isEditable ? { cursor: 'pointer' } : {}}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title || "Pizza"}
                    width={item.fullImage ? 224 : 192}
                    height={item.fullImage ? 176 : 176}
                    className={item.fullImage ? "card-full-img" : "card-item-img"}
                    unoptimized
                  />
                ) : (
                  <div className="card-img-placeholder"></div>
                )}
                {isEditable && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-white text-xs">Resim Değiştir</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

