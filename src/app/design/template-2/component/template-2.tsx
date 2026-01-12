"use client";


interface MenuItem {
  name: string;
  price: string;
  desc: string;
  category: string;
}

interface Template2Props {
  menuItems?: MenuItem[],
  prices?: Record<string, string>,
  onPriceClick?: (itemName: string, currentPrice: string) => void,
  isEditable?: boolean,
  selectedCategory?: string,
  onCategoryChange?: (value: ((prevState: string) => string) | string) => void,
  availableProducts?: Array<{ _id: string, name: string, pricing: any, category: string }>,
  availableCategory?: Array<{ _id: string, name: string }>,
  onProductSelect?: (itemIndex: number, productId: string) => void,
  onPriceTypeSelect?: (itemIndex: number, priceType: string) => void,
  selectProducts?: Array<{ name: string, price: string, productId: string, priceType: string }> | undefined,
  availableCategories?: Array<{ _id: string; name: string }>,
  // Yeni props: Her kategori için ayrı yönetim
  selectedCategories?: Record<string, string>, // { "Ana Yemekler": "categoryId1", "İçecekler": "categoryId2" }
  onCategorySlotChange?: (categorySlot: string, categoryId: string) => void,
  selectedProductsByCategory?: Record<string, Array<{name: string; price: string; productId?: string; priceType?: string, image?: string}>>,
  onProductSelectByCategory?: (categorySlot: string, itemIndex: number, productId: string) => void,
  onPriceTypeSelectByCategory?: (categorySlot: string, itemIndex: number, priceType: string) => void
}

export default function Template2Content({
    menuItems,
    prices,
    onPriceClick,
    isEditable = false,
    selectedCategory,
    onCategoryChange,
    availableCategory,
    availableProducts,
    onProductSelect,
    onPriceTypeSelect,
    selectProducts,
    selectedCategories,
    onCategorySlotChange,
    selectedProductsByCategory,
    onProductSelectByCategory,
    onPriceTypeSelectByCategory,
    availableCategories,
  }: Template2Props) {
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="p-10 text-center">
        Menü yükleniyor veya veri bulunamadı!
      </div>
    );
  }

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  return (
    <>
      <div className="template-2-container">
        {/* HTML/CSS şablon içeriği buraya */}
        <div className="restaurant-header">
          <div className="header-content">
            <h1 className="restaurant-name">Lezzet Durağı</h1>
            <p className="restaurant-tagline">
              Geleneksel Lezzetler, Modern Sunum
            </p>
            {isEditable && availableCategory && availableCategory.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => {
                    if (onCategoryChange) {
                      onCategoryChange(e.target.value);
                    }
                  }}
                  style={{
                    padding: "8px 16px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    border: "2px solid #8b4513",
                    backgroundColor: "white",
                    color: "#8b4513",
                    cursor: "pointer"
                  }}
                >
                  <option value="">Kategori Seçin</option>
                  {availableCategory.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="header-divider"></div>
          </div>
        </div>

        <div className="menu-grid">
          {categories.map((categorySlot) => (
            <div key={categorySlot} className="menu-category">
              <div className="category-header">
                {isEditable && (availableCategories || availableCategory) && (availableCategories || availableCategory)!.length > 0 ? (
                  <select
                    value={selectedCategories?.[categorySlot] || ""}
                    onChange={(e) => {
                      if (onCategorySlotChange) {
                        onCategorySlotChange(categorySlot, e.target.value);
                      }
                    }}
                    className="category-title"
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: "600",
                      color: "#8b4513",
                      fontFamily: "'Georgia', serif",
                      border: "2px solid #8b4513",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      backgroundColor: "white",
                      cursor: "pointer",
                      width: "100%",
                      maxWidth: "100%",
                    }}
                  >
                    <option value="">{categorySlot} - Kategori Seçin</option>
                    {(availableCategories || availableCategory)!.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <h2 className="category-title">{categorySlot}</h2>
                )}
              </div>

              <div className="category-items">
                {(() => {
                  // Seçili kategoriye göre ürünleri filtrele
                  const selectedCategoryId = selectedCategories?.[categorySlot];
                  const categoryProducts = selectedProductsByCategory?.[categorySlot] || [];
                  
                  // Eğer kategori seçilmişse ve ürünler varsa, onları göster
                  // Eğer seçilmemişse, menuItems'dan filtrele (fallback)
                  let itemsToShow;
                  if (selectedCategoryId && categoryProducts.length > 0) {
                    itemsToShow = categoryProducts.map((p, idx) => ({
                      name: p.name,
                      price: p.price,
                      desc: "",
                      category: categorySlot
                    }));
                  } else {
                    itemsToShow = menuItems.filter((item) => item.category === categorySlot);
                  }
                  
                  // Maksimum 4 ürün göster
                  const maxProducts = 4;
                  const displayItems = itemsToShow.slice(0, maxProducts);
                  
                  // Eğer editable modda ve 4'ten az ürün varsa, boş slotlar ekle
                  const fixedItems = isEditable 
                    ? (() => {
                        const items = [...displayItems];
                        while (items.length < maxProducts) {
                          items.push({
                            name: '',
                            price: '',
                            desc: '',
                            category: categorySlot
                          });
                        }
                        return items;
                      })()
                    : displayItems;
                  
                  return fixedItems.map((item, index) => (
                    <div className="category-item" key={index}>
                      <div className="item-content">
                        {isEditable && availableProducts && availableProducts.length > 0 && onProductSelectByCategory ? (
                          <select
                            value={item.name || ""}
                            onChange={(e) => {
                              const selectedProduct = availableProducts.find(p => p.name === e.target.value);
                              if (selectedProduct && selectedProduct._id && onProductSelectByCategory) {
                                onProductSelectByCategory(categorySlot, index, selectedProduct._id);
                              }
                            }}
                            style={{
                              width: "100%",
                              padding: "8px",
                              fontSize: "1.1rem",
                              backgroundColor: "white",
                              color: "#1a1a1a",
                              border: "2px solid #8b4513",
                              borderRadius: "8px",
                              fontWeight: "600",
                              marginBottom: "0.25rem"
                            }}
                          >
                            <option value="">Ürün Seçin</option>
                            {(() => {
                              // Seçili kategoriye göre ürünleri filtrele
                              const selectedCategoryId = selectedCategories?.[categorySlot];
                              const filteredProducts = selectedCategoryId
                                ? availableProducts.filter(p => p.category === selectedCategoryId)
                                : availableProducts;
                              return filteredProducts.map(product => (
                                <option key={product._id} value={product.name}>
                                  {product.name}
                                </option>
                              ));
                            })()}
                          </select>
                        ) : (
                          <h3 className="item-title">{item.name || ""}</h3>
                        )}
                        {item.desc && <p className="item-desc">{item.desc}</p>}
                      </div>
                      {isEditable && onPriceTypeSelectByCategory && availableProducts && item.name && item.name.trim() !== "" ? (
                        (() => {
                          const categoryProducts = selectedProductsByCategory?.[categorySlot] || [];
                          const currentProduct = categoryProducts[index];
                          const apiProduct = availableProducts.find(p => p && p.name && p.name === item.name);
                          const currentPriceType = currentProduct?.priceType || "basePrice";

                          if (!apiProduct || !apiProduct.pricing) return null;

                          const formatPriceLabel = (currency?: string, price?: number) => {
                            if (typeof price !== "number") return "";
                            const code = currency || "TRY";
                            const symbol = code === "TRY" ? "₺" : code;
                            const formatted = new Intl.NumberFormat("tr-TR").format(price);
                            return `${symbol} ${formatted}`;
                          };

                          return (
                            <select
                              value={currentPriceType}
                              onChange={(e) => {
                                if (onPriceTypeSelectByCategory) {
                                  onPriceTypeSelectByCategory(categorySlot, index, e.target.value);
                                }
                              }}
                              className="item-price"
                              style={{
                                cursor: "pointer",
                                border: "none",
                                background: "inherit",
                                font: "inherit",
                                fontSize: "1.5rem",
                                fontWeight: "700",
                                color: "#8b4513",
                                padding: "4px 8px",
                                borderRadius: "8px"
                              }}
                            >
                              {Object.entries(apiProduct.pricing)
                                .filter(([key, value]: [string, any]) => {
                                  // Whitelist kontrolü (Template-1'deki gibi)
                                  const allowedPriceTypes = [
                                    "packageSalePrice",
                                    "thirdFastSalePrice",
                                    "secondFastSalePrice",
                                    "fastSalePrice",
                                    "basePrice",
                                    "purchasePrice"
                                  ];

                                  return allowedPriceTypes.includes(key) &&
                                    value &&
                                    typeof value.price === "number" &&
                                    value.price > 0;
                                })
                                .map(([key, value]: [string, any]) => (
                                  <option key={key} value={key}>
                                    {formatPriceLabel(value.currency, value.price)}
                                  </option>
                                ))}
                            </select>
                          );
                        })()
                      ) : isEditable && onPriceClick ? (
                        <div className="item-price">
                          {prices?.[item.name] || item.price}
                        </div>
                      ) : (
                        <div className="item-price">
                          {prices?.[item.name] || item.price}
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .template-2-container {
          width: 100%;
          height: 95.5vh;
          margin: 0;
          padding: 2rem;
          font-family: 'Georgia', serif;
          overflow: auto;
        }

        .restaurant-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem 0;
        }

        .restaurant-name {
          font-size: 3.5rem;
          font-weight: 700;
          color: #8b4513;
          margin-bottom: 0.5rem;
          font-family: 'Georgia', serif;
        }

        .restaurant-tagline {
          font-size: 1.1rem;
          color: #666;
          font-style: italic;
          margin-bottom: 1rem;
        }

        .header-divider {
          width: 150px;
          height: 3px;
          background: linear-gradient(to right, transparent, #8b4513, transparent);
          margin: 0 auto;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .menu-category {
          background: #faf8f5;
          border-radius: 12px;
          padding: 2rem;
          border: 2px solid #e8e0d6;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e8e0d6;
        }

        .category-icon {
          font-size: 2rem;
        }

        .category-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: #8b4513;
          font-family: 'Georgia', serif;
        }

        .category-items {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border-left: 4px solid #8b4513;
        }

        .item-content {
          flex: 1;
        }

        .item-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .item-desc {
          font-size: 0.9rem;
          color: #666;
          font-style: italic;
        }

        .item-badge {
          display: inline-block;
          background: #ff6b6b;
          color: white;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          margin-top: 0.5rem;
        }

        .item-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #8b4513;
          font-family: 'Georgia', serif;
        }

        @media (max-width: 768px) {
          .template-2-container {
            padding: 1rem;
          }

          .restaurant-name {
            font-size: 2.5rem;
          }

          .menu-grid {
            grid-template-columns: 1fr;
          }
        }

      `}</style>
      <style>{`
        .dark .template-2-container .restaurant-name,
        .dark .template-2-container .category-title,
        .dark .template-2-container .item-price {
          color: #d4a574;
        }

        .dark .template-2-container .menu-category {
          background: #1f2937;
          border-color: #374151;
        }

        .dark .template-2-container .category-item {
          background: #111827;
        }

        .dark .template-2-container .item-title {
          color: #ffffff;
        }

        .dark .template-2-container .item-desc {
          color: #a0a0a0;
        }
      `}</style>
    </>
  );
}
