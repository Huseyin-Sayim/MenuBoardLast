"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { MediaEditView } from "./media-edit-view";
import { MediaUploadView } from "./media-upload-view";
import {updateMediaName} from "@/services/mediaServices";

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
  initialData : MediaItem[];
}

export function MediaGallery({initialData} : MediaGalleryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialData);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "image" | "video">("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item);
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




  // Upload modal açıksa upload view'ı göster
  if (isUploadModalOpen) {
    return (
      <MediaUploadView
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    );
  }

  // Düzenleme modunda düzenleme ekranını göster
  if (selectedItem) {
    return (
      <MediaEditView
        selectedItem={selectedItem}
        allItems={mediaItems}
        onSelect={setSelectedItem}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onClose={handleClose}
      />
    );
  }

  // Kategoriye göre filtreleme
  const filteredItems =
    selectedCategory === "all"
      ? mediaItems
      : mediaItems.filter((item) => item.type === selectedCategory);

  // Normal modda galeri görünümünü göster
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-stroke px-7.5 py-4 dark:border-stroke-dark">
        <div className="flex items-center justify-between">
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Medya
          </h2>
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90 active:scale-95"
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Yeni Medya Ekle
          </button>
        </div>
      </div>

      {/* Kategori Filtreleri */}
      <div className="border-b border-stroke px-7.5 py-4 dark:border-stroke-dark">
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

      <div className="p-7.5">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-dark-4 dark:text-dark-6">
              {selectedCategory === "all"
                ? "Henüz tasarım yüklenmemiş"
                : selectedCategory === "image"
                  ? "Henüz fotoğraf yüklenmemiş"
                  : "Henüz video yüklenmemiş"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
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
                    /* FOTOĞRAF İÇİN: Normal Image */
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Bilgi Alanı */}
                <div className="border-t border-stroke bg-white px-3 py-2 dark:border-stroke-dark dark:bg-gray-dark">
                  <p className="truncate text-sm font-medium text-dark dark:text-white">
                    {/* Eğer isim UUID ise (çok uzun ve tireliyse) daha düzgün bir şey göster */}
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

