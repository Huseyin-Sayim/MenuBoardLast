"use client";

import { FunctionComponent } from 'react';
import { template12MenuItems } from "../../template-data";

// Default fallback image
const DEFAULT_IMAGE = "/images/burger_menu.svg";

// Helper function to normalize image URLs
const normalizeImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return DEFAULT_IMAGE;

    if (imageUrl.startsWith('http://localhost') || imageUrl.startsWith('https://localhost')) {
        try {
            const url = new URL(imageUrl);
            return url.pathname;
        } catch {
            // If URL parsing fails, fall through
        }
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    if (imageUrl.startsWith('/')) {
        return imageUrl;
    }

    return `/${imageUrl}`;
};

interface MenuItem {
    name: string;
    price: string;
    image?: string;
    categoryId?: string;
    productId?: string;
}

interface Template12Props {
    menuItems?: MenuItem[];
    headerTitle?: string;
    footerNote?: string;
    isEditable?: boolean;
    availableCategories?: Array<{ _id: string; name: string }>;
    availableProductsBySlot?: Record<number, Array<{ _id: string; name: string; pricing: any; category: string; image?: string; img?: string; imageUrl?: string }>>;
    onCategoryChange?: (index: number, categoryId: string) => void;
    onProductSelect?: (index: number, productId: string) => void;
    onMenuItemImageClick?: (index: number) => void;
}

const Template12: FunctionComponent<Template12Props> = ({
    menuItems = template12MenuItems as MenuItem[],
    headerTitle = "TAVUK MENÜLERİ",
    footerNote = "FİYATLARIMIZ KDV DAHİLDİR.",
    isEditable = false,
    availableCategories = [],
    availableProductsBySlot = {},
    onCategoryChange,
    onProductSelect,
    onMenuItemImageClick,
}) => {
    // 6 items for 3x2 grid
    const displayItems = [...menuItems.slice(0, 6)];

    // Pad with empty items if less than 6
    while (displayItems.length < 6) {
        displayItems.push({
            name: "CHICKEN BURGER",
            price: "200",
            image: DEFAULT_IMAGE
        });
    }

    // Render a single product card
    const renderProductCard = (item: MenuItem, index: number) => (
        <div
            key={index}
            className="relative group"
            style={{
                width: '580px',
                height: '380px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Edit Controls */}
            {isEditable && (
                <div className="absolute left-2 top-2 z-50 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-2 rounded">
                    <select
                        className="text-xs text-black p-1 rounded bg-white"
                        onChange={(e) => onCategoryChange?.(index, e.target.value)}
                        value={item.categoryId || ""}
                    >
                        <option value="">Kategori</option>
                        {availableCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    <select
                        className="text-xs text-black p-1 rounded bg-white"
                        onChange={(e) => onProductSelect?.(index, e.target.value)}
                        value={item.productId || ""}
                    >
                        <option value="">Ürün</option>
                        {availableProductsBySlot[index]?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                </div>
            )}

            {/* Product Image */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                <img
                    src={normalizeImageUrl(item.image)}
                    alt={item.name}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '260px',
                        objectFit: 'contain',
                        cursor: isEditable ? 'pointer' : 'default'
                    }}
                    onClick={() => isEditable && onMenuItemImageClick?.(index)}
                />
            </div>

            {/* Product Name and Price Row */}
            <div
                style={{
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 10px'
                }}
            >
                {/* Product Name */}
                <div
                    className="font-montserrat"
                    style={{
                        fontSize: '42px',
                        fontWeight: 600,
                        color: '#000',
                        maxWidth: '380px',
                        lineHeight: 1.1
                    }}
                >
                    {item.name}
                </div>

                {/* Price */}
                <div
                    className="font-nunito"
                    style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        flexShrink: 0
                    }}
                >
                    <span style={{ fontSize: '50px', fontWeight: 600, color: '#000' }}>₺</span>
                    <span style={{ fontSize: '60px', fontWeight: 800, color: '#000' }}>{item.price}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div
            className="font-nunito"
            style={{
                width: '1920px',
                height: '1080px',
                backgroundColor: '#e4ffff',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            {/* Header */}
            <div
                style={{
                    height: '194px',
                    backgroundColor: '#f9b841',
                    borderBottom: '3px solid #ffa500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 40px',
                    flexShrink: 0
                }}
            >
                <div
                    className="font-nunito"
                    style={{
                        fontSize: '100px',
                        fontWeight: 900,
                        color: '#fff'
                    }}
                >
                    {headerTitle}
                </div>
                <img
                    src="/images/ntx.png"
                    alt="Logo"
                    style={{
                        height: '90px',
                        objectFit: 'contain'
                    }}
                />
            </div>

            {/* Main Content - 3x2 Grid */}
            <div
                style={{
                    flex: 1,
                    backgroundColor: '#effffe',
                    padding: '20px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}
            >
                {/* Row 1 */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}
                >
                    {displayItems.slice(0, 3).map((item, idx) => renderProductCard(item, idx))}
                </div>

                {/* Row 2 */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}
                >
                    {displayItems.slice(3, 6).map((item, idx) => renderProductCard(item, idx + 3))}
                </div>
            </div>

            {/* Footer */}
            <div
                style={{
                    height: '38px',
                    backgroundColor: '#effffe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '20px',
                    fontSize: '18px',
                    color: '#000',
                    flexShrink: 0
                }}
            >
                {footerNote}
            </div>
        </div>
    );
};

export default Template12;
