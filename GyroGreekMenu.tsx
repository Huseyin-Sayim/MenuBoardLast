import "../styles/gyrogreek.css";
import type { JSX } from "react";

const MENU_DATA = {
    brand: {
        shortName: "LA",
        fullName: "gyrogreek",
        phone: "(818)356-9676",
        logoImg: ""
    },
    hero: {
        logo: "/images/burger_logo.svg", // Logo replaces text
        titleTop: "GYRO",
        titleBottom: "FOOD",
        image: "/images/teavuk_dürüm.svg",
        promo: {
            title: "Only Today",
            value: "20%",
            label: "OFF"
        }
    },
    sidebarItems: [
        {
            title: "Hummus Veggie Gyro",
            desc: "mixed greens, hummus, tabuleh, pickled turnips, dolma, tzatziki, persian cucumbers",
            price: "13.99"
        }
    ],
    gridItems: [
        {
            title: "Chicken Gyro Wrap",
            desc: "romaine, tomatoes, red onions, persian cucumbers, greek pita, housemade yogurt sauce",
            price: "11.99",
            variant: "white blob",
            image: "/images/teavuk_dürüm.svg"
        },
        {
            title: "Ground Sirloin Gyro",
            desc: "mixed greens, cucumbers, tomatoes, pickles, hummus spread, tahini garlic aiology • choose up to 2 sides",
            price: "12.99",
            variant: "green",
            image: "/images/tavuk_dürüm2 1.svg"
        },
        {
            title: "Chicken Kabob Gyro",
            desc: "mixed greens, cucumbers, tomatoes, pickles, hummus spread, tahini garlic aiology • choose up to 2 sides",
            price: "13.99",
            variant: "white",
            image: "/images/teavuk_dürüm.svg"
        },
        {
            title: "Lamb Gyro Wrap",
            desc: "Combination of beef and lamb, lettuce, tomato & pickles",
            price: "14.99",
            variant: "white blob",
            image: "/images/tavuk_dürüm2 1.svg"
        },
        {
            title: "BBQ Chicken Gyro",
            desc: "romaine, corn, black beans, scallions, tortilla strips, Monterrey Jack cheese, housemade ranch, bbq • choose up to 2 sides",
            price: "13.99",
            variant: "white blob",
            image: "/images/teavuk_dürüm.svg"
        },
        {
            title: "Salmon Gyro",
            desc: "romaine, parsley, persian cucumbers, tomatoes, red onions, pickles, lemon ranch vinaigrette • choose up to 2 sides",
            price: "12.99",
            variant: "salmon",
            image: "/images/tavuk_dürüm2 1.svg"
        }
    ]
};

export const GyroGreekMenu = (): JSX.Element => {
    return (
        <div className="gyro-greek-menu">
            {/* Left Sidebar */}
            <aside className="gg-sidebar">
                <div className="gg-hero-text">
                    {MENU_DATA.hero.logo ? (
                        <img src={MENU_DATA.hero.logo} alt="Brand Logo" className="gg-hero-logo" />
                    ) : (
                        <>
                            <div className="gg-hero-gyro">{MENU_DATA.hero.titleTop}</div>
                            <div className="gg-hero-food">{MENU_DATA.hero.titleBottom}</div>
                        </>
                    )}
                </div>

                <div className="gg-hero-image-area">
                    <img src={MENU_DATA.hero.image} alt="Hero" className="gg-hero-img" />
                    <div className="gg-promo-circle">
                        <div style={{ fontSize: 'calc(14 * var(--scale-x))' }}>{MENU_DATA.hero.promo.title}</div>
                        <div style={{ fontSize: 'calc(44 * var(--scale-x))', fontWeight: 900 }}>{MENU_DATA.hero.promo.value}</div>
                        <div style={{ fontSize: 'calc(24 * var(--scale-x))', fontWeight: 700 }}>{MENU_DATA.hero.promo.label}</div>
                    </div>
                </div>

                <div className="gg-sidebar-footer">
                    {MENU_DATA.sidebarItems.map((item, index) => (
                        <div key={index} className="gg-footer-item">
                            <h3 className="gg-footer-title">{item.title}</h3>
                            <p className="gg-footer-desc">{item.desc}</p>
                            <div className="gg-footer-price">{item.price}</div>
                        </div>
                    ))}
                    <div className="gg-phone" style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '20px' }}>
                        {MENU_DATA.brand.phone}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="gg-main-content">
                <div className="gg-grid">
                    {MENU_DATA.gridItems.map((item, index) => (
                        <div key={index} className={`gg-card ${item.variant}`}>
                            <h2 className="gg-card-title">{item.title}</h2>
                            <p className="gg-card-desc">{item.desc}</p>
                            <div className="gg-card-price">{item.price}</div>
                            <img src={item.image} alt={item.title} className="gg-card-img" />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};
