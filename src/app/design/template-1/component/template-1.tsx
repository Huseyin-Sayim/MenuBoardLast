"use client";

interface BurgerItem {
  name: string;
  price: string;
  img: string;
  heroIMG?: string;
  heroTitle?: string;
}

interface Template1Props {
  burgerItems?: BurgerItem[];
  prices?: Record<string, string>;
  onPriceClick?: (itemName: string, currentPrice: string) => void;
  isEditable?: boolean;
}

export default function Template1Content({burgerItems, prices, onPriceClick, isEditable = false}:Template1Props) {

  if (!burgerItems || burgerItems.length === 0) {
    return <div style={{ color: "white", padding: "50px", textAlign: "center" }}>Menü Yükleniyor...</div>;
  }

  const heroItem = burgerItems[0];

  if (!heroItem) {
    return <div style={{ color: "white", padding: "50px", textAlign: "center" }}>Menü Yükleniyor...</div>;
  }

  const heroIMG = heroItem.heroIMG || heroItem.img;
  const heroTitle = heroItem.heroTitle || heroItem.name || "Menü";

  return (

    <>
      <div className="fire-menu-container">
        <div className="bg-fire">
          <img src="https://static.vecteezy.com/system/resources/previews/027/179/070/non_2x/realistic-colored-flame-fire-concept-vector.jpg" alt="Fire" />
          <div className="dark-mask"></div>
        </div>

        <div className="pane-hero">
          <div className="badge-new">ÖZEL SEÇİM</div>
          <h1 className="title-large">
            {heroTitle && heroTitle.split(' ').map((word, index) => (
              <span key={`${word}-${index}`}>{word}<br/></span>
            ))}
          </h1>

          <div className="main-burger-wrapper">
              <img
                src={heroIMG}
                className="hero-burger"
                alt="Hero Burger"
              />
          </div>
        </div>

        <div className="pane-menu">
          <div className="grid-layout">
            {burgerItems.map((burger) => (
              <div key={burger.name} className="menu-item-card">
                <div className="thumb-box">
                  <img src={burger.img} alt={burger.name} />
                </div>
                <div className="item-txt">
                  <h3>{burger.name}</h3>
                  {isEditable && onPriceClick ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const currentPrice = prices?.[burger.name] || `₺${burger.price}`;
                        onPriceClick(burger.name, currentPrice);
                      }}
                      className="price-pill"
                      style={{ cursor: 'pointer', border: 'none', background: 'inherit', font: 'inherit', padding: '2px 14px' }}
                    >
                      {prices?.[burger.name] || `₺${burger.price}`}
                    </button>
                  ) : (
                    <span className="price-pill">{prices?.[burger.name] || `₺${burger.price}`}</span>
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
          height:100vh;
          overflow-y: auto;
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
          z-index: 1;
        }
      `}</style>
    </>
  );
}