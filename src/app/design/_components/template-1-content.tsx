"use client";

type Template1ContentProps = {
  prices?: Record<number, string>;
  onPriceClick?: (itemId: number, currentPrice: string) => void;
  isEditable?: boolean;
};

export default function Template1Content({ prices, onPriceClick, isEditable = false }: Template1ContentProps = {}) {
  const defaultBurgers = [
    { id: 1, name: "VEGGIE BURGER", price: "₺180", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop" },
    { id: 2, name: "ANGUS BEEF BURGER", price: "₺260", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop" },
    { id: 3, name: "SURF AND TURF BURGER", price: "₺310", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=400&auto=format&fit=crop" },
    { id: 4, name: "THREEFLE SPECIALTY", price: "₺340", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=400&auto=format&fit=crop" },
    { id: 5, name: "CHICKEN AIOLI BURGER", price: "₺210", img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=400&auto=format&fit=crop" },
    { id: 6, name: "GROUND TURKEY BURGER", price: "₺195", img: "https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=400&auto=format&fit=crop" },
  ];

  const burgers = defaultBurgers.map(burger => ({
    ...burger,
    price: prices?.[burger.id] || burger.price,
  }));

  return (
    <>
      <div className="fire-menu-container">
        {/* ARKA PLAN: AGRESİF ALEV */}
        <div className="bg-fire">
          <img 
            src="https://images.unsplash.com/photo-1599591037488-3a5d33698d45?q=80&w=1600&auto=format&fit=crop" 
            alt="Intense Fire" 
          />
          <div className="dark-mask"></div>
        </div>

        {/* SOL: HERO BÖLÜMÜ */}
        <div className="pane-hero">
          <div className="badge-new">YENİ</div>
          <h1 className="title-large">CHEESE<br/><span>BURGER</span></h1>
          
          <div className="main-burger-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1000&auto=format&fit=crop" 
              className="hero-burger"
              alt="King Burger"
            />
          </div>

      
        </div>

        {/* SAĞ: MENÜ LİSTESİ */}
        <div className="pane-menu">
          <div className="grid-layout">
            {burgers.map((b) => (
              <div key={b.id} className="menu-item-card">
                <div className="thumb-box">
                  <img src={b.img} alt={b.name} />
                </div>
                <div className="item-txt">
                  <h3>{b.name}</h3>
                  {isEditable && onPriceClick ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPriceClick(b.id, b.price);
                      }}
                      className="price-pill"
                      style={{ cursor: 'pointer', border: 'none', background: 'inherit', font: 'inherit' }}
                    >
                      {b.price}
                    </button>
                  ) : (
                    <span className="price-pill">{b.price}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="slogan-footer">
            EN İYİ BURGERLAR BASİT, SULU VE DAĞINIKTIR
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(html, body) {
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: #000;
        }

        .fire-menu-container {
          position: absolute;
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
          z-index: -1;
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
        }

        .badge-new {
          background: #fff;
          color: #000;
          padding: 4px 18px;
          width: fit-content;
          font-weight: 900;
          transform: rotate(-3deg);
          box-shadow: 4px 4px 0 #e31818;
        }

        .title-large {
          font-size: 9vw;
          line-height: 0.8;
          margin: 0;
          text-shadow: 6px 6px 0px #000;
        }

        .title-large span { color: #ffcc00; }

        .main-burger-wrapper {
          border-radius: 20% !important;
          position: relative;
          display: flex;
          justify-content: center;
        }

        .hero-burger {
        border-radius: 5% !important;
          max-height: 48vh;
          filter: drop-shadow(0 25px 40px rgba(0,0,0,0.9));
          margin-bottom: 2vh;
        }

        .hours-label {
          font-size: 0.8rem;
          border: 1px solid rgba(255,255,255,0.4);
          padding: 10px;
          width: fit-content;
          background: rgba(0,0,0,0.5);
        }

        .pane-menu {
          padding: 6vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .grid-layout {
          margin-top: 5vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: repeat(3, 1fr);
          gap: 5vh 2vw;
          margin-bottom: 3vh;
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
        }

        .thumb-box {
          width: 11vh;
          height: 11vh;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #fff;
          flex-shrink: 0;
        }

        .thumb-box img { width: 100%; height: 100%; object-fit: cover; }

        .item-txt h3 {
          font-size: 2vw;
          margin: 0 0 5px 0;
          letter-spacing: -0.5px;
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
        }
      `}</style>
    </>
  );
}