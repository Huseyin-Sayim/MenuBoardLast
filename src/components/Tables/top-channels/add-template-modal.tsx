// "use client";

import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";

type AddTemplateModalProps = {
  onCloseAction: () => void;
  onSuccessAction: () => void;
};

export function AddTemplateModal({ onCloseAction, onSuccessAction }: AddTemplateModalProps) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [component, setComponent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !path.trim() || !component.trim()) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, path, component }),
      });

      const result = await response.json();

      if (response.ok && result.data) {
        onSuccessAction();
        onCloseAction();
      } else {
        setError(result.message || "Şablon eklenirken bir hata oluştu");
      }
    } catch (error: any) {
      console.error("Add template error:", error);
      setError("Şablon eklenirken bir hata oluştu: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {/* Header */}
        <div className="border-b border-stroke px-7.5 py-4 dark:border-stroke-dark">
          <div className="flex items-center justify-between">
            <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
              Şablon Ekle
            </h2>
            <button
              onClick={onCloseAction}
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
            label="Şablon Adı"
            type="text"
            placeholder="Örn: Şablon 1"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-6"
          />

          <InputGroup
            label="Path"
            type="text"
            placeholder="Örn: /design/template-1"
            required
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="mb-6"
          />

          <InputGroup
            label="Component"
            type="text"
            placeholder="Örn: template-1"
            required
            value={component}
            onChange={(e) => setComponent(e.target.value)}
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
              onClick={onCloseAction}
              disabled={isSubmitting}
              className="rounded-lg border border-stroke px-4 py-2 font-medium text-dark hover:bg-gray-2 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2 disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !path.trim() || !component.trim()}
              className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

