"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Cookies from "js-cookie";

type MediaUploadViewProps = {
  onClose: () => void;
  onUploadSuccess: () => void;
};

export function MediaUploadView({ onClose, onUploadSuccess }: MediaUploadViewProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isVideo = selectedFile?.type.startsWith("video/");

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name.split(".").slice(0, -1).join(".")); // Extension'ı kaldır
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const userCookie = Cookies.get("user");
    if (!userCookie) {
      alert("Kullanıcı oturumu bulunamadı");
      return;
    }

    const user = JSON.parse(userCookie) as { id: string };
    const userId = user.id;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", userId);

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.data) {
        onUploadSuccess();
      } else {
        alert(result.error || result.details || "Yükleme başarısız oldu");
        setIsUploading(false);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Yükleme sırasında bir hata oluştu: " + error.message);
      setIsUploading(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header */}
      <div className="border-b border-stroke px-7.5 py-4 dark:border-stroke-dark">
        <div className="flex items-center justify-between">
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Yeni Medya Ekle
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg p-2 text-dark-4 transition-all hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-2 dark:hover:text-white"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-7.5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Sol Taraf - Dosya Yükleme Alanı */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Dosya Seç
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
              className={cn(
                "relative flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all bg-[#F3F3FE] dark:bg-dark-2",
                isDragging
                  ? "border-primary bg-primary/5 dark:border-primary dark:bg-primary/10"
                  : "border-[#b3b3b3] hover:border-primary dark:border-stroke-dark dark:hover:border-primary",
                selectedFile && "border-primary dark:border-primary"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center px-4 text-center">
                <svg
                  className="mb-4 size-12 text-dark-4 dark:text-dark-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-2 text-sm font-medium text-dark dark:text-white">
                  Dosyayı buraya sürükleyip bırakın
                </p>
                <p className="text-xs text-dark-4 dark:text-dark-6">
                  veya dosya seçmek için tıklayın
                </p>
                <p className="mt-2 text-xs text-dark-4 dark:text-dark-6">
                  PNG, JPG, GIF, MP4, WebM (Max 100MB)
                </p>
                {selectedFile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setFileName("");
                      setPreviewUrl("");
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                      }
                    }}
                    className="mt-4 rounded-lg border border-stroke bg-white px-4 py-2 text-xs font-medium text-dark transition-all hover:bg-gray-100 dark:border-stroke-dark dark:bg-dark-3 dark:text-white dark:hover:bg-dark-3"
                  >
                    Dosyayı Değiştir
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Önizleme */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Önizleme
            </label>
            <div className="flex min-h-[400px] flex-col rounded-lg border border-[#b3b3b3] bg-[#F3F3FE] dark:border-stroke-dark dark:bg-dark-2">
              {previewUrl ? (
                <>
                  <div className="flex flex-1 items-center justify-center p-4">
                    {isVideo ? (
                      <video
                        src={previewUrl}
                        controls
                        className="max-h-[350px] w-full rounded-lg object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white p-4 dark:bg-dark-3">
                        <img
                          src={previewUrl}
                          alt={selectedFile?.name || "Preview"}
                          className="max-h-[350px] max-w-full rounded-lg object-contain"
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center py-12 text-center">
                  <p className="text-sm text-dark-4 dark:text-dark-6">
                    Dosya seçildiğinde önizleme burada görünecek
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dosya Adı Input - Alt Kısım */}
        {selectedFile && (
          <div className="mt-6">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              Dosya Adı
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Dosya adını girin..."
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary placeholder:text-dark-6"
            />
          </div>
        )}

        {/* Footer Butonları */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-stroke pt-6 dark:border-stroke-dark">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="rounded-lg border border-stroke px-6 py-2.5 text-sm font-medium text-dark transition-all hover:bg-gray-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2"
          >
            İptal
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                Yükleniyor...
              </>
            ) : (
              "Yükle"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
