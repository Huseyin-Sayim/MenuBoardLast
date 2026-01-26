/**
 * Evrensel Menü Veri Şeması (Universal Data Schema)
 * Design Manifest - Her ürünün pozisyon ve stilini yönetir
 */

// ═══════════════════════════════════════════════════════════════
// LAYOUT & STYLE INTERFACES
// ═══════════════════════════════════════════════════════════════

/**
 * Yüzdelik bazlı layout (0-100)
 * Responsive tasarım için mutlaka yüzde kullan
 */
export interface IMenuItemLayout {
    x: number;      // Sol pozisyon (0-100 %)
    y: number;      // Üst pozisyon (0-100 %)
    w: number;      // Genişlik (%)
    h: number;      // Yükseklik (%)
    z: number;      // z-index (katman sırası)
}

/**
 * Responsive style (vw/vh birimleri zorunlu)
 */
export interface IMenuItemStyle {
    fontSize: string;     // Örn: '1.5vw' - viewport birimi ZORUNLU
    color: string;        // Hex veya RGBA
    fontWeight: string;   // '400', '600', '700', 'bold'
    textAlign: 'left' | 'center' | 'right';
    opacity: number;      // 0-1 arası
}

/**
 * Default layout değerleri
 */
export const DEFAULT_ITEM_LAYOUT: IMenuItemLayout = {
    x: 0,
    y: 0,
    w: 25,
    h: 20,
    z: 1,
};

/**
 * Default style değerleri (TV/Büyük ekran için optimize)
 */
export const DEFAULT_ITEM_STYLE: IMenuItemStyle = {
    fontSize: '1.2vw',
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    opacity: 1,
};

// ═══════════════════════════════════════════════════════════════
// MENU ITEM INTERFACES
// ═══════════════════════════════════════════════════════════════

/**
 * Menü öğesi temel yapısı - Layout ve Style dahil
 */
export interface IMenuItem {
    id: string;
    title: string;
    subtitle?: string;
    price: number;
    image?: string;
    isAvailable: boolean;
    // 🆕 Design Manifest alanları
    layout: IMenuItemLayout;
    style: IMenuItemStyle;
}

/**
 * Placeholder item (boş slot için)
 */
export interface IPlaceholderItem extends IMenuItem {
    isPlaceholder: true;
}

/**
 * Menü ayarları
 */
export interface IMenuSettings {
    theme: 'dark' | 'light';
    currency: string;
    globalTitle: string;
}

/**
 * Ana menü veri yapısı - Design Manifest
 * Tüm template'ler bu interface'i kullanmalıdır
 */
export interface IMenuData {
    settings: IMenuSettings;
    items: IMenuItem[];
}

/**
 * Template kapasitesi ile normalize edilmiş veri
 */
export interface INormalizedMenuData {
    settings: IMenuSettings;
    items: (IMenuItem | IPlaceholderItem)[];
    originalCount: number;
    capacity: number;
}

/**
 * Template bileşeni için props
 */
export interface ITemplateProps {
    data: IMenuData;
    capacity?: number;
    isEditable?: boolean;
    onItemClick?: (item: IMenuItem, index: number) => void;
    onSettingsChange?: (settings: IMenuSettings) => void;
}

/**
 * Template wrapper props
 */
export interface ITemplateWrapperProps {
    data: IMenuData;
    capacity: number;
    children: (normalizedData: INormalizedMenuData) => React.ReactNode;
}

/**
 * Template kaydetme için input tipi
 */
export interface ISaveTemplateInput {
    userId: string;
    templateId: string;
    configId?: string;
    menuData: IMenuData;
    deviceIds?: string[];
}

/**
 * Default ayarlar
 */
export const DEFAULT_MENU_SETTINGS: IMenuSettings = {
    theme: 'dark',
    currency: '₺',
    globalTitle: 'MENÜ',
};

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Grid layout hesaplama - Kapasite'ye göre satır/sütun
 */
export function calculateGridDimensions(capacity: number): { cols: number; rows: number } {
    if (capacity <= 4) return { cols: 2, rows: 2 };
    if (capacity <= 6) return { cols: 2, rows: 3 };
    if (capacity <= 8) return { cols: 4, rows: 2 };
    if (capacity <= 9) return { cols: 3, rows: 3 };
    if (capacity <= 12) return { cols: 4, rows: 3 };
    return { cols: 4, rows: Math.ceil(capacity / 4) };
}

/**
 * Otomatik layout hesaplama - Grid pozisyonu
 */
export function generateAutoLayout(
    index: number,
    totalItems: number,
    capacity?: number
): IMenuItemLayout {
    const effectiveCapacity = capacity || totalItems;
    const { cols, rows } = calculateGridDimensions(effectiveCapacity);

    const col = index % cols;
    const row = Math.floor(index / cols);

    // Padding ve spacing hesapla
    const padding = 2; // % cinsinden kenar boşluğu
    const itemWidth = (100 - (padding * 2) - ((cols - 1) * 2)) / cols;
    const itemHeight = (100 - (padding * 2) - ((rows - 1) * 2)) / rows;

    const x = padding + col * (itemWidth + 2);
    const y = padding + row * (itemHeight + 2);

    return {
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        w: Math.round(itemWidth * 10) / 10,
        h: Math.round(itemHeight * 10) / 10,
        z: 1,
    };
}

/**
 * Default style oluştur
 */
export function generateDefaultStyle(): IMenuItemStyle {
    return { ...DEFAULT_ITEM_STYLE };
}

/**
 * Boş placeholder item oluşturur
 */
export function createPlaceholderItem(index: number, capacity?: number): IPlaceholderItem {
    return {
        id: `placeholder-${index}`,
        title: '',
        subtitle: '',
        price: 0,
        image: '/images/placeholder-food.svg',
        isAvailable: false,
        isPlaceholder: true,
        layout: generateAutoLayout(index, capacity || 8, capacity),
        style: generateDefaultStyle(),
    };
}

/**
 * Type guard: Placeholder item mi kontrol eder
 */
export function isPlaceholderItem(item: IMenuItem | IPlaceholderItem): item is IPlaceholderItem {
    return 'isPlaceholder' in item && item.isPlaceholder === true;
}

/**
 * Type guard: Veri IMenuData formatında mı kontrol eder
 */
export function isMenuDataFormat(data: any): data is IMenuData {
    return (
        data &&
        typeof data === 'object' &&
        data.settings &&
        typeof data.settings === 'object' &&
        Array.isArray(data.items)
    );
}
