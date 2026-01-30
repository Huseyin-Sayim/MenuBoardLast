// "use client";

import { TrashIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { deleteMedia } from "@/services/mediaServices";
import Image from "next/image";

type MediaItem = {
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

type MediaEditViewProps = {
  selectedItem: MediaItem;
  allItems: MediaItem[];
  onSelectAction: (item: MediaItem) => void;
  onDeleteAction: (id: string) => void;
  onUpdateAction: (
    id: string,
    name: string,
    startTime?: number,
    endTime?: number,
  ) => void;
  onCloseAction: () => void;
};

export function MediaEditView({
  selectedItem,
  allItems,
  onSelectAction,
  onDeleteAction,
  onUpdateAction,
  onCloseAction,
}: MediaEditViewProps) {
  const [selectedItems, setSelectedItem] = useState<MediaItem | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(allItems);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState(selectedItem.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingTrim, setIsEditingTrim] = useState(false);
  const [startTime, setStartTime] = useState(
    selectedItem.startTime ?? 0,
  );
  const [endTime, setEndTime] = useState(
    selectedItem.endTime ?? selectedItem.duration ?? 30,
  );
  const [startTimeInput, setStartTimeInput] = useState(
    String(selectedItem.startTime ?? 0),
  );
  const [endTimeInput, setEndTimeInput] = useState(
    String(selectedItem.endTime ?? selectedItem.duration ?? 30),
  );
  const [actualVideoDuration, setActualVideoDuration] = useState<number | null>(
    selectedItem.duration ?? null,
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  // Seçili tasarım değiştiğinde input'u güncelle
  useEffect(() => {
    setEditedName(selectedItem.name);
    setIsEditingName(false); // Yeni tasarım seçildiğinde düzenleme modunu kapat
    setIsEditingTrim(false); // Yeni tasarım seçildiğinde kırpma düzenleme modunu kapat
    const newStartTime = selectedItem.startTime ?? 0;
    // Eğer gerçek video süresi varsa onu kullan, yoksa selectedItem.duration veya 30
    const maxDuration = actualVideoDuration ?? selectedItem.duration ?? 30;
    const newEndTime = selectedItem.endTime ?? maxDuration;
    setStartTime(newStartTime);
    setEndTime(newEndTime);
    setStartTimeInput(String(newStartTime));
    setEndTimeInput(String(newEndTime));
  }, [selectedItem.id, selectedItem.startTime, selectedItem.endTime, selectedItem.duration, actualVideoDuration]);

  // Video zaman ayarları değiştiğinde video'yu güncelle
  useEffect(() => {
    if (selectedItem.type === "video" && videoRef.current) {
      const video = videoRef.current;
      // Video yüklüyse ve currentTime kırpma aralığının dışındaysa düzelt
      if (video.readyState >= 2) {
        if (video.currentTime < startTime || video.currentTime > endTime) {
          video.currentTime = startTime;
        }
      }
    }
  }, [startTime, endTime, selectedItem.type]);

  // ESC tuşu ile düzenleme modunu veya tüm ekranı kapat
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isEditingName) {
          // Eğer isim düzenleme modu açıksa, önce onu kapat
          setEditedName(selectedItem.name); // Değişiklikleri geri al
          setIsEditingName(false);
        } else if (isEditingTrim) {
          // Eğer kırpma düzenleme modu açıksa, önce onu kapat
          const originalStartTime = selectedItem.startTime ?? 0;
          const originalEndTime =
            selectedItem.endTime ?? selectedItem.duration ?? 30;
          setStartTime(originalStartTime);
          setEndTime(originalEndTime);
          setStartTimeInput(String(originalStartTime));
          setEndTimeInput(String(originalEndTime));
          setIsEditingTrim(false);
        } else {
          // Düzenleme modu kapalıysa, tüm ekranı kapat
          onCloseAction();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditingName, isEditingTrim, selectedItem.name, selectedItem.startTime, selectedItem.endTime, selectedItem.duration, onCloseAction]);

  const handleDelete = async (id: string) => {
    if (deleteConfirmId === id) {
      onDeleteAction(id);
      await deleteMedia(id);
      setDeleteConfirmId(null);
      // Eğer silinen tasarım seçili tasarımsa, ilk tasarıma geç
      if (id === selectedItem.id && allItems.length > 1) {
        const remainingItems = allItems.filter((item) => item.id !== id);
        if (remainingItems.length > 0) {
          onSelectAction(remainingItems[0]);
        }
      }
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };





  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stroke px-7.5 py-4 dark:border-stroke-dark">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Tasarımlarım
        </h2>
        <button
          onClick={onCloseAction}
          className="rounded-lg p-2 hover:bg-gray-2 dark:hover:bg-dark-2"
          aria-label="Kapat"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-dark-4 dark:text-dark-6"
          >
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="grid gap-6 p-7.5 md:grid-cols-2">
        {/* Sol taraf - Seçili Tasarım Önizleme */}
        <div className="flex flex-col">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Önizleme
          </h3>
          <div className="flex-1 rounded-lg border-4 border-gray-4 bg-gray-2 p-4 dark:border-dark-3 dark:bg-dark-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-white shadow-lg">
              {selectedItem.type === "video" ? (
                <video
                  ref={videoRef}
                  src={selectedItem.url}
                  className="h-full w-full object-cover"
                  controls
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
                      // Video gerçek süresini kaydet
                      setActualVideoDuration(video.duration);
                      // Eğer endTime video süresinden büyükse, video süresine ayarla
                      if (endTime > video.duration) {
                        setEndTime(video.duration);
                        setEndTimeInput(String(video.duration));
                      }
                      // Video yüklendiğinde başlangıç zamanına ayarla
                      video.currentTime = Math.min(startTime, video.duration);
                    }
                  }}
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    // Video bitiş zamanını geçerse başa sar ve durdur
                    if (video.currentTime >= endTime) {
                      video.pause();
                      video.currentTime = startTime;
                    }
                    // Video başlangıç zamanının altına düşerse başlangıç zamanına ayarla
                    if (video.currentTime < startTime && video.currentTime > 0) {
                      video.currentTime = startTime;
                    }
                  }}
                  onSeeked={(e) => {
                    const video = e.currentTarget;
                    // Kullanıcı seek yaptığında kırpma aralığının dışındaysa düzelt
                    if (video.currentTime < startTime) {
                      video.currentTime = startTime;
                    } else if (video.currentTime > endTime) {
                      video.currentTime = endTime;
                    }
                  }}
                  onPlay={(e) => {
                    const video = e.currentTarget;
                    // Oynatma başladığında eğer başlangıç zamanının dışındaysa düzelt
                    if (video.currentTime < startTime) {
                      video.currentTime = startTime;
                    } else if (video.currentTime > endTime) {
                      video.currentTime = startTime;
                    }
                  }}
                />
              ) : (
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {/* Tasarım Adı ve Düzenle Butonu */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-dark dark:text-white">
                    Tasarım Adı
                  </p>
                  {!isEditingName && (
                    <p className="capitalize text-sm text-dark-4 dark:text-dark-6">
                      {selectedItem.name}
                    </p>
                  )}
                </div>
                {!isEditingName && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="rounded-lg border border-stroke px-3 py-1.5 text-sm font-medium text-dark transition-all hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2"
                  >
                    Düzenle
                  </button>
                )}
              </div>

              {/* Input Alanı - Sadece düzenleme modunda görünür */}
              {isEditingName && (
                <div className="flex flex-col gap-2">
                  <input
                    id="design-name-input"
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="capitalize w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    placeholder="Tasarım adını girin"
                    autoFocus
                  />
                  <div className="capitalize flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (editedName.trim() && editedName !== selectedItem.name) {
                          if (selectedItem.type === "video") {
                            onUpdateAction(
                              selectedItem.id,
                              editedName.trim(),
                              startTime,
                              endTime,
                            );
                          } else {
                            onUpdateAction(selectedItem.id, editedName.trim());
                          }
                        }
                        setIsEditingName(false);
                      }}
                      className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-primary/90 active:scale-95"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => {
                        setEditedName(selectedItem.name); // Değişiklikleri geri al
                        setIsEditingName(false);
                      }}
                      className="rounded-lg border border-stroke px-3 py-1.5 text-sm font-medium text-dark transition-all hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-dark-4 dark:text-dark-6">
                Yüklenme Tarihi: {selectedItem.uploadedAt}
              </p>
            </div>
          </div>
        </div>

        {/* Sağ taraf - Yüklenen Tasarımlar Listesi */}
        <div className="flex flex-col">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            Yüklenen Tasarımlar
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-2">
            {allItems.map((item) => {
              const isSelected = item.id === selectedItem.id;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "relative flex items-center gap-4 rounded-lg border-2 p-4 transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-stroke hover:border-primary/50 dark:border-stroke-dark dark:hover:border-primary/50 cursor-pointer"
                  )}
                  onClick={() => !isSelected && onSelectAction(item)}
                >
                  <div className="capitalize relative h-20 w-32 shrink-0 overflow-hidden rounded-lg">
                    {item.type === "video" ? (
                      <>
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/30" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <svg
                            className="size-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="capitalize font-medium text-dark dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-xs text-dark-4 dark:text-dark-6">
                      {item.uploadedAt}
                    </p>
                    {isSelected && (
                      <span className="text-sm text-primary">Seçili</span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="shrink-0">
                      <div className="size-5 rounded-full bg-primary" />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="relative shrink-0 rounded-lg p-2 text-red transition-all hover:bg-red/10 dark:hover:bg-red/20"
                    aria-label="Sil"
                  >
                    <TrashIcon className="size-5" />
                    {deleteConfirmId === item.id && (
                      <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-red px-2.5 py-1 text-xs font-medium text-white shadow-lg">
                        Tekrar tıklayın
                        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-red"></div>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 border-t border-stroke px-7.5 py-4 dark:border-stroke-dark">
        <button
          onClick={onCloseAction}
          className="rounded-lg border border-stroke px-4 py-2 font-medium text-dark hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}

