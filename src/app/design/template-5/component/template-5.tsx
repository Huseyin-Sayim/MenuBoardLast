"use client";

import "../../styles/drivethru.css";

interface PricingItem {
  label: string;
  price: string;
  cal?: string;
  priceType?: string;
  optionKey?: string;
}

interface MenuItemPrice {
  size: string;
  price: string;
  priceType?: string;
  comboImage?: string;
  optionKey?: string;
}

interface MenuItem {
  number: number;
  category?: string;
  categoryId?: string;
  name?: string;
  productId?: string;
  image?: string;
  prices: MenuItemPrice[];
  isNew?: boolean;
}

interface FeaturedProduct {
  logoImage?: string;
  productImage?: string;
  label?: string;
  title?: string;
  name?: string;
  categoryId?: string;
  productId?: string;
  pricing: PricingItem[];
}

interface Template5Props {
  featuredProduct?: FeaturedProduct;
  menuItems?: MenuItem[];
  isEditable?: boolean;
  // Edit mode props
  availableCategories?: Array<{ _id: string; name: string }>;
  availableProducts?: Array<{ _id: string; name: string; pricing: any; category: string; image?: string; img?: string; imageUrl?: string }>;
  availableProductsBySlot?: Record<number, Array<{ _id: string; name: string; pricing: any; category: string; image?: string; img?: string; imageUrl?: string }>>;
  onFeaturedCategoryChange?: (categoryId: string) => void;
  onFeaturedProductSelect?: (productId: string) => void;
  onFeaturedPriceTypeSelect?: (index: number, priceType: string) => void;
  onMenuItemCategoryChange?: (itemNumber: number, categoryId: string) => void;
  onMenuItemProductSelect?: (itemNumber: number, productId: string) => void;
  onMenuItemPriceTypeSelect?: (itemNumber: number, priceIndex: number, priceType: string) => void;
  onFeaturedImageClick?: () => void;
  onMenuItemImageClick?: (itemNumber: number) => void;
  galleryImages?: Array<{ id: string; name: string; url: string }>;
  isGalleryOpen?: boolean;
  selectedImageSlot?: number | null; // -1 = featured, 1-8 = menu items
  onGalleryClose?: () => void;
  onImageSelect?: (itemNumber: number | -1, imageUrl: string) => void;
}

export default function Template5Content({
  featuredProduct,
  menuItems = [],
  isEditable = false,
  availableCategories,
  availableProducts,
  availableProductsBySlot,
  onFeaturedCategoryChange,
  onFeaturedProductSelect,
  onFeaturedPriceTypeSelect,
  onMenuItemCategoryChange,
  onMenuItemProductSelect,
  onMenuItemPriceTypeSelect,
  onFeaturedImageClick,
  onMenuItemImageClick,
  galleryImages,
  isGalleryOpen,
  selectedImageSlot,
  onGalleryClose,
  onImageSelect,
}: Template5Props) {
  // Default featured product
  const defaultFeatured: FeaturedProduct = {
    logoImage: "/images/burger_logo.svg",
    productImage: "/images/burger+patato.png",
    label: "PREMIUM",
    title: "CHEESE",
    name: "WHOPPER",
    pricing: [
      { label: "Per 1", price: "$3.25", cal: "300" },
      { label: "Per 2", price: "$8.89", cal: "280" }
    ]
  };

  const featured = featuredProduct || defaultFeatured;

  // Default menu items (8 adet)
  const defaultMenuItems: MenuItem[] = Array.from({ length: 8 }, (_, i) => ({
    number: i + 1,
    category: "",
    name: "",
    image: "/images/burger_menu.svg",
    prices: [], // Options yoksa boş kalacak
    isNew: false
  }));

  const items = menuItems.length > 0 ? menuItems : defaultMenuItems;
  // En az 8 item olmalı
  const finalItems = [...items];
  while (finalItems.length < 8) {
    finalItems.push({
      number: finalItems.length + 1,
      category: "",
      name: "",
      image: "/images/burger_menu.svg",
      prices: [], // Options yoksa boş kalacak
      isNew: false
    });
  }

  return (
    <div className="drive-thru-menu">
      {/* Left Sidebar */}
      <div className="sidebar">
        {/* Logo Area */}
        <div className="logo-area">
          <img 
            src={featured.logoImage || "/images/burger_logo.svg"} 
            alt="Logo" 
            className="logo-img" 
          />
        </div>

        {/* Featured Product Image */}
        <div className="featured-image">
          {isEditable ? (
            <div 
              onClick={onFeaturedImageClick}
              style={{ cursor: 'pointer', position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img 
                src={featured.productImage || "/images/burger+patato.png"} 
                alt="Featured Product" 
                className="featured-img" 
              />
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                fontSize: '12px',
                pointerEvents: 'none'
              }}>
                Resim Değiştir
              </div>
            </div>
          ) : (
            <img 
              src={featured.productImage || "/images/burger+patato.png"} 
              alt="Featured Product" 
              className="featured-img" 
            />
          )}
        </div>

        {/* Featured Product Info */}
        <div className="featured-info">
          {isEditable && availableCategories ? (
            <div style={{ marginBottom: '10px' }}>
              <select
                value={featured.categoryId || ""}
                onChange={(e) => {
                  if (onFeaturedCategoryChange) {
                    onFeaturedCategoryChange(e.target.value);
                  }
                }}
                style={{
                  fontSize: '14px',
                  padding: '5px',
                  marginBottom: '10px',
                  width: '100%',
                  borderRadius: '5px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white'
                }}
              >
                <option value="">Kategori Seçin</option>
                {availableCategories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {featured.categoryId && (
                <select
                  value={featured.productId || ""}
                  onChange={(e) => {
                    if (onFeaturedProductSelect && e.target.value) {
                      onFeaturedProductSelect(e.target.value);
                    }
                  }}
                  style={{
                    fontSize: '14px',
                    padding: '5px',
                    width: '100%',
                    borderRadius: '5px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  <option value="">Ürün Seçin</option>
                  {availableProducts && availableProducts.length > 0 ? (
                    availableProducts.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Ürünler yükleniyor...</option>
                  )}
                </select>
              )}
            </div>
          ) : (
            <span className="featured-label">{featured.label || "PREMIUM"}</span>
          )}
          
          {!isEditable && <span className="featured-title">{featured.title || "CHEESE"}</span>}
          <h2 className="featured-name">{featured.name || "WHOPPER"}</h2>

          <div className="featured-divider"></div>

          <div className="pricing-table">
            {featured.pricing.map((item, index) => (
              <div className="pricing-row" key={index}>
                <span className="pricing-label">{item.label}</span>
                {isEditable && availableProducts && featured.productId ? (
                  <select
                    value={item.priceType || "basePrice"}
                    onChange={(e) => {
                      if (onFeaturedPriceTypeSelect) {
                        onFeaturedPriceTypeSelect(index, e.target.value);
                      }
                    }}
                    style={{ 
                      fontSize: '12px', 
                      padding: '2px 5px',
                      borderRadius: '3px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white'
                    }}
                  >
                    <option value="basePrice">Base Price</option>
                    <option value="small">Small</option>
                    <option value="large">Large</option>
                  </select>
                ) : null}
                <span className="pricing-price">{item.price}</span>
                {item.cal && (
                  <>
                    <span className="pricing-cal">Cal</span>
                    <span className="pricing-calvalue">{item.cal}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Menu Grid */}
      <div className="main-content">
        {/* Top Row */}
        <div className="menu-row">
          {finalItems.slice(0, 4).map((item) => (
            <MenuItemComponent
              key={item.number}
              item={item}
              isEditable={isEditable}
              availableCategories={availableCategories}
              availableProducts={availableProductsBySlot?.[item.number] || []}
              onCategoryChange={onMenuItemCategoryChange}
              onProductSelect={onMenuItemProductSelect}
              onPriceTypeSelect={onMenuItemPriceTypeSelect}
              onImageClick={onMenuItemImageClick}
            />
          ))}
        </div>

        {/* Divider Line */}
        <div className="row-divider"></div>

        {/* Bottom Row */}
        <div className="menu-row">
          {finalItems.slice(4, 8).map((item) => (
            <MenuItemComponent
              key={item.number}
              item={item}
              isEditable={isEditable}
              availableCategories={availableCategories}
              availableProducts={availableProductsBySlot?.[item.number] || []}
              onCategoryChange={onMenuItemCategoryChange}
              onProductSelect={onMenuItemProductSelect}
              onPriceTypeSelect={onMenuItemPriceTypeSelect}
              onImageClick={onMenuItemImageClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// MenuItem Component (ayrı component olarak)
function MenuItemComponent({
  item,
  isEditable,
  availableCategories,
  availableProducts,
  onCategoryChange,
  onProductSelect,
  onPriceTypeSelect,
  onImageClick,
}: {
  item: MenuItem;
  isEditable?: boolean;
  availableCategories?: Array<{ _id: string; name: string }>;
  availableProducts?: Array<{ _id: string; name: string; pricing: any; category: string; image?: string }>;
  onCategoryChange?: (itemNumber: number, categoryId: string) => void;
  onProductSelect?: (itemNumber: number, productId: string) => void;
  onPriceTypeSelect?: (itemNumber: number, priceIndex: number, priceType: string) => void;
  onImageClick?: (itemNumber: number) => void;
}) {
  // availableProducts zaten slot'a özel filtrelenmiş olarak geliyor
  const filteredProducts = availableProducts || [];

  return (
    <div className={`menu-item ${item.isNew ? 'new-item' : ''}`}>
      <div className="item-image-area">
        {isEditable ? (
          <div 
            onClick={() => onImageClick?.(item.number)}
            style={{ cursor: 'pointer', position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img 
              src={item.image || "/images/burger_menu.svg"} 
              alt={item.name} 
              className="item-image" 
            />
            <div style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '3px 8px',
              borderRadius: '3px',
              fontSize: '10px',
              pointerEvents: 'none'
            }}>
              Resim
            </div>
          </div>
        ) : (
          <img 
            src={item.image || "/images/burger_menu.svg"} 
            alt={item.name} 
            className="item-image" 
          />
        )}
        {item.prices.find(p => p.comboImage) && (
          <img
            src={item.prices.find(p => p.comboImage)?.comboImage}
            alt="Combo"
            className="combo-image"
          />
        )}
      </div>
      <div className="item-details">
        {item.isNew && <span className="new-badge">NEW</span>}
        <div className="item-title">
          <span className="item-number">{item.number}</span>
          <div className="item-names">
            {isEditable && availableCategories ? (
              <select
                value={item.categoryId || ""}
                onChange={(e) => {
                  if (onCategoryChange) {
                    onCategoryChange(item.number, e.target.value);
                  }
                }}
                style={{
                  fontSize: '12px',
                  padding: '2px',
                  marginBottom: '5px',
                  width: '100%',
                  borderRadius: '3px',
                  border: '1px solid #e63946'
                }}
              >
                <option value="">Kategori Seçin</option>
                {availableCategories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            ) : (
              <span className="item-category">{item.category || ""}</span>
            )}
            {isEditable && filteredProducts.length > 0 ? (
              <select
                value={item.productId || ""}
                onChange={(e) => {
                  if (onProductSelect && e.target.value) {
                    onProductSelect(item.number, e.target.value);
                  }
                }}
                style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  padding: '2px',
                  width: '100%',
                  borderRadius: '3px',
                  border: '1px solid #e63946'
                }}
              >
                <option value="">Ürün Seçin</option>
                {filteredProducts.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="item-name">{item.name || ""}</span>
            )}
          </div>
        </div>
        {item.prices && item.prices.length > 0 && (
          <div className="item-prices">
            {item.prices.map((price, idx) => (
              <div className="price-row" key={idx}>
                <span className="size-label">{price.size}</span>
                <span className="price-value">{price.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

