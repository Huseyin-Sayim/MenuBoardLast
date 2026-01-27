"use client";

import "../../styles/gyrogreek.css";
import Image from "next/image";

interface Brand {
  shortName?: string;
  fullName?: string;
  phone?: string;
  logoImg?: string;
}

interface HeroPromo {
  title?: string;
  value?: string;
  label?: string;
}

interface Hero {
  logo?: string;
  titleTop?: string;
  titleBottom?: string;
  image?: string;
  promo?: HeroPromo;
}

interface SidebarItem {
  title?: string;
  desc?: string;
  price?: string;
  categoryId?: string;
  productId?: string;
}

interface GridItem {
  title?: string;
  desc?: string;
  price?: string;
  variant?: string;
  image?: string;
  categoryId?: string;
  productId?: string;
}

interface Template7Props {
  brand?: Brand;
  hero?: Hero;
  sidebarItems?: SidebarItem[];
  gridItems?: GridItem[];
  isEditable?: boolean;
  // Edit mode props
  availableCategories?: Array<{ _id: string; name: string }>;
  availableProductsBySlot?: Record<string, Array<{ _id: string; name: string; pricing: any; category: string; image?: string; img?: string; imageUrl?: string; options?: Array<{ key: string; name: string; price: number }> }>>;
  onHeroImageClick?: () => void;
  onSidebarItemCategoryChange?: (index: number, categoryId: string) => void;
  onSidebarItemProductSelect?: (index: number, productId: string) => void;
  onSidebarItemImageClick?: (index: number) => void;
  onSidebarItemOptionSelect?: (index: number, optionKey: string) => void;
  onGridItemCategoryChange?: (index: number, categoryId: string) => void;
  onGridItemProductSelect?: (index: number, productId: string) => void;
  onGridItemImageClick?: (index: number) => void;
  onGridItemOptionSelect?: (index: number, optionKey: string) => void;
}

export default function Template7Content({
  brand = { shortName: "LA", fullName: "gyrogreek", phone: "(818)356-9676", logoImg: "" },
  hero = { logo: "/images/burger_logo.svg", titleTop: "GYRO", titleBottom: "FOOD", image: "/images/teavuk_dürüm.svg", promo: { title: "Only Today", value: "20%", label: "OFF" } },
  sidebarItems = [],
  gridItems = [],
  isEditable = false,
  availableCategories = [],
  availableProductsBySlot = {},
  onHeroImageClick,
  onSidebarItemCategoryChange,
  onSidebarItemProductSelect,
  onSidebarItemImageClick,
  onSidebarItemOptionSelect,
  onGridItemCategoryChange,
  onGridItemProductSelect,
  onGridItemImageClick,
  onGridItemOptionSelect,
}: Template7Props) {
  // Ensure we have at least 1 sidebar item and 6 grid items
  const displaySidebarItems: SidebarItem[] = sidebarItems.length > 0 ? sidebarItems : [{ title: "", desc: "", price: "" }];
  const displayGridItems: GridItem[] = Array.from({ length: 6 }, (_, i) =>
    gridItems[i] || { title: "", desc: "", price: "", variant: "white", image: "/images/teavuk_dürüm.svg" }
  );

  return (
    <div className="gyro-greek-menu">
      {/* Left Sidebar */}
      <aside className="gg-sidebar">
        <div className="gg-hero-text">
          {hero.logo ? (
            <Image
              src={hero.logo}
              alt="Brand Logo"
              className="gg-hero-logo"
              width={400}
              height={180}
              unoptimized
            />
          ) : (
            <>
              <div className="gg-hero-gyro">{hero.titleTop || "GYRO"}</div>
              <div className="gg-hero-food">{hero.titleBottom || "FOOD"}</div>
            </>
          )}
        </div>

        <div className="gg-hero-image-area">
          <div
            onClick={() => isEditable && onHeroImageClick?.()}
            style={isEditable ? { cursor: 'pointer', position: 'relative', zIndex: 10 } : {}}
          >
            {hero.image ? (
              <Image
                src={hero.image}
                alt="Hero"
                className="gg-hero-img"
                width={400}
                height={450}
                unoptimized
              />
            ) : null}
            {isEditable && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="text-white text-xs">Resim Değiştir</span>
              </div>
            )}
          </div>
          {hero.promo && (
            <div className="gg-promo-circle">
              <div style={{ fontSize: 'calc(14 * var(--scale-x))' }}>{hero.promo.title}</div>
              <div style={{ fontSize: 'calc(44 * var(--scale-x))', fontWeight: 900 }}>{hero.promo.value}</div>
              <div style={{ fontSize: 'calc(24 * var(--scale-x))', fontWeight: 700 }}>{hero.promo.label}</div>
            </div>
          )}
        </div>

        <div className="gg-sidebar-footer">
          {displaySidebarItems.map((item, index) => (
            <div key={index} className="gg-footer-item">
              {isEditable ? (
                <>
                  <select
                    value={item.categoryId || ""}
                    onChange={(e) => onSidebarItemCategoryChange?.(index, e.target.value)}
                    className="mb-1 text-xs"
                    style={{
                      background: '#004d3d',
                      color: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.2)',
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
                    <option value="" style={{ background: '#004d3d', color: '#ffffff' }}>Kategori Seç</option>
                    {availableCategories.map(cat => (
                      <option key={cat._id} value={cat._id} style={{ background: '#004d3d', color: '#ffffff' }}>{cat.name}</option>
                    ))}
                  </select>
                  {item.categoryId && availableProductsBySlot[`sidebar-${index}`] && (
                    <select
                      value={item.productId || ""}
                      onChange={(e) => onSidebarItemProductSelect?.(index, e.target.value)}
                      className="mb-1 text-xs"
                      style={{
                        background: '#004d3d',
                        color: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.2)',
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
                      <option value="" style={{ background: '#004d3d', color: '#ffffff' }}>Ürün Seç</option>
                      {availableProductsBySlot[`sidebar-${index}`].map(product => (
                        <option key={product._id} value={product._id} style={{ background: '#004d3d', color: '#ffffff' }}>{product.name}</option>
                      ))}
                    </select>
                  )}
                  {item.productId && availableProductsBySlot[`sidebar-${index}`]?.find(p => p._id === item.productId)?.options?.length ? (
                    <select
                      onChange={(e) => onSidebarItemOptionSelect?.(index, e.target.value)}
                      className="mb-1 text-xs"
                      style={{
                        background: '#004d3d',
                        color: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.2)',
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
                      <option value="" style={{ background: '#004d3d', color: '#ffffff' }}>Seçenek Seç</option>
                      {availableProductsBySlot[`sidebar-${index}`]?.find(p => p._id === item.productId)?.options?.map(opt => (
                        <option key={opt.key} value={opt.key} style={{ background: '#004d3d', color: '#ffffff' }}>
                          {opt.name} - {opt.price}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </>
              ) : null}
              <h3 className="gg-footer-title">{item.title || "Item"}</h3>
              <p className="gg-footer-desc">{item.desc || ""}</p>
              <div className="gg-footer-price">{item.price || ""}</div>
            </div>
          ))}
          <div className="gg-phone" style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '20px' }}>
            {brand.phone || ""}
          </div>
        </div>
      </aside >

      {/* Main Content */}
      < main className="gg-main-content" >
        <div className="gg-grid">
          {displayGridItems.map((item, index) => {
            // Variant'ı CSS class'ına uygun hale getir
            let variantClass = item.variant || "white";
            if (variantClass === "white blob") {
              variantClass = "white-blob";
            }
            return (
              <div key={index} className={`gg-card ${variantClass}`}>
                {isEditable ? (
                  <>
                    <select
                      value={item.categoryId || ""}
                      onChange={(e) => onGridItemCategoryChange?.(index, e.target.value)}
                      className="mb-1 text-xs"
                      style={{
                        background: '#004d3d',
                        color: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.2)',
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
                      <option value="" style={{ background: '#004d3d', color: '#ffffff' }}>Kategori Seç</option>
                      {availableCategories.map(cat => (
                        <option key={cat._id} value={cat._id} style={{ background: '#004d3d', color: '#ffffff' }}>{cat.name}</option>
                      ))}
                    </select>
                    {item.categoryId && availableProductsBySlot[`grid-${index}`] && (
                      <select
                        value={item.productId || ""}
                        onChange={(e) => onGridItemProductSelect?.(index, e.target.value)}
                        className="mb-1 text-xs"
                        style={{
                          background: '#004d3d',
                          color: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.2)',
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
                        <option value="" style={{ background: '#004d3d', color: '#ffffff' }}>Ürün Seç</option>
                        {availableProductsBySlot[`grid-${index}`].map(product => (
                          <option key={product._id} value={product._id} style={{ background: '#004d3d', color: '#ffffff' }}>{product.name}</option>
                        ))}
                      </select>
                    )}
                    {item.productId && availableProductsBySlot[`grid-${index}`]?.find(p => p._id === item.productId)?.options?.length ? (
                      <select
                        onChange={(e) => onGridItemOptionSelect?.(index, e.target.value)}
                        className="mb-1 text-xs"
                        style={{
                          background: '#004d3d',
                          color: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.2)',
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
                        <option value="" style={{ background: '#004d3d', color: '#ffffff' }}>Seçenek Seç</option>
                        {availableProductsBySlot[`grid-${index}`]?.find(p => p._id === item.productId)?.options?.map(opt => (
                          <option key={opt.key} value={opt.key} style={{ background: '#004d3d', color: '#ffffff' }}>
                            {opt.name} - {opt.price}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </>
                ) : null}
                <h2 className="gg-card-title">{item.title || "Item"}</h2>
                <p className="gg-card-desc">{item.desc || ""}</p>
                <div className="gg-card-price">{item.price || ""}</div>
                <div
                  onClick={() => isEditable && onGridItemImageClick?.(index)}
                  className="gg-card-img"
                  style={{
                    zIndex: isEditable ? 10 : 3,
                    cursor: isEditable ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title || "Item"}
                      fill
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  ) : null}
                  {isEditable && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                      <span className="text-white text-xs">Resim Değiştir</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div >
      </main >
    </div >
  );
}

