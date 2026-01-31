import { FunctionComponent } from 'react';

interface Template11Item {
    name: string;
    price?: string;
    categoryId?: string;
    productId?: string;
}

interface Template11Props {
    leftItems?: Template11Item[];
    rightItems?: Template11Item[];
    featuredImages?: string[];
    isEditable?: boolean;
    availableCategories?: Array<{ _id: string; name: string }>;
    availableProductsBySlot?: Record<number, Array<{ _id: string; name: string; pricing: any; category: string; image?: string; img?: string; imageUrl?: string; options?: Array<{ key: string; name: string; price: number }> }>>;
    onCategoryChange?: (index: number, categoryId: string) => void;
    onProductSelect?: (index: number, productId: string) => void;
    onImageClick?: (index: number) => void;
}

const Template11: FunctionComponent<Template11Props> = ({
    leftItems = [
        { name: "ESPRESSO SİNGLE", price: "200₺" },
        { name: "CAPPUCCİNO", price: "185₺" },
        { name: "AMERICANO", price: "150₺" },
        { name: "RISRETTO", price: "200₺" },
        { name: "CORTADO", price: "195₺" },
        { name: "TÜRK KAHVESİ", price: "100₺" },
        { name: "DUBLE TÜRK KAHVESİ", price: "200₺" },
        { name: "FİLTRE KAHVE", price: "140₺" },
    ],
    rightItems = [
        { name: "ESPRESSO SİNGLE", price: "200₺" },
        { name: "CAPPUCCİNO", price: "185₺" },
        { name: "AMERICANO", price: "150₺" },
        { name: "RISRETTO", price: "200₺" },
        { name: "CORTADO", price: "195₺" },
        { name: "TÜRK KAHVESİ", price: "100₺" },
        { name: "DUBLE TÜRK KAHVESİ", price: "200₺" },
        { name: "FİLTRE KAHVE", price: "140₺" },
    ],
    featuredImages = ["/images/placeholder.png", "/images/placeholder-2.png"],
    isEditable = false,
    availableCategories = [],
    availableProductsBySlot = {},
    onCategoryChange,
    onProductSelect,
    onImageClick,
}) => {
    const renderItem = (item: Template11Item, index: number) => {
        return (
            <div key={index} className="self-stretch flex flex-col gap-1 py-[0rem] px-8 relative group">
                {isEditable && (
                    <div className="absolute left-0 top-0 z-50 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-2 rounded">
                        <select
                            className="text-xs text-black p-1 rounded"
                            onChange={(e) => onCategoryChange?.(index, e.target.value)}
                            value={item.categoryId || ""}
                        >
                            <option value="">Kategori</option>
                            {availableCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                        <select
                            className="text-xs text-black p-1 rounded"
                            onChange={(e) => onProductSelect?.(index, e.target.value)}
                            value={item.productId || ""}
                        >
                            <option value="">Ürün</option>
                            {availableProductsBySlot[index]?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                )}

                <div className="self-stretch flex-1 flex items-end">
                    <div className="relative">{item.name}</div>
                    <div className="h-[0.063rem] flex-1 relative bg-tan-100 border-white border-dashed border-t-[1px] box-border mx-2" />
                    <div className="relative">{item.price}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-[120.313rem] relative overflow-hidden flex flex-col items-start bg-cover bg-no-repeat bg-[top] text-left text-[6rem] text-tan-200 font-jua" style={{ backgroundImage: "url('/images/template-11.png')" }}>
            {/* Logo sağ alt köşe */}
            <img
                src="/images/ntx-white.png"
                alt="Logo"
                style={{
                    position: 'absolute',
                    bottom: '25px',
                    right: '40px',
                    height: '70px',
                    objectFit: 'contain',
                    zIndex: 50
                }}
            />
            <div className="self-stretch h-[13.75rem] flex flex-col items-center justify-center gap-[0.625rem]">
                <div className="relative">{`COFFEE & TEA`}</div>
                <div className="self-stretch h-[0.125rem] relative border-white border-solid border-t-[2px] box-border" />
            </div>
            <div className="self-stretch flex-1 flex items-center gap-[3.125rem] text-[2.25rem] text-tan-100">
                <div className="self-stretch flex-1 flex flex-col items-start justify-center">
                    <div className="self-stretch flex-1 flex flex-col items-start justify-center gap-16">
                        {leftItems.map((item, index) => renderItem(item, index))}
                    </div>
                    <div className="self-stretch h-[37.938rem] flex items-center justify-center relative group">
                        {isEditable && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 cursor-pointer" onClick={() => onImageClick?.(0)}>
                                <span className="bg-black/70 text-white px-2 py-1 rounded">Değiştir</span>
                            </div>
                        )}
                        <img className="flex-1 relative max-w-full overflow-hidden max-h-full object-cover" alt="" src={featuredImages[0]} />
                    </div>
                </div>
                <div className="self-stretch flex-1 flex flex-col items-start justify-center">
                    <div className="self-stretch h-[37.938rem] flex items-center justify-center relative group">
                        {isEditable && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 cursor-pointer" onClick={() => onImageClick?.(1)}>
                                <span className="bg-black/70 text-white px-2 py-1 rounded">Değiştir</span>
                            </div>
                        )}
                        <img className="flex-1 relative max-w-full overflow-hidden max-h-full object-cover" alt="" src={featuredImages[1]} />
                    </div>
                    <div className="self-stretch flex-1 flex flex-col items-start gap-16">
                        {rightItems.map((item, index) => renderItem(item, index + 8))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Template11;
