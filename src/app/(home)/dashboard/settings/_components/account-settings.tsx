"use client";

import { useState } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

interface AccountSettingsProps {
  userData: UserData;
}

export function AccountSettings({ userData }: AccountSettingsProps) {
  const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/update-phone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Telefon numarası güncellenirken bir hata oluştu');
        return;
      }

      setSuccess('Telefon numarası başarıyla güncellendi');
      // Başarılı güncelleme sonrası sayfayı yenile (opsiyonel)
      // window.location.reload();
    } catch (err: any) {
      setError('Bir hata oluştu: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-stroke px-7.5 py-4 dark:border-stroke-dark">
        <h2 className="font-bold text-black text-2xl dark:text-white">
          Hesap Ayarları
        </h2>
      </div>

      <div className="p-7.5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Kullanıcı Bilgileri - Sadece Görüntüleme */}
          <div className="space-y-4">
            <div>
              <label className="mb-2.5 block text-body-sm font-medium text-dark dark:text-white">
                Ad Soyad
              </label>
              <input
                type="text"
                value={userData.name}
                disabled
                className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-2 px-4 py-2.5 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-body-sm font-medium text-dark dark:text-white">
                E-posta
              </label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-2 px-4 py-2.5 text-dark outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* Telefon Numarası - Düzenlenebilir */}
            <div>
              <label className="mb-2.5 block text-body-sm font-medium text-dark dark:text-white">
                Telefon Numarası <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="05XX XXX XX XX"
                required
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-4 py-2.5 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
              <p className="mt-1.5 text-body-xs text-dark-4 dark:text-dark-6">
                Telefon numaranızı güncelleyebilirsiniz
              </p>
            </div>
          </div>

          {/* Hata ve Başarı Mesajları */}
          {error && (
            <div className="rounded-lg border border-red-500 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-500 bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              {success}
            </div>
          )}

          {/* Kaydet Butonu */}
          <div className="flex items-center justify-end gap-3 border-t border-stroke pt-6 dark:border-stroke-dark">
            <button
              type="submit"
              disabled={isLoading || phoneNumber === userData.phoneNumber}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                  Kaydediliyor...
                </>
              ) : (
                'Kaydet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

