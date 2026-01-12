// "use client";

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
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isVideo = selectedFile?.type.startsWith("video/");

  const handleFileSelect = (file: File) => {
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      alert(`Dosya boyutu çok büyük! Max: 500MB. Seçilen: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    setSelectedFile(file);
    // Dosya adını ilk seçildiğinde inputa doldur (uzantısız)
    setFileName(file.name.split(".").slice(0, -1).join("."));
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError("");
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // Cookie'den kullanıcıyı al
    const userCookie = Cookies.get("user");
    if (!userCookie) {
      setUploadError("Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    let userId = "";
    try {
      const user = JSON.parse(userCookie);
      userId = user.id;
    } catch (e) {
      setUploadError("Kullanıcı bilgisi okunamadı.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError("");

    abortControllerRef.current = new AbortController();

    try {
      const xhr = new XMLHttpRequest();

      // Progress Takibi
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              resolve({ success: true });
            }
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.error || err.details || "Yükleme başarısız"));
            } catch (e) {
              reject(new Error(`Hata kodu: ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Ağ hatası oluştu")));
        xhr.addEventListener("abort", () => reject(new Error("Yükleme iptal edildi")));

        // Zaman aşımı (10 dakika)
        xhr.timeout = 600000;
        xhr.addEventListener("timeout", () => reject(new Error("Zaman aşımı!")));

        // KRİTİK NOKTA: URL'ye userId, Header'a dosya adı
        // Input'taki güncel fileName'i kullanıyoruz
        const finalFileName = `${fileName}${selectedFile.name.substring(selectedFile.name.lastIndexOf('.'))}`;

        xhr.open("POST", `/api/media?userId=${userId}`, true);
        xhr.setRequestHeader("x-file-name", encodeURIComponent(finalFileName));
        xhr.setRequestHeader("Content-Type", selectedFile.type);

        // FormData DEĞİL, doğrudan dosyayı gönder
        xhr.send(selectedFile);
      });

      const result = await uploadPromise;
      setUploadProgress(100);
      onUploadSuccess();

    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Bir hata oluştu");
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsUploading(false);
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-stroke px-7.5 py-4 dark:border-stroke-dark">
        <div className="flex items-center justify-between">
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">Yeni Medya Ekle</h2>
          <button onClick={onClose} className="p-2 text-dark-4 hover:text-dark">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-7.5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Dropzone */}
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileSelect(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all bg-[#F3F3FE] dark:bg-dark-2",
                isDragging ? "border-primary bg-primary/5" : "border-[#b3b3b3] hover:border-primary"
              )}
            >
              <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }} className="hidden" />
              <div className="text-center px-4">
                <p className="text-sm font-medium">Dosyayı sürükleyin veya tıklayın</p>
                <p className="text-xs text-dark-4 mt-1">PNG, JPG, MP4 (Max 500MB)</p>
                {selectedFile && <p className="mt-2 text-primary text-xs">Seçildi: {selectedFile.name}</p>}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-[#b3b3b3] bg-[#F3F3FE] dark:bg-dark-2 p-4">
            {previewUrl ? (
              isVideo ? (
                <video src={previewUrl} controls className="max-h-[300px] rounded" />
              ) : (
                <img src={previewUrl} className="max-h-[300px] rounded object-contain" />
              )
            ) : (
              <p className="text-sm text-dark-4">Önizleme yok</p>
            )}
          </div>
        </div>

        {selectedFile && (
          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium">Dosya Adı</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none focus:border-primary"
            />
          </div>
        )}

        {isUploading && (
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs">
              <span>Yükleniyor...</span>
              <span>%{uploadProgress}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-2">
              <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {uploadError && <div className="mt-4 text-sm text-red-500">{uploadError}</div>}

        <div className="mt-6 flex justify-end gap-3 border-t pt-6">
          <button onClick={onClose} className="px-6 py-2 text-sm border rounded-lg">İptal</button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="bg-primary text-white px-6 py-2 text-sm rounded-lg disabled:opacity-50"
          >
            {isUploading ? `Yükleniyor (%${uploadProgress})` : "Yüklemeyi Başlat"}
          </button>
        </div>
      </div>
    </div>
  );
}