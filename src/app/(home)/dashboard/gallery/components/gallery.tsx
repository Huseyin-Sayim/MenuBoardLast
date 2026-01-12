"use client";

import { useState, useEffect, useRef, ChangeEvent, DragEvent } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type GalleryImage = {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  uploadedAt: string;
  duration: number;
};

interface GalleryProps {
  initialData: GalleryImage[];
  userRole: 'admin' | 'user';
  showActions?: boolean;
}
export const dynamic = "force-dynamic";

export function Gallery({ initialData, userRole, showActions = true }: GalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialData);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Galeri resimlerini yeniden yükle
  const refreshGallery = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const result = await response.json();
        const formattedData = (result.data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          type: 'image' as 'image' | 'video',
          url: item.url,
          uploadedAt: new Date(item.createdAt).toLocaleDateString("tr-TR"),
          duration: 0,
        }));
        setImages(formattedData);
      }
    } catch (error) {
      console.error('Galeri yenilenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Galeri resmini sil (SADECE ADMIN)
  const handleDelete = async (id: string) => {
    if (userRole !== 'admin') {
      alert('Bu işlem için yetkiniz yok');
      return;
    }

    if (!confirm('Bu resmi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Resmi listeden kaldır
        setImages(images.filter(img => img.id !== id));
        alert('Resim başarıyla silindi');
      } else {
        const result = await response.json();
        alert(result.error || 'Resim silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Resim silinirken hata:', error);
      alert('Resim silinirken bir hata oluştu');
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dosya seçildiğinde
  const handleFileSelect = (file: File) => {
    // Sadece resim dosyalarına izin ver
    if (!file.type.startsWith('image/')) {
      alert('Sadece resim dosyaları yüklenebilir!');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Input değiştiğinde
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Drag & Drop
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
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    } else {
      alert('Sadece resim dosyaları yüklenebilir!');
    }
  };

  // Dosya yükleme
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        // Başarılı
        setSelectedFile(null);
        setPreviewUrl("");
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setIsUploadModalOpen(false);
        await refreshGallery();
        alert('Resim başarıyla yüklendi!');
      } else {
        alert(result.error || result.details || 'Yükleme başarısız oldu');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Yükleme sırasında bir hata oluştu: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Modal kapatıldığında state'i temizle
  const handleCloseModal = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Başlık ve Admin Butonu */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Galeri
        </h2>
        {showActions && userRole === 'admin' && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
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
            Resim Ekle
          </button>
        )}
      </div>

      {/* Upload Modal (SADECE ADMIN) */}
      {isUploadModalOpen && userRole === 'admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-lg dark:bg-gray-dark">
            {/* Header */}
            <div className="border-b border-stroke px-6 py-4 dark:border-stroke-dark">
              <div className="flex items-center justify-between">
                <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
                  Galeriye Resim Ekle
                </h2>
                <button
                  onClick={handleCloseModal}
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

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Sol Taraf - Dosya Yükleme Alanı */}
                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Resim Seç
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleBrowseClick}
                    className={cn(
                      "relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all bg-gray-2 dark:bg-dark-2",
                      isDragging
                        ? "border-primary bg-primary/5 dark:border-primary dark:bg-primary/10"
                        : "border-stroke hover:border-primary dark:border-stroke-dark dark:hover:border-primary",
                      selectedFile && "border-primary dark:border-primary"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
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
                        Resmi buraya sürükleyip bırakın
                      </p>
                      <p className="text-xs text-dark-4 dark:text-dark-6">
                        veya resim seçmek için tıklayın
                      </p>
                      <p className="mt-2 text-xs text-dark-4 dark:text-dark-6">
                        PNG, JPG, GIF (Sadece resim dosyaları)
                      </p>
                      {selectedFile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            if (previewUrl) {
                              URL.revokeObjectURL(previewUrl);
                            }
                            setPreviewUrl("");
                          }}
                          className="mt-4 rounded-lg border border-stroke bg-white px-4 py-2 text-xs font-medium text-dark transition-all hover:bg-gray-100 dark:border-stroke-dark dark:bg-dark-3 dark:text-white dark:hover:bg-dark-3"
                        >
                          Resmi Değiştir
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
                  <div className="flex min-h-[300px] flex-col rounded-lg border border-stroke bg-gray-2 dark:border-stroke-dark dark:bg-dark-2">
                    {previewUrl ? (
                      <div className="flex flex-1 items-center justify-center p-4">
                        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white p-4 dark:bg-dark-3">
                          <img
                            src={previewUrl}
                            alt={selectedFile?.name || "Preview"}
                            className="max-h-full max-w-full rounded-lg object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-h-[300px] items-center justify-center py-12 text-center">
                        <p className="text-sm text-dark-4 dark:text-dark-6">
                          Resim seçildiğinde önizleme burada görünecek
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Butonları */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-stroke pt-6 dark:border-stroke-dark">
                <button
                  onClick={handleCloseModal}
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
        </div>
      )}

      {/* Galeri Grid - Admin için silme butonlu, User için sadece görüntüleme */}
      {/* Maksimum 3 satır göster (yan yana 6 fotoğraf), fazlası için scroll */}
      <div className="max-h-[450px] overflow-y-auto">
        <div className="grid grid-cols-6 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-stroke bg-gray-2 dark:border-stroke-dark dark:bg-dark-2"
            >
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
              {/* Silme Butonu - Sadece Admin için */}
              {showActions && userRole === 'admin' && (
                <button
                  onClick={() => handleDelete(image.id)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                  title="Sil"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {images.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-dark-4 dark:text-dark-6">
            Henüz galeri resmi bulunmamaktadır.
          </p>
        </div>
      )}
    </div>
  );
}