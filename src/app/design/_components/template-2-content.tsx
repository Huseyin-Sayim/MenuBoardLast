"use client";

export default function Template2Content() {
  return (
    <>
      <div className="template-2-container">
        {/* HTML/CSS şablon içeriği buraya */}
        <div className="restaurant-header">
          <div className="header-content">
            <h1 className="restaurant-name">Lezzet Durağı</h1>
            <p className="restaurant-tagline">Geleneksel Lezzetler, Modern Sunum</p>
            <div className="header-divider"></div>
          </div>
        </div>

        <div className="menu-grid">
          <div className="menu-category">
            <div className="category-header">
              <span className="category-icon">🍽️</span>
              <h2 className="category-title">Ana Yemekler</h2>
            </div>
            <div className="category-items">
              <div className="category-item">
                <div className="item-content">
                  <h3 className="item-title">Döner Tabağı</h3>
                  <p className="item-desc">Taze döner, pilav ve salata</p>
                  <span className="item-badge">Popüler</span>
                </div>
                <div className="item-price">₺75</div>
              </div>
              <div className="category-item">
                <div className="item-content">
                  <h3 className="item-title">Lahmacun</h3>
                  <p className="item-desc">İnce hamur, özel harç</p>
                </div>
                <div className="item-price">₺25</div>
              </div>
              <div className="category-item">
                <div className="item-content">
                  <h3 className="item-title">Kebap Tabağı</h3>
                  <p className="item-desc">Adana, Urfa, Tavuk</p>
                </div>
                <div className="item-price">₺110</div>
              </div>
            </div>
          </div>

          <div className="menu-category">
            <div className="category-header">
              <span className="category-icon">🥤</span>
              <h2 className="category-title">İçecekler</h2>
            </div>
            <div className="category-items">
              <div className="category-item">
                <div className="item-content">
                  <h3 className="item-title">Ayran</h3>
                  <p className="item-desc">Ev yapımı ayran</p>
                </div>
                <div className="item-price">₺15</div>
              </div>
              <div className="category-item">
                <div className="item-content">
                  <h3 className="item-title">Türk Kahvesi</h3>
                  <p className="item-desc">Geleneksel pişirme</p>
                </div>
                <div className="item-price">₺20</div>
              </div>
              <div className="category-item">
                <div className="item-content">
                  <h3 className="item-title">Çay</h3>
                  <p className="item-desc">Taze demlenmiş</p>
                </div>
                <div className="item-price">₺10</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .template-2-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Georgia', serif;
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
      <style jsx global>{`
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


