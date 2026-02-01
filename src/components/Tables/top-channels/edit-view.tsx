// "use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { MEDIA_ITEMS, type MediaItem } from "@/app/(home)/dashboard/media/_components/media-gallery";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getScreenName } from "@/services/screenServices";
import Template1Content from "@/app/design/template-1/component/template-1";
import Template2Content from "@/app/design/template-2/component/template-2";

import { defaultBurgers, menuItems } from "@/app/design/template-data";

// Template1 için tip
type BurgerItem = {
  id?: number;
  name: string;
  price: string;
  img: string;
  heroIMG?: string;
  heroTitle?: string;
};

// Template2 için tip
type MenuItem = {
  name: string;
  price: string;
  desc: string;
  category: string;
};

type MenuBoardDesign = {
  id: string;
  name: string;
  preview: string;
  isActive: boolean;
  type: "image" | "video";
  path?: string; // Şablonlar için path bilgisi
  configId?: string; // TemplateConfig ID'si (config'li şablonlar için)
};

type Template = {
  id: string;
  name: string;
  preview: string;
  path: string;
  configId?: string; // TemplateConfig ID'si
  component?: string; // Template component (template-1, template-2, vs.)
  snapshotUrl?: string; // Snapshot resmi URL'i
};

type PlaylistItemType = {
  id: string;
  item: MediaItem | MenuBoardDesign;
  isDesign: boolean;
  duration: number;
}

type EditViewProps = {
  screenName: string;
  initialMedia: MediaItem[];
  initialPlaylist?: PlaylistItemType[];
  currentDesign?: string;
  currentStatus?: "Aktif" | "Pasif";
  currentLocation?: string;
  screenWidth?: number;
  screenHeight?: number;
  onSaveAction: (designId: string, status: "Aktif" | "Pasif", location: string, playlist: Array<{ id: string; item: MediaItem | MenuBoardDesign; isDesign: boolean }>, screenConfig: ScreenConfig[], sortmatic: boolean) => void;
  onCancelAction: () => void;
};

const mockMenuBoardDesigns: MenuBoardDesign[] = [
  {
    id: "1",
    name: "Klasik Tasarım",
    preview: "/images/cover/cover-01.png",
    isActive: true,
    type: "image",
  },
  {
    id: "2",
    name: "Modern Tasarım",
    preview: "/images/cover/cover-02.jpg",
    isActive: false,
    type: "image",
  },
  {
    id: "3",
    name: "Minimalist Tasarım",
    preview: "/images/cover/cover-03.jpg",
    isActive: false,
    type: "image",
  },
  {
    id: "4",
    name: "Renkli Tasarım",
    preview: "/images/cover/cover-04.jpg",
    isActive: false,
    type: "image",
  },
  {
    id: "5",
    name: "Premium Tasarım",
    preview: "/images/cover/cover-05.jpg",
    isActive: false,
    type: "image",
  },
];


type SortableItemProps = {
  id: string;
  item: MediaItem | MenuBoardDesign;
  isDesign?: boolean;
  duration: number;
  onDurationChange: (id: string, val: number) => void;
  onRemove: (id: string) => void;
};

function SortableItem({ id, item, isDesign, duration, onDurationChange, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isTemplate = id.startsWith('template-') || id.startsWith('config-');
  const templateItem = isTemplate ? (item as MenuBoardDesign) : null;

  const thumbnail = isDesign
    ? (item as MenuBoardDesign).preview
    : (item as MediaItem).thumbnail || (item as MediaItem).url;

  const name = isDesign
    ? (item as MenuBoardDesign).name
    : (item as MediaItem).name;

  const type = isDesign
    ? (item as MenuBoardDesign).type
    : (item as MediaItem).type;

  const isVideo = type === 'video';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex shrink-0 items-center gap-2 rounded-lg border border-stroke bg-white p-2 dark:border-stroke-dark dark:bg-gray-dark"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing flex items-center justify-center"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-dark-4 dark:text-dark-6"
        >
          <path
            d="M7 5H13M7 10H13M7 15H13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded bg-gray-2 dark:bg-dark-2">
        {isTemplate && templateItem?.path ? (
          <iframe
            src={templateItem.configId
              ? `${templateItem.path}?configId=${templateItem.configId}`
              : templateItem.path}
            className="absolute inset-0 border-0"
            style={{
              transform: `scale(${Math.min(80 / 1920, 56 / 1080)})`,
              transformOrigin: "top left",
              width: "1920px",
              height: "1080px",
            }}
            title={`${templateItem.name} Önizleme`}
            scrolling="no"
          />
        ) : (
          <Image
            src={thumbnail}
            alt={name}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="w-24 shrink-0 flex flex-col gap-1">
        <p className="truncate text-xs font-medium text-dark dark:text-white">{name}</p>

        {!isVideo && (
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                onDurationChange(id, isNaN(val) || val < 1 ? 1 : val);
              }}
              className={cn(
                "w-14 rounded border px-1 py-0.5 text-xs outline-none focus:border-primary",
                "border-stroke bg-gray-50 dark:border-stroke-dark dark:bg-dark-3 dark:text-white"
              )}
              title="Süreyi değiştir"
            />
            <span className="text-[10px] text-dark-4">sn</span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="shrink-0 rounded p-1 text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-2"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-current"
        >
          <path
            d="M12 4L4 12M4 4L12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

// GCD (Greatest Common Divisor) hesaplama fonksiyonu
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

// Aspect ratio hesaplama
const calculateAspectRatio = (width: number, height: number): string => {
  const divisor = gcd(width, height);
  const ratioWidth = width / divisor;
  const ratioHeight = height / divisor;
  return `${ratioWidth} / ${ratioHeight}`;
};

export interface ScreenConfig {
  screenId: string;
  mediaId?: string;
  templateId?: string;
  templateConfigId?: string; // TemplateConfig ID'si (her config ayrı)
  mediaIndex: number
  duration: number
}

export function EditView({
  screenName,
  currentDesign = "1",
  currentStatus = "Aktif",
  currentLocation = "Giriş",
  screenWidth = 1920,
  screenHeight = 1080,
  initialMedia,
  initialPlaylist = [],
  onSaveAction,
  onCancelAction,
}: EditViewProps) {
  const [displayName, setDisplayName] = useState<string>("Yükleniyor...");
  const [selectedDesign, setSelectedDesign] = useState(currentDesign);
  const [selectedStatus, setSelectedStatus] = useState<"Aktif" | "Pasif">(
    currentStatus,
  );
  const [selectedLocation, setSelectedLocation] =
    useState<string>(currentLocation);
  // TODO: DB bağlandıktan sonra katalog tasarımlarını API'den çek
  const [designs, setDesigns] = useState(mockMenuBoardDesigns);
  const [activeTab, setActiveTab] = useState<"tasarim" | "medya" | "şablon">("medya");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatePrices, setTemplatePrices] = useState<Record<string, Record<string | number, string>>>({});
  const [editingPrice, setEditingPrice] = useState<{ templateId: string; itemId: string | number; currentPrice: string } | null>(null);
  const [priceInputValue, setPriceInputValue] = useState<string>("");
  // TODO: DB bağlandıktan sonra kullanıcının satın aldığı medyaları API'den doldur
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia);
  const [designCategory, setDesignCategory] = useState<
    "all" | "image" | "video"
  >("all");
  const [mediaCategory, setMediaCategory] = useState<"all" | "image" | "video">(
    "all",
  );
  const [purchasedDesignIds, setPurchasedDesignIds] = useState<string[]>([]);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [readyScreenConfig, setReadyScreenConfig] = useState<ScreenConfig[]>(
    [],
  );
  const [sortmatic, setSortmatic] = useState<boolean>(false);
  const [template1Data, setTemplate1Data] = useState<BurgerItem[]>(defaultBurgers);
  const [template2Data, setTemplate2Data] = useState<MenuItem[]>(menuItems);
  // Playlist: Seçilen medyaların sıralı listesi
  const [playlist, setPlaylist] = useState<PlaylistItemType[]>(() => {
    if (!initialPlaylist) return [];
    return initialPlaylist.map((p) => ({
      ...p,
      duration: p.duration ?? (p.item.type === "video" ? 0 : 10),
    }));
  });
  // initialPlaylist prop'u değiştiğinde playlist state'ini güncelle (sadece playlist boşsa)
  useEffect(() => {
    if (
      initialPlaylist &&
      initialPlaylist.length > 0 &&
      playlist.length === 0
    ) {
      setPlaylist(initialPlaylist);
    }
  }, [initialPlaylist, playlist.length]);

  useEffect(() => {
    const formattedConfig: ScreenConfig[] = playlist.map((item, index) => {
      if (item.isDesign && item.id.startsWith('config-')) {
        // Config için - config-{configId} formatında
        const configId = item.id.replace('config-', '');
        return {
          screenId: screenName,
          templateConfigId: configId, // Config ID'si
          mediaIndex: index + 1,
          duration: item.duration,
        };
      } else if (item.isDesign && item.id.startsWith('template-')) {
        // Eski format template için (geriye uyumluluk)
        return {
          screenId: screenName,
          templateId: item.id, // Zaten "template-1" formatında
          mediaIndex: index + 1,
          duration: item.duration,
        };
      } else {
        // Media için
        const mediaId = item.id.startsWith('media-')
          ? item.id.replace('media-', '')
          : item.item.id;
        return {
          screenId: screenName,
          mediaId: mediaId,
          mediaIndex: index + 1,
          duration: item.duration,
        };
      }
    });

    console.log('Playlist:', playlist);
    console.log("Tertemiz Config:", formattedConfig);
    setReadyScreenConfig(formattedConfig);
  }, [playlist, screenName]);

  // Kullanıcının sahip olduğu template'leri çek
  useEffect(() => {
    const fetchUserTemplates = async () => {
      try {
        const response = await fetch("/api/userTemplate");
        if (response.ok) {
          const result = await response.json();
          // Template tipine uygun formata çevir (preview ekle)
          // Her config ayrı bir template olarak gösterilecek
          const formattedTemplates: Template[] = (result.data || []).map((t: any) => ({
            id: t.configId || t.id, // Config ID'sini kullan (her config ayrı)
            name: t.name,
            path: t.path,
            preview: t.snapshotUrl || t.path, // snapshotUrl varsa onu kullan, yoksa path
            configId: t.configId || t.id, // Config ID'si
            component: t.component, // Component bilgisi
            snapshotUrl: t.snapshotUrl, // Snapshot URL'i
          }));
          setTemplates(formattedTemplates);
        } else {
          console.error("Kullanıcı template'leri getirilemedi");
        }
      } catch (error) {
        console.error("Kullanıcı template'leri getirilirken hata:", error);
      }
    };

    fetchUserTemplates();
  }, []);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const data = await getScreenName(screenName);

        if (data && data.name) {
          setDisplayName(data.name);
        }
      } catch (err: any) {
        throw new Error(`Screen name getirilirken hata oluştu: ${err.message}`);
      }
    };
    if (screenName) {
      fetchName();
    }
  }, [screenName]);

  const aspectRatio = calculateAspectRatio(screenWidth, screenHeight);
  const isPortrait = screenHeight > screenWidth;
  const maxHeight = isPortrait ? "400px" : "none";
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState<number>(1);


  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeDesign = designs.find((d) => d.id === selectedDesign);
  const activeMedia = selectedMediaId
    ? mediaItems.find((m) => m.id === selectedMediaId)
    : null;
  const activeTemplate = selectedTemplate
    ? templates.find((t) => t.id === selectedTemplate)
    : null;
  const previewImage = activeTemplate
    ? activeTemplate.preview
    : activeMedia
      ? activeMedia.thumbnail || activeMedia.url
      : activeDesign?.preview;

  // Önizleme alanı boyutlarını hesapla ve ölçeklendirmeyi güncelle
  useEffect(() => {
    if (activeTemplate && previewContainerRef.current) {
      const updateScale = () => {
        const container = previewContainerRef.current;
        if (!container) return;

        // Container'ın gerçek iç boyutlarını al (clientWidth/clientHeight padding'i otomatik çıkarır)
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Ölçeklendirmeyi hesapla - şablonun önizleme alanına tam sığması için
        // Math.min kullanarak en küçük oranı al, böylece hem genişlik hem yükseklik sığar
        if (containerWidth <= 0 || containerHeight <= 0) {
          setPreviewScale(1);
          return;
        }

        // Container'a tam sığması için scale hesapla
        const scaleX = containerWidth / screenWidth;
        const scaleY = containerHeight / screenHeight;
        const scale = Math.min(scaleX, scaleY);

        // Scale'in geçerli olduğundan emin ol ve ayarla
        setPreviewScale(Math.max(0.01, scale));

        setPreviewScale(scale);
      };

      // İlk hesaplama için kısa bir gecikme ekle (DOM'un render olması için)
      const timeoutId = setTimeout(updateScale, 100);

      // Resize event listener ekle
      const resizeObserver = new ResizeObserver(() => {
        setTimeout(updateScale, 50);
      });
      resizeObserver.observe(previewContainerRef.current);

      return () => {
        clearTimeout(timeoutId);
        resizeObserver.disconnect();
      };
    } else {
      setPreviewScale(1);
    }
  }, [activeTemplate, screenWidth, screenHeight]);

  const handleDurationChange = (id: string, newDuration: number) => {
    setPlaylist((prev) => {
      return prev.map((item) =>
        item.id === id ? { ...item, duration: newDuration } : item,
      );
    });
  };

  const handleMediaSelect = (mediaId: string) => {
    setSelectedMediaId(mediaId);
    setSelectedDesign(`media-${mediaId}`);
    // Şablon seçimini temizle
    setSelectedTemplate(null);

    const media = mediaItems.find((m) => m.id === mediaId);
    if (media && !playlist.find((p) => p.id === `media-${mediaId}`)) {
      setPlaylist((prev) => [
        ...prev,
        {
          id: `media-${mediaId}`,
          item: media,
          isDesign: false,
          duration: media.type === "video" ? 0 : 10,
        },
      ]);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    // Medya seçimini temizle
    setSelectedMediaId(null);
    setSelectedDesign(`template-${templateId}`);

    const template = templates.find((t) => t.id === templateId);

    if (template && !playlist.find((p) => p.id === `config-${template.configId}`)) {
      // Her config ayrı bir şablon olarak gösterilecek - config-{configId} formatında ID
      const playlistId = `config-${template.configId}`;

      // Şablonu MenuBoardDesign formatına çevir
      const templateAsDesign: MenuBoardDesign = {
        id: template.configId || template.id, // Config ID'sini kullan
        name: template.name,
        preview: template.preview,
        isActive: true,
        type: "image", // Şablonlar görsel olarak kabul ediliyor
        path: template.path, // Path bilgisini de ekle
        configId: template.configId, // Config ID'sini ekle (iframe için)
      };

      setPlaylist((prev) => [
        ...prev,
        {
          id: playlistId, // config-{configId} formatında
          item: templateAsDesign,
          isDesign: true,
          duration: 10, // Şablonlar için varsayılan süre
        },
      ]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPlaylist((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemoveFromPlaylist = (id: string) => {
    setPlaylist((prev) => prev.filter((p) => p.id !== id));
    // Eğer kaldırılan item seçiliyse, seçimi temizle
    if (
      selectedDesign === id ||
      selectedDesign === `media-${id}` ||
      selectedMediaId === id
    ) {
      setSelectedDesign(currentDesign);
      setSelectedMediaId(null);
    }
  };

  // Tasarımı satın alıp Medya sekmesine ekle
  // const handlePurchaseDesign = (design: MenuBoardDesign) => {
  //   // Zaten satın alındıysa sadece Medya sekmesine geç
  //   if (purchasedDesignIds.includes(design.id)) {
  //     const existingMedia = mediaItems.find((m) => m.id === `design-${design.id}`);
  //     setActiveTab("medya");
  //     if (existingMedia) {
  //       setSelectedMediaId(existingMedia.id);
  //     }
  //     return;
  //   }
  //
  //   // TODO: DB bağlandıktan sonra burada satın alma API çağrısı yap
  //   const newMedia: MediaItem = {
  //     id: `design-${design.id}`, // DB tarafında gerçek id ile değiştirilecek
  //     name: design.name,
  //     type: "image",
  //     url: design.preview,
  //     uploadedAt: new Date().toISOString().slice(0, 10),
  //   };
  //
  //   setMediaItems((prev) => [...prev, newMedia]);
  //   setPurchasedDesignIds((prev) => [...prev, design.id]);
  //   setActiveTab("medya");
  //   setSelectedMediaId(newMedia.id);
  // };

  const filteredMediaItems =
    mediaCategory === "all"
      ? mediaItems
      : mediaItems.filter((m) => m.type === mediaCategory);

  const handleSave = () => {
    onSaveAction(
      selectedDesign,
      selectedStatus,
      selectedLocation,
      playlist,
      readyScreenConfig,
      sortmatic,
    );
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stroke px-7.5 py-4 dark:border-stroke-dark">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white"></h2>
      </div>

      {/* Content */}
      <div className="grid gap-6 p-7.5 md:grid-cols-2">
        {/* Sol taraf - TV Preview ve Durum */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Önizleme
            </h3>
            <div className="flex-1 rounded-lg border-[1.5px] border-[#F3F3FE] bg-[#F3F3FE] p-4 dark:border-dark-3 dark:bg-dark-3">
              <div
                ref={previewContainerRef}
                className="relative w-full h-full rounded-lg shadow-lg"
                style={{
                  aspectRatio: aspectRatio,
                  maxHeight: maxHeight,
                  width: isPortrait ? "auto" : "100%",
                  margin: isPortrait ? "0 auto" : "0",
                  backgroundColor: activeTemplate?.id === "template-1" ? "#000" : activeTemplate?.id === "template-2" ? "#faf8f5" : "#e5e5fb",
                  overflow: 'hidden',
                }}
              >
                {activeTemplate ? (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ overflow: 'hidden' }}>
                    {activeTemplate.snapshotUrl ? (
                      <Image
                        src={activeTemplate.snapshotUrl}
                        alt={activeTemplate.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4">
                        <p className="text-dark-4 dark:text-dark-6 text-sm font-medium">
                          Şablon önizlemesi bulunamadı
                        </p>
                        <p className="text-dark-5 dark:text-dark-7 text-xs mt-1">
                          Lütfen şablon yapılandırmasından snapshot oluşturun
                        </p>
                      </div>
                    )}
                  </div>
                ) : activeMedia ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {activeMedia.type === "video" ? (
                      <video
                        src={activeMedia.url}
                        className="max-w-full max-h-full"
                        controls={false}
                        autoPlay={false}
                        muted
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      <Image
                        src={activeMedia.thumbnail || activeMedia.url}
                        alt={activeMedia.name}
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-center text-dark-4 dark:text-dark-6 text-sm font-medium">
                      Lütfen bir şablon veya medya seçin
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ekran Konumu */}
          <div className="flex flex-col">
            <p className="d-flex mb-3 text-lg font-semibold capitalize text-dark dark:text-white">
              <span>Ekran Adı: </span>
              <span className="text-body-M font-bold text-primary">
                {displayName}{" "}
              </span>
            </p>
          </div>
        </div>

        {/* Sağ taraf - Tasarımlar / Medya / Şablon sekmeleri */}
        <div className="flex flex-col">
          {/* Sekmeler */}
          <div className="ml-[-4px] flex justify-between gap-2 px-1">
            <button
              type="button"
              onClick={() => setActiveTab("medya")}
              className={cn(
                "bg-[#f9f9ff] bg -mr-4 w-32 rounded-t-lg border border-b-0 px-4 py-2 text-sm font-medium text-dark transition-all dark:text-white",
                activeTab === "medya"
                  ? "bg-[#F3F3FE] text-dark dark:bg-dark-2 dark:text-white"
                  : "dark:text-primary",
                "border-[#b3b3b3] dark:border-stroke-dark",
              )}
              style={{
                clipPath:
                  "polygon(0% 0%, 96% 0%, 90% 100%, 92% 100%, 0% 100%)"
              }}
            >
              Medya
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("şablon")}
              className={cn(
                "bg-[#f9f9ff] bg -ml-4 w-32 mr-[-4px] rounded-t-lg border border-b-0 px-4 py-2 text-sm font-medium text-dark transition-all dark:text-white",
                activeTab === "şablon"
                  ? "bg-[#F3F3FE] text-dark dark:bg-dark-2 dark:text-white"
                  : "dark:text-primary",
                "border-[#B3B3B3] dark:border-stroke-dark",
              )}
              style={{
                clipPath:
                  "polygon(8% 0%, 100% 0%, 100% 100%, 8% 100%, 0% 100%)",
              }}
            >
              Şablon
            </button>
          </div>

          {/* Content kutusu */}
          <div className="flex-1  border border-t-0 border-[#b3b3b3] bg-[#F3F3FE] p-4 pt-5 dark:border-stroke-dark dark:bg-dark-2">
            {activeTab === "medya" ? (
              <>
                {/* Medya kategorileri */}
                <div className="mt-1 flex gap-2 pb-3">
                  <button
                    type="button"
                    onClick={() => setMediaCategory("all")}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-all",
                      mediaCategory === "all"
                        ? "bg-primary text-white"
                        : "bg-white text-dark-4 hover:bg-gray-100 dark:bg-dark-3 dark:text-dark-6 dark:hover:bg-dark-3",
                    )}
                  >
                    Tümü
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaCategory("image")}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-all",
                      mediaCategory === "image"
                        ? "bg-primary text-white"
                        : "bg-white text-dark-4 hover:bg-gray-100 dark:bg-dark-3 dark:text-dark-6 dark:hover:bg-dark-3",
                    )}
                  >
                    Fotoğraflar
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaCategory("video")}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-all",
                      mediaCategory === "video"
                        ? "bg-primary text-white"
                        : "bg-white text-dark-4 hover:bg-gray-100 dark:bg-dark-3 dark:text-dark-6 dark:hover:bg-dark-3",
                    )}
                  >
                    Videolar
                  </button>
                </div>

                <div className="design-scrollbar mt-3 max-h-[460px] flex-1 pr-2">
                  <div
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                    style={{ padding: "10px" }}
                  >
                    {filteredMediaItems.map((item: MediaItem) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleMediaSelect(item.id)}
                        className={cn(
                          "overflow-hidden rounded-lg border text-left transition-all",
                          selectedMediaId === item.id
                            ? "border-primary shadow-sm"
                            : "border-stroke hover:border-primary/60 dark:border-stroke-dark",
                        )}
                      >
                        <div className="relative aspect-video w-full bg-gray-2 dark:bg-dark-2">
                          <Image
                            src={item.thumbnail || item.url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="border-t border-stroke bg-white px-3 py-2 dark:border-stroke-dark dark:bg-gray-dark">
                          <p className="truncate text-sm font-medium text-dark dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-xs text-dark-4 dark:text-dark-6">
                            {item.type === "video" ? "Video" : "Görsel"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : activeTab === "şablon" ? (
              <div className="design-scrollbar mt-3 max-h-[460px] flex-1 pr-2">
                <div
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                  style={{ padding: "10px" }}
                >
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleTemplateSelect(template.id)}
                      className={cn(
                        "overflow-hidden rounded-lg border text-left transition-all",
                        selectedTemplate === template.id
                          ? "border-primary shadow-sm"
                          : "border-stroke hover:border-primary/60 dark:border-stroke-dark",
                      )}
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-2 dark:bg-dark-2">
                        {template.snapshotUrl ? (
                          <Image
                            src={template.snapshotUrl}
                            alt={template.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-8 h-8 text-dark-4 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-stroke bg-white px-3 py-2 dark:border-stroke-dark dark:bg-gray-dark">
                        <p className="truncate text-sm font-medium text-dark dark:text-white">
                          {template.name}
                        </p>
                        <p className="text-xs text-dark-4 dark:text-dark-6">
                          Şablon
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Playlist - Oynatma Sırası */}
      <div className="border-t border-stroke px-7.5 py-4 dark:border-stroke-dark">
        <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">
          Oynatma Sırası
        </h3>
        <div className="rounded-lg border border-stroke bg-[#F3F3FE] p-4 dark:border-stroke-dark dark:bg-dark-2">
          {playlist.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={playlist.map((p) => p.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="design-scrollbar flex gap-3 overflow-x-auto pb-2">
                  {playlist.map((playlistItem) => (
                    <SortableItem
                      key={playlistItem.id}
                      id={playlistItem.id}
                      item={playlistItem.item}
                      isDesign={playlistItem.isDesign}
                      duration={playlistItem.duration}
                      onDurationChange={handleDurationChange}
                      onRemove={handleRemoveFromPlaylist}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-dark-4 dark:text-dark-6">
                Henüz medya eklenmedi. Tasarımlar veya Medya sekmesinden medya
                seçerek ekleyebilirsiniz.
              </p>
            </div>
          )}
          <p className="mt-2 text-xs text-dark-4 dark:text-dark-6">
            Medyaları sürükleyip bırakarak oynatma sırasını düzenleyebilirsiniz.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-stroke px-7.5 py-4 dark:border-stroke-dark">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sortmatic}
            onChange={(e) => setSortmatic(e.target.checked)}
            className="h-4 w-4 rounded border-stroke accent-primary"
          />
          <span className="text-sm font-medium text-dark dark:text-white">
            Sıramatik Kullan
          </span>
        </label>
        <div className="flex gap-3">
          <button
            onClick={onCancelAction}
            className="rounded-lg border border-stroke px-4 py-2 font-medium text-dark hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90"
          >
            Kaydet
          </button>
        </div>
      </div>

      {/* Fiyat Düzenleme Modal */}
      {editingPrice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Fiyat Güncelle
            </h3>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Yeni Fiyat
              </label>
              <input
                type="text"
                value={priceInputValue}
                onChange={(e) => setPriceInputValue(e.target.value)}
                placeholder="Fiyat girin (örn: 180)"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const newPrice = priceInputValue.trim() ? `₺${priceInputValue.trim()}` : editingPrice.currentPrice;
                    setTemplatePrices((prev) => ({
                      ...prev,
                      [editingPrice.templateId]: {
                        ...prev[editingPrice.templateId],
                        [editingPrice.itemId]: newPrice,
                      },
                    }));
                    setEditingPrice(null);
                    setPriceInputValue("");
                  } else if (e.key === "Escape") {
                    setEditingPrice(null);
                    setPriceInputValue("");
                  }
                }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const newPrice = priceInputValue.trim() ? `₺${priceInputValue.trim()}` : editingPrice.currentPrice;
                  setTemplatePrices((prev) => ({
                    ...prev,
                    [editingPrice.templateId]: {
                      ...prev[editingPrice.templateId],
                      [editingPrice.itemId]: newPrice,
                    },
                  }));
                  setEditingPrice(null);
                  setPriceInputValue("");
                }}
                className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90"
              >
                Kaydet
              </button>
              <button
                onClick={() => {
                  setEditingPrice(null);
                  setPriceInputValue("");
                }}
                className="flex-1 rounded-lg border border-stroke px-4 py-2 font-medium text-dark hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

