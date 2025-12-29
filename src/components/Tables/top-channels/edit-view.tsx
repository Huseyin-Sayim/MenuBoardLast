"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
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

type MenuBoardDesign = {
  id: string;
  name: string;
  preview: string;
  isActive: boolean;
  type: "image" | "video";
};

type EditViewProps = {
  screenName: string;
  initialMedia: MediaItem[];
  initialPlaylist?: Array<{ id: string; item: MediaItem | MenuBoardDesign; isDesign: boolean }>;
  currentDesign?: string;
  currentStatus?: "Aktif" | "Pasif";
  currentLocation?: string;
  screenWidth?: number;
  screenHeight?: number;
  onSave: (designId: string, status: "Aktif" | "Pasif", location: string, playlist: Array<{ id: string; item: MediaItem | MenuBoardDesign; isDesign: boolean }>, screenConfig: ScreenConfig[]) => void;
  onCancel: () => void;
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
  onRemove: (id: string) => void;
};

function SortableItem({ id, item, isDesign, onRemove }: SortableItemProps) {
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

  const thumbnail = isDesign
    ? (item as MenuBoardDesign).preview
    : (item as MediaItem).thumbnail || (item as MediaItem).url;

  const name = isDesign
    ? (item as MenuBoardDesign).name
    : (item as MediaItem).name;

  const type = isDesign
    ? (item as MenuBoardDesign).type
    : (item as MediaItem).type;

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
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded">
        <Image
          src={thumbnail}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="w-24 shrink-0">
        <p className="truncate text-xs font-medium text-dark dark:text-white">
          {name}
        </p>
        <p className="text-[10px] text-dark-4 dark:text-dark-6">
          {type === "video" ? "Video" : "Görsel"}
        </p>
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
  mediaId: string;
  mediaIndex: number
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
  onSave,
  onCancel,
}: EditViewProps) {
  const [displayName, setDisplayName] = useState<string>("Yükleniyor...");
  const [selectedDesign, setSelectedDesign] = useState(currentDesign);
  const [selectedStatus, setSelectedStatus] = useState<"Aktif" | "Pasif">(currentStatus);
  const [selectedLocation, setSelectedLocation] = useState<string>(currentLocation);
  // TODO: DB bağlandıktan sonra katalog tasarımlarını API'den çek
  const [designs, setDesigns] = useState(mockMenuBoardDesigns);
  const [activeTab, setActiveTab] = useState<"tasarim" | "medya">("tasarim");
  // TODO: DB bağlandıktan sonra kullanıcının satın aldığı medyaları API'den doldur
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia);
  const [designCategory, setDesignCategory] = useState<"all" | "image" | "video">("all");
  const [mediaCategory, setMediaCategory] = useState<"all" | "image" | "video">("all");
  const [purchasedDesignIds, setPurchasedDesignIds] = useState<string[]>([]);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [readyScreenConfig, setReadyScreenConfig] = useState<ScreenConfig[]>([]);
  // Playlist: Seçilen medyaların sıralı listesi
  const [playlist, setPlaylist] = useState<Array<{ id: string; item: MediaItem | MenuBoardDesign; isDesign: boolean }>>(initialPlaylist);

  // initialPlaylist prop'u değiştiğinde playlist state'ini güncelle (sadece playlist boşsa)
  useEffect(() => {
    if (initialPlaylist && initialPlaylist.length > 0 && playlist.length === 0) {
      setPlaylist(initialPlaylist);
    }
  }, [initialPlaylist, playlist.length]);

  useEffect(() => {
    const formattedConfig: ScreenConfig[] = playlist.map((item, index) => ({
      screenId: screenName,
      mediaId: item.item.id,
      mediaIndex: index + 1
    }));

    console.log(playlist);

    console.log("Tertemiz Config:", formattedConfig);
    setReadyScreenConfig(formattedConfig);

  }, [playlist, screenName]);

  useEffect(() => {
    const fetchName = async () => {
      try {

      const data = await getScreenName(screenName)

      if (data && data.name) {
        setDisplayName(data.name)
      }
      } catch (err: any) {
        throw new Error(`Screen name getirilirken hata oluştu: ${err.message}`)
      }
    }
    if (screenName) {
      fetchName()
    }
  }, [screenName]);

  const aspectRatio = calculateAspectRatio(screenWidth, screenHeight);
  const isPortrait = screenHeight > screenWidth;
  const maxHeight = isPortrait ? '400px' : 'none';

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeDesign = designs.find((d) => d.id === selectedDesign);
  const activeMedia = selectedMediaId
    ? mediaItems.find((m) => m.id === selectedMediaId)
    : null;
  const previewImage = activeMedia
    ? activeMedia.thumbnail || activeMedia.url
    : activeDesign?.preview;

  const handleDesignSelect = (designId: string) => {
    setSelectedDesign(designId);
    setSelectedMediaId(null);
    setDesigns((prev) =>
      prev.map((d) => ({ ...d, isActive: d.id === designId }))
    );
    // Tasarımlar sekmesinden playlist'e ekleme yapılmaz
    // Sadece önizleme için seçilir
  };

  const handleMediaSelect = (mediaId: string) => {
    setSelectedMediaId(mediaId);
    // designId'yi de dolduralım ki kaydettiğimizde hangi içerik seçildiğini bilelim
    setSelectedDesign(`media-${mediaId}`);

    // Playlist'e ekle (eğer yoksa)
    const media = mediaItems.find((m) => m.id === mediaId);
    if (media && !playlist.find((p) => p.id === `media-${mediaId}`)) {
      setPlaylist((prev) => [...prev, { id: `media-${mediaId}`, item: media, isDesign: false }]);
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
    if (selectedDesign === id || selectedDesign === `media-${id}` || selectedMediaId === id) {
      setSelectedDesign(currentDesign);
      setSelectedMediaId(null);
    }
  };

  // Tasarımı satın alıp Medya sekmesine ekle
  const handlePurchaseDesign = (design: MenuBoardDesign) => {
    // Zaten satın alındıysa sadece Medya sekmesine geç
    if (purchasedDesignIds.includes(design.id)) {
      const existingMedia = mediaItems.find((m) => m.id === `design-${design.id}`);
      setActiveTab("medya");
      if (existingMedia) {
        setSelectedMediaId(existingMedia.id);
      }
      return;
    }

    // TODO: DB bağlandıktan sonra burada satın alma API çağrısı yap
    const newMedia: MediaItem = {
      id: `design-${design.id}`, // DB tarafında gerçek id ile değiştirilecek
      name: design.name,
      type: "image",
      url: design.preview,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };

    setMediaItems((prev) => [...prev, newMedia]);
    setPurchasedDesignIds((prev) => [...prev, design.id]);
    setActiveTab("medya");
    setSelectedMediaId(newMedia.id);
  };

  const filteredMediaItems =
    mediaCategory === "all"
      ? mediaItems
      : mediaItems.filter((m) => m.type === mediaCategory);

  const handleSave = () => {

    onSave(selectedDesign, selectedStatus, selectedLocation, playlist, readyScreenConfig);
    // TODO: DB bağlandıktan sonra burada playlist sırasını API'ye kaydet

  };




  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stroke px-7.5 py-4 dark:border-stroke-dark">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">

        </h2>
      </div>

      {/* Content */}
      <div className="grid gap-6 p-7.5 md:grid-cols-2">
        {/* Sol taraf - TV Preview ve Durum */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Önizleme
            </h3>
            <div 
              className="flex-1 rounded-lg border-[1.5px] p-4 bg-[#F3F3FE] border-[#F3F3FE] dark:bg-dark-3 dark:border-dark-3"
            >
              <div 
                className="relative w-full overflow-hidden rounded-lg bg-[#e5e5fb] dark:bg-dark-2 shadow-lg"
                style={{ 
                  aspectRatio: aspectRatio,
                  maxHeight: maxHeight,
                  width: isPortrait ? 'auto' : '100%',
                  margin: isPortrait ? '0 auto' : '0'
                }}
              >
                {previewImage && (
                  <Image
                    src={previewImage}
                    alt={activeMedia?.name || activeDesign?.name || "Önizleme"}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Ekran Konumu */}
          <div className="flex flex-col">
            <p className="capitalize d-flex mb-3 text-lg font-semibold text-dark dark:text-white">
             <span>Ekran Adı: </span><span className=" text-body-M text-primary font-bold"  >{displayName} </span>
            </p>
          </div>
        </div>

        {/* Sağ taraf - Tasarımlar / Medya sekmeleri */}
        <div className="flex flex-col">
          {/* Sekmeler */}
          <div className="ml-[-4px] flex gap-2 px-1 ">
            <button
              type="button"
              onClick={() => setActiveTab("tasarim")}
              className={cn(
                "w-32 -mr-4 rounded-t-lg border border-b-0 px-4 py-2 text-sm font-medium transition-all text-dark dark:text-white bg",
                activeTab === "tasarim"
                  ? "text-dark dark:text-white bg-[#F3F3FE] dark:bg-dark-2"
                  :"dark:text-primary",
                "border-[#b3b3b3] dark:border-stroke-dark"
              )}
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 92% 50%, 100% 100%, 0% 100%)"
              }}
            >
            Medya
            </button>
          </div>

          {/* Content kutusu */}
          <div
            className="pt-5 flex-1 rounded-b-lg border border-t-0 p-4 bg-[#F3F3FE] border-[#b3b3b3] dark:bg-dark-2 dark:border-stroke-dark rounded-tr-lg"
          >
              <>
                {/* Medya kategorileri */}
                <div className="flex gap-2 pb-3 mt-1">
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

                <div className="mt-3 flex-1 max-h-[460px] pr-2 design-scrollbar">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3" style={{padding:'10px'}}>
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
          </div>
        </div>
      </div>

      {/* Playlist - Oynatma Sırası */}
      <div className="border-t border-stroke px-7.5 py-4 dark:border-stroke-dark">
        <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">
          Oynatma Sırası
        </h3>
        <div 
          className="rounded-lg border border-stroke p-4 bg-[#F3F3FE] dark:bg-dark-2 dark:border-stroke-dark"
        >
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
                <div className="flex gap-3 overflow-x-auto pb-2 design-scrollbar">
                  {playlist.map((playlistItem) => (
                    <SortableItem
                      key={playlistItem.id}
                      id={playlistItem.id}
                      item={playlistItem.item}
                      isDesign={playlistItem.isDesign}
                      onRemove={handleRemoveFromPlaylist}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-dark-4 dark:text-dark-6">
                Henüz medya eklenmedi. Tasarımlar veya Medya sekmesinden medya seçerek ekleyebilirsiniz.
              </p>
            </div>
          )}
          <p className="mt-2 text-xs text-dark-4 dark:text-dark-6">
            Medyaları sürükleyip bırakarak oynatma sırasını düzenleyebilirsiniz.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-stroke px-7.5 py-4 dark:border-stroke-dark">
        <button
          onClick={onCancel}
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
  );
}

