"use client";

type Template3ContentProps = {
  prices?: Record<string, string>;
  onPriceClick?: (itemName: string, currentPrice: string) => void;
  isEditable?: boolean;
};

export default function Template3Content({ prices, onPriceClick, isEditable = false }: Template3ContentProps = {}) {
  const menuItems = [
    { name: "Serpme Kahvaltı", price: "₺120" },
    { name: "Menemen", price: "₺45" },
    { name: "Omlet", price: "₺40" },
    { name: "Mercimek Çorbası", price: "₺35" },
    { name: "Izgara Köfte", price: "₺85" },
    { name: "Salata Tabağı", price: "₺55" },
    { name: "Balık Tava", price: "₺130" },
    { name: "Kuzu Tandır", price: "₺150" },
    { name: "Mantı", price: "₺65" },
  ].map(item => ({
    ...item,
    price: prices?.[item.name] || item.price,
  }));
  return (
    <>
      <div className="template-3-container">
      {/* HTML/CSS şablon içeriği buraya */}
        <header className="minimal-header">
          <h1 className="minimal-title">Menü</h1>
        </header>

        <main className="minimal-content">
          <section className="minimal-section">
            <h2 className="minimal-section-title">Kahvaltı</h2>
            <ul className="minimal-list">
              <li className="minimal-list-item">
                <span className="item-text">Serpme Kahvaltı</span>
                <span className="item-dot"></span>
                {isEditable && onPriceClick ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPriceClick("Serpme Kahvaltı", menuItems.find(m => m.name === "Serpme Kahvaltı")?.price || "₺120");
                    }}
                    className="item-price"
                    style={{ cursor: 'pointer', border: 'none', background: 'inherit', font: 'inherit', padding: 0, minWidth: '60px', textAlign: 'right' }}
                  >
                    {menuItems.find(m => m.name === "Serpme Kahvaltı")?.price || "₺120"}
                  </button>
                ) : (
                  <span className="item-price">{menuItems.find(m => m.name === "Serpme Kahvaltı")?.price || "₺120"}</span>
                )}
              </li>
              <li className="minimal-list-item">
                <span className="item-text">Menemen</span>
                <span className="item-dot"></span>
                {isEditable && onPriceClick ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPriceClick("Menemen", menuItems.find(m => m.name === "Menemen")?.price || "₺45");
                    }}
                    className="item-price"
                    style={{ cursor: 'pointer', border: 'none', background: 'inherit', font: 'inherit', padding: 0, minWidth: '60px', textAlign: 'right' }}
                  >
                    {menuItems.find(m => m.name === "Menemen")?.price || "₺45"}
                  </button>
                ) : (
                  <span className="item-price">{menuItems.find(m => m.name === "Menemen")?.price || "₺45"}</span>
                )}
              </li>
              <li className="minimal-list-item">
                <span className="item-text">Omlet</span>
                <span className="item-dot"></span>
                {isEditable && onPriceClick ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPriceClick("Omlet", menuItems.find(m => m.name === "Omlet")?.price || "₺40");
                    }}
                    className="item-price"
                    style={{ cursor: 'pointer', border: 'none', background: 'inherit', font: 'inherit', padding: 0, minWidth: '60px', textAlign: 'right' }}
                  >
                    {menuItems.find(m => m.name === "Omlet")?.price || "₺40"}
                  </button>
                ) : (
                  <span className="item-price">{menuItems.find(m => m.name === "Omlet")?.price || "₺40"}</span>
                )}
              </li>
            </ul>
          </section>

          <section className="minimal-section">
            <h2 className="minimal-section-title">Öğle Yemeği</h2>
            <ul className="minimal-list">
              <li className="minimal-list-item">
                <span className="item-text">Mercimek Çorbası</span>
                <span className="item-dot"></span>
                {isEditable && onPriceClick ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPriceClick("Mercimek Çorbası", menuItems.find(m => m.name === "Mercimek Çorbası")?.price || "₺35");
                    }}
                    className="item-price"
                    style={{ cursor: 'pointer', border: 'none', background: 'inherit', font: 'inherit', padding: 0, minWidth: '60px', textAlign: 'right' }}
                  >
                    {menuItems.find(m => m.name === "Mercimek Çorbası")?.price || "₺35"}
                  </button>
                ) : (
                  <span className="item-price">{menuItems.find(m => m.name === "Mercimek Çorbası")?.price || "₺35"}</span>
                )}
              </li>
              <li className="minimal-list-item">
                <span className="item-text">Izgara Köfte</span>
                <span className="item-dot"></span>
                {isEditable && onPriceClick ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPriceClick("Izgara Köfte", menuItems.find(m => m.name === "Izgara Köfte")?.price || "₺85");
                    }}
                    className="item-price"
                    style={{ cursor: 'pointer', border: 'none', background: 'inherit', font: 'inherit', padding: 0, minWidth: '60px', textAlign: 'right' }}
                  >
                    {menuItems.find(m => m.name === "Izgara Köfte")?.price || "₺85"}
                  </button>
                ) : (
                  <span className="item-price">{menuItems.find(m => m.name === "Izgara Köfte")?.price || "₺85"}</span>
                )}
              </li>
              <li className="minimal-list-item">
                <span className="item-text">Salata Tabağı</span>
                <span className="item-dot"></span>
                {isEditable && onPriceClick ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPriceClick("Salata Tabağı", menuItems.find(m => m.name === "Salata Tabağı")?.price || "₺55");
                    }}
                    className="item-price"
                    style={{ cursor: 'pointer', border: 'none', background: 'inherit', font: 'inherit', padding: 0, minWidth: '60px', textAlign: 'right' }}
                  >
                    {menuItems.find(m => m.name === "Salata Tabağı")?.price || "₺55"}
                  </button>
                ) : (
                  <span className="item-price">{menuItems.find(m => m.name === "Salata Tabağı")?.price || "₺55"}</span>
                )}
              </li>
            </ul>
          </section>

          <section className="minimal-sections">
            <h2 className="minimal-section-title">Akşam Yemeği</h2>
            <ul className="minimal-list">
              <li className="minimal-list-item">
                <span className="item-text">Balık Tava</span>
                <span className="item-dot"></span>
                {isEditable && onPriceClick ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPriceClick("Balık Tava", menuItems.find(m => m.name === "Balık Tava")?.price || "₺130");
                    }}
                    className="item-price"
                    style={{ cursor: 'pointer', border: 'none', background: 'inherit', font: 'inherit', padding: 0, minWidth: '60px', textAlign: 'right' }}
                  >
                    {menuItems.find(m => m.name === "Balık Tava")?.price || "₺130"}
                  </button>
                ) : (
                  <span className="item-price">{menuItems.find(m => m.name === "Balık Tava")?.price || "₺130"}</span>
                )}
              </li>
              <li className="minimal-list-item">
                <span className="item-text">Kuzu Tandır</span>
                <span className="item-dot"></span>
                {isEditable && onPriceClick ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPriceClick("Kuzu Tandır", menuItems.find(m => m.name === "Kuzu Tandır")?.price || "₺150");
                    }}
                    className="item-price"
                    style={{ cursor: 'pointer', border: 'none', background: 'inherit', font: 'inherit', padding: 0, minWidth: '60px', textAlign: 'right' }}
                  >
                    {menuItems.find(m => m.name === "Kuzu Tandır")?.price || "₺150"}
                  </button>
                ) : (
                  <span className="item-price">{menuItems.find(m => m.name === "Kuzu Tandır")?.price || "₺150"}</span>
                )}
              </li>
              <li className="minimal-list-item">
                <span className="item-text">Mantı</span>
                <span className="item-dot"></span>
                {isEditable && onPriceClick ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPriceClick("Mantı", menuItems.find(m => m.name === "Mantı")?.price || "₺65");
                    }}
                    className="item-price"
                    style={{ cursor: 'pointer', border: 'none', background: 'inherit', font: 'inherit', padding: 0, minWidth: '60px', textAlign: 'right' }}
                  >
                    {menuItems.find(m => m.name === "Mantı")?.price || "₺65"}
                  </button>
                ) : (
                  <span className="item-price">{menuItems.find(m => m.name === "Mantı")?.price || "₺65"}</span>
                )}
              </li>
            </ul>
          </section>
        </main>
      </div>

      <script>
      
      </script>

      <style jsx>{`
      .menu-name {
        font-size: 1.3rem;
        font-weight: 400;
        color: #1a1a1a;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 1.5rem;
      }
        .template-3-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 3rem 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow: auto;
        }

        .minimal-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .minimal-title {
          font-size: 2.5rem;
          font-weight: 300;
          color: #1a1a1a;
          letter-spacing: 8px;
          text-transform: uppercase;
        }

        .minimal-content {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 15rem;
        }

        .minimal-section {
          border-right: 1px solid #e5e5e5;
          padding-right: 30%;
        }

        .minimal-section:last-child {
          border-bottom: none;
        }

        .minimal-section-title {
          font-size: 1.1rem;
          font-weight: 400;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1.5rem;
        }

        .minimal-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .minimal-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0;
        }

        .item-text {
          font-size: 1.3rem;
          font-weight: 400;
          color: #1a1a1a;
          flex: 1;
        }

        .item-dot {
          flex: 1;
          height: 1px;
          background: repeating-linear-gradient(
            to right,
            #1a1a1a 0,
            #1a1a1a 4px,
            transparent 4px,
            transparent 8px
          );
          margin: 0 1rem;
          opacity: 0.3;
        }

        .item-price {
          font-size: 1.1rem;
          font-weight: 400;
          color: #1a1a1a;
          min-width: 60px;
          text-align: right;
        }

        @media (max-width: 768px) {
          .template-3-container {
            padding: 2rem 1rem;
          }

          .minimal-title {
            font-size: 2rem;
            letter-spacing: 4px;
          }

          .item-dot {
            margin: 0 0.5rem;
          }
        }

      `}</style>
      <style jsx global>{`
        .dark .template-3-container .minimal-title,
        .dark .template-3-container .item-text,
        .dark .template-3-container .item-price {
          color: #ffffff;
        }

        .dark .template-3-container .minimal-section {
          border-color: #374151;
        }

        .dark .template-3-container .minimal-section-title {
          color: #6b7280;
        }

        .dark .template-3-container .item-dot {
          background: repeating-linear-gradient(
            to right,
            #ffffff 0,
            #ffffff 4px,
            transparent 4px,
            transparent 8px
          );
        }
      `}</style>
    </>
  );
}


