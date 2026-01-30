"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { MediaEditView } from "./media-edit-view";
import { MediaUploadView } from "./media-upload-view";
import { updateMediaName } from "@/services/mediaServices";

export type MediaItem = {
  id: string;
  name: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  startTime?: number;
  endTime?: number;
  duration?: number;
};

export const MEDIA_ITEMS: MediaItem[] = [

];

function VideoDuration({ url, itemId }: { url: string; itemId: string }) {
  const [duration, setDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        setDuration(Math.floor(video.duration));
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.src = url;
    video.load();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [url]);

  if (!duration) return null;

  return (
    <>
      <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
        {Math.floor(duration / 60)}:
        {String(duration % 60).padStart(2, "0")}
      </div>
      {/* Gizli video elementi - sadece süre almak için */}
      <video
        ref={videoRef}
        src={url}
        preload="metadata"
        className="hidden"
      />
    </>
  );
}

interface MediaGalleryProps {
  initialData: MediaItem[];
  showActions?: boolean;
  className?: string
  gridCols?: string;
  maxHeight?: string;
  disableClick?: boolean;
  selectionMode?: boolean;
  onImageSelect?: (imageUrl: string) => void;
}


export function MediaGallery({ showActions = true, className, initialData, gridCols = "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10", maxHeight, disableClick = false, selectionMode = false, onImageSelect }: MediaGalleryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialData);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "image" | "video">(selectionMode ? "image" : "all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // initialData değiştiğinde mediaItems'ı güncelle
  useEffect(() => {
    if (initialData && Array.isArray(initialData)) {
      setMediaItems(initialData);
      console.log('MediaGallery - initialData güncellendi:', initialData.length, 'item');
    }
  }, [initialData]);

  // Seçim modunda kategoriyi otomatik olarak "image" yap
  useEffect(() => {
    if (selectionMode) {
      setSelectedCategory("image");
    }
  }, [selectionMode]);

  const handleDelete = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleItemClick = (item: MediaItem) => {
    if (selectionMode && onImageSelect && item.type === "image") {
      // Seçim modunda: sadece image'ları seçilebilir yap ve callback çağır
      onImageSelect(item.url);
      return;
    }
    if (!disableClick) {
      setSelectedItem(item);
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  const handleUpdate = async (id: string, name: string) => {
    try {
      await updateMediaName(id, name);

      setMediaItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, name } : item))
      );

      setSelectedItem((prev) => (prev && prev.id === id ? { ...prev, name } : prev));

      console.log("DB ve State güncellendi!");
    } catch (error) {
      alert("Hata: İsim kaydedilemedi!");
    }
  };


  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = async () => {
    // Medya listesini yeniden yükle - sayfa yenilenecek
    window.location.reload();
  };




  // Upload modal açıksa upload view'ı göster (seçim modunda değilse)
  if (isUploadModalOpen && !selectionMode) {
    return (
      <MediaUploadView
        onCloseAction={() => setIsUploadModalOpen(false)}
        onUploadSuccessAction={handleUploadSuccess}
      />
    );
  }

  // Düzenleme modunda düzenleme ekranını göster (sadece click devre dışı değilse ve seçim modunda değilse)
  if (selectedItem && !disableClick && !selectionMode) {
    return (
      <MediaEditView
        selectedItem={selectedItem}
        allItems={mediaItems}
        onSelectAction={setSelectedItem}
        onDeleteAction={handleDelete}
        onUpdateAction={handleUpdate}
        onCloseAction={handleClose}
      />
    );
  }

  // Kategoriye göre filtreleme
  const filteredItems = selectionMode
    ? mediaItems.filter((item) => item.type === "image") // Seçim modunda sadece image'ları göster
    : selectedCategory === "all"
      ? mediaItems
      : mediaItems.filter((item) => item.type === selectedCategory);

  console.log('MediaGallery - filteredItems:', filteredItems.length, 'item (selectionMode:', selectionMode, ', category:', selectedCategory, ')');

  // Normal modda galeri görünümünü göster
  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card h-[75vh] overflow-y-auto flex flex-col">
      {/* Başlık bölümü - seçim modunda gizle */}
      {!selectionMode && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Medya
          </h2>
          {showActions && (
            <button
              onClick={handleUploadClick}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-primary/90 active:scale-95"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              Medya Ekle
            </button>
          )}
        </div>
      )}

      {/* Kategori Filtreleri - Seçim modunda gizle */}
      {!selectionMode && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                selectedCategory === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-2 text-dark-4 hover:bg-gray-3 dark:bg-dark-2 dark:text-dark-6 dark:hover:bg-dark-3"
              )}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedCategory("image")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                selectedCategory === "image"
                  ? "bg-primary text-white"
                  : "bg-gray-2 text-dark-4 hover:bg-gray-3 dark:bg-dark-2 dark:text-dark-6 dark:hover:bg-dark-3"
              )}
            >
              Fotoğraf
            </button>
            <button
              onClick={() => setSelectedCategory("video")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                selectedCategory === "video"
                  ? "bg-primary text-white"
                  : "bg-gray-2 text-dark-4 hover:bg-gray-3 dark:bg-dark-2 dark:text-dark-6 dark:hover:bg-dark-3"
              )}
            >
              Video
            </button>
          </div>
        </div>
      )}

      <div className={cn("flex-1 flex flex-col", maxHeight && "overflow-y-auto media-gallery-scrollbar")} style={maxHeight ? { maxHeight } : undefined}>
        {filteredItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-dark-4 dark:text-dark-6">
              {selectedCategory === "all"
                ? "Henüz tasarım yüklenmemiş."
                : selectedCategory === "image"
                  ? "Henüz fotoğraf yüklenmemiş."
                  : "Henüz video yüklenmemiş."}
            </p>
          </div>
        ) : (
          <div className={`grid ${gridCols} gap-4`}>
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="group relative overflow-hidden rounded-lg border border-stroke text-left transition-all hover:border-primary dark:border-stroke-dark dark:hover:border-primary"
              >
                <div className="relative aspect-square w-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  {item.type === "video" ? (
                    <>
                      {/* VİDEO İÇİN: Kırık görsel yerine gradyan renk basıyoruz */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/30" />

                      {/* Video İkonu */}
                      <div className="relative z-10">
                        <svg
                          className="size-8 text-primary/40 group-hover:text-primary/60 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>

                      {/* Video Süresi */}
                      <VideoDuration url={item.url} itemId={item.id} />
                    </>
                  ) : (
                    /* FOTOĞRAF İÇİN: Normal img etiketi - doğrudan URL kullanılıyor */
                    <img
                      src={item.url}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>

                {/* Bilgi Alanı */}
                <div className="border-t border-stroke bg-white px-3 py-2 dark:border-stroke-dark dark:bg-gray-dark">
                  <p className="capitalize truncate text-sm font-medium text-dark dark:text-white">
                    {item.name.length > 25 ? `Medya - ${item.id.slice(0, 4)}` : item.name}
                  </p>
                  <p className="text-xs text-dark-4 dark:text-dark-6">
                    {item.uploadedAt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

