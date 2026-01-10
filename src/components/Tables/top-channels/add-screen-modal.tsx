"use client";

import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import Cookies from "js-cookie";

type AddScreenModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export function AddScreenModal({ onClose, onSuccess }: AddScreenModalProps) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    setError(null);

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setError("Lütfen 6 haneli kodu girin");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = Cookies.get('accessToken');
      const response = await fetch("/api/screens/device", {
        method: "POST",
        headers: {
          "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (response.ok && result.newScreen) {
        onSuccess();
        onClose();
      } else {
        setError(result.message || "Ekran eklenirken bir hata oluştu");
      }
    } catch (error: any) {
      console.error("Add screen error:", error);
      setError("Ekran eklenirken bir hata oluştu: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Sadece rakamları al
    if (value.length <= 6) {
      setCode(value);
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {/* Header */}
        <div className="border-b border-stroke px-7.5 py-4 dark:border-stroke-dark">
          <div className="flex items-center justify-between">
            <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
              Ekran Ekle
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-7.5">
          <InputGroup
            label="6 Haneli Kod"
            type="text"
            placeholder="000000"
            required
            value={code}
            onChange={handleCodeChange}
            className="mb-6"
          />

          {error && (
            <div className="mb-4 rounded-lg bg-red/10 border border-red/20 px-4 py-3 text-sm text-red dark:text-red-400">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-stroke px-4 py-2 font-medium text-dark hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2 disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || code.length !== 6}
              className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Ekleniyor..." : "Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

