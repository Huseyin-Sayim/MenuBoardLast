"use client";

import { FunctionComponent, useState } from 'react';

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
            // fallthrough
        }
    }
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    if (imageUrl.startsWith('/')) return imageUrl;
    return `/${imageUrl}`;
};

interface ProductItem {
    name: string;
    image?: string;
    sizes?: Array<{ label: string; price: string }>;
    categoryId?: string;
    productId?: string;
}

interface ExtraItem {
    name: string;
    price: string;
}

interface Template13Props {
    menuItems?: ProductItem[];
    extraItems?: ExtraItem[];
    extraTitle?: string;
    sideImage?: string;
    isEditable?: boolean;
    availableCategories?: Array<{ _id: string; name: string }>;
    availableProductsBySlot?: Record<number, Array<{ _id: string; name: string; pricing: any; category: string; image?: string; img?: string; imageUrl?: string }>>;
    onCategoryChange?: (index: number, categoryId: string) => void;
    onProductSelect?: (index: number, productId: string) => void;
    onMenuItemImageClick?: (index: number) => void;
    onSideImageClick?: () => void;
    onExtraItemChange?: (index: number, field: 'name' | 'price', value: string) => void;
    onExtraTitleChange?: (value: string) => void;
}

const defaultMenuItems: ProductItem[] = Array(8).fill(null).map(() => ({
    name: "SPECIAL",
    image: DEFAULT_IMAGE,
    sizes: [
        { label: "KÜÇÜK", price: "200" },
        { label: "ORTA", price: "250" },
        { label: "BÜYÜK", price: "300" }
    ]
}));

const defaultExtraItems: ExtraItem[] = [
    { name: "PATATES KIZARTMASI", price: "50₺" },
    { name: "SOĞAN HALKASI", price: "60₺" },
    { name: "MOZERELLA ÇUBUKLARI", price: "60₺" },
    { name: "TAVUK NUGGET", price: "70₺" }
];

const Template13: FunctionComponent<Template13Props> = ({
    menuItems = defaultMenuItems,
    extraItems = defaultExtraItems,
    extraTitle = "EKSTRALAR",
    sideImage = "/images/template-13-side.png",
    isEditable = false,
    availableCategories = [],
    availableProductsBySlot = {},
    onCategoryChange,
    onProductSelect,
    onMenuItemImageClick,
    onSideImageClick,
    onExtraItemChange,
    onExtraTitleChange,
}) => {
    // State for editing extras
    const [editingExtra, setEditingExtra] = useState<{ index: number; field: 'name' | 'price' } | null>(null);
    const [editingTitle, setEditingTitle] = useState(false);
    // Ensure we have 8 items
    const displayItems = [...menuItems.slice(0, 8)];
    while (displayItems.length < 8) {
        displayItems.push(defaultMenuItems[0]);
    }

    // Render a single product card
    const renderProductCard = (item: ProductItem, index: number) => (
        <div
            key={index}
            className="flex-1 flex flex-col items-center justify-center gap-1 relative group"
            style={{ minWidth: '280px' }}
        >
            {/* Edit Controls */}
            {isEditable && (
                <div className="absolute left-1 top-1 z-50 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-2 rounded">
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
                    height: '200px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <img
                    src={normalizeImageUrl(item.image)}
                    alt={item.name}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '180px',
                        objectFit: 'contain',
                        cursor: isEditable ? 'pointer' : 'default'
                    }}
                    onClick={() => isEditable && onMenuItemImageClick?.(index)}
                />
            </div>

            {/* Product Name */}
            <div
                className="font-fredoka-one"
                style={{
                    fontSize: '40px',
                    color: '#fff',
                    textAlign: 'center'
                }}
            >
                {item.name}
            </div>

            {/* Size/Price Options */}
            <div style={{ width: '100%', maxWidth: '280px' }}>
                {(item.sizes || defaultMenuItems[0].sizes)?.map((size, sizeIdx) => (
                    <div
                        key={sizeIdx}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '4px 10px',
                            borderBottom: sizeIdx < 2 ? '1px solid #fff' : 'none',
                            fontSize: '25px',
                            color: '#fff'
                        }}
                    >
                        <span>{size.label}</span>
                        <span>{size.price}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div
            className="font-fredoka-one"
            style={{
                width: '1920px',
                height: '1080px',
                backgroundColor: '#000',
                display: 'flex',
                overflow: 'hidden'
            }}
        >
            {/* Left Side - 4x2 Product Grid */}
            <div
                style={{
                    width: '1255px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 30px'
                }}
            >
                {/* Row 1 */}
                <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {displayItems.slice(0, 4).map((item, idx) => renderProductCard(item, idx))}
                </div>
                {/* Row 2 */}
                <div style={{ flex: 1, display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {displayItems.slice(4, 8).map((item, idx) => renderProductCard(item, idx + 4))}
                </div>
            </div>

            {/* Right Side - Extras Panel with Red Background */}
            <div
                style={{
                    flex: 1,
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#A41E1E',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '60px 40px'
                }}
            >
                {/* Extras Title */}
                {isEditable && editingTitle ? (
                    <input
                        type="text"
                        defaultValue={extraTitle}
                        autoFocus
                        style={{
                            fontSize: '90px',
                            color: '#fff',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '60px',
                            fontFamily: 'Fredoka One, cursive',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            border: '2px solid #fff',
                            borderRadius: '8px',
                            outline: 'none',
                            width: '100%'
                        }}
                        onBlur={(e) => {
                            onExtraTitleChange?.(e.target.value);
                            setEditingTitle(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onExtraTitleChange?.((e.target as HTMLInputElement).value);
                                setEditingTitle(false);
                            }
                        }}
                    />
                ) : (
                    <div
                        style={{
                            fontSize: '90px',
                            color: '#fff',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '60px',
                            fontFamily: 'Fredoka One, cursive',
                            cursor: isEditable ? 'pointer' : 'default'
                        }}
                        onClick={() => isEditable && setEditingTitle(true)}
                    >
                        {extraTitle}
                    </div>
                )}

                {/* Extras List */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        gap: '40px'
                    }}
                >
                    {extraItems.map((extra, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '20px'
                            }}
                        >
                            {/* Extra Name */}
                            {isEditable && editingExtra?.index === idx && editingExtra?.field === 'name' ? (
                                <input
                                    type="text"
                                    defaultValue={extra.name}
                                    autoFocus
                                    style={{
                                        fontSize: '38px',
                                        color: '#fff',
                                        fontFamily: 'Fredoka One, cursive',
                                        textTransform: 'uppercase',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        border: '2px solid #fff',
                                        borderRadius: '8px',
                                        padding: '5px 10px',
                                        outline: 'none',
                                        flex: 1
                                    }}
                                    onBlur={(e) => {
                                        onExtraItemChange?.(idx, 'name', e.target.value);
                                        setEditingExtra(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onExtraItemChange?.(idx, 'name', (e.target as HTMLInputElement).value);
                                            setEditingExtra(null);
                                        }
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        fontSize: '38px',
                                        color: '#fff',
                                        fontFamily: 'Fredoka One, cursive',
                                        textTransform: 'uppercase',
                                        cursor: isEditable ? 'pointer' : 'default',
                                        padding: '5px 10px',
                                        borderRadius: '8px',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onClick={() => isEditable && setEditingExtra({ index: idx, field: 'name' })}
                                    onMouseEnter={(e) => isEditable && (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.2)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                    {extra.name}
                                </div>
                            )}
                            {/* Extra Price */}
                            {isEditable && editingExtra?.index === idx && editingExtra?.field === 'price' ? (
                                <input
                                    type="text"
                                    defaultValue={extra.price}
                                    autoFocus
                                    style={{
                                        fontSize: '72px',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontFamily: 'Fredoka One, cursive',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        border: '2px solid #fff',
                                        borderRadius: '8px',
                                        padding: '5px 10px',
                                        outline: 'none',
                                        width: '200px',
                                        textAlign: 'center'
                                    }}
                                    onBlur={(e) => {
                                        onExtraItemChange?.(idx, 'price', e.target.value);
                                        setEditingExtra(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onExtraItemChange?.(idx, 'price', (e.target as HTMLInputElement).value);
                                            setEditingExtra(null);
                                        }
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        fontSize: '72px',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontFamily: 'Fredoka One, cursive',
                                        whiteSpace: 'nowrap',
                                        cursor: isEditable ? 'pointer' : 'default',
                                        padding: '5px 10px',
                                        borderRadius: '8px',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onClick={() => isEditable && setEditingExtra({ index: idx, field: 'price' })}
                                    onMouseEnter={(e) => isEditable && (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.2)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                    {extra.price}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Logo */}
            <img
                src="/images/ntx.png"
                alt="Logo"
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    height: '120px',
                    objectFit: 'contain',
                    zIndex: 50
                }}
            />
        </div>
    );
};

export default Template13;
