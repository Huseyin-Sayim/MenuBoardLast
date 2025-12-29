import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo";



export const metadata: Metadata = {
  title: "Menü Tahtası Yönetim Paneli",
  description:
    "Ekranlarınızı ve tasarımlarınızı kolayca yönetin. Modern ve kullanıcı dostu menü tahtası yönetim sistemi.",
};



export default function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-1 via-white to-gray-2 dark:from-gray-dark dark:via-dark-2 dark:to-gray-dark">
      {/* Header */}
      <header className="border-b border-stroke dark:border-dark-3">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 sm:py-4 md:px-6 2xl:px-10">
          <div className="flex-1 max-w-[150px] sm:max-w-[200px] h-10 sm:h-12">
              <Logo />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/auth/sign-in"
              className="rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-medium text-dark transition hover:text-primary dark:text-white dark:hover:text-primary"
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-lg bg-primary px-4 py-1.5 sm:px-6 sm:py-2.5 text-sm sm:text-base font-medium text-white transition hover:bg-opacity-90"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </header>


      {/* Hero Section */}
      <section className="mx-auto max-w-screen-2xl px-4 py-12 sm:py-16 md:py-20 md:px-6 2xl:px-10">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold leading-tight text-dark dark:text-white md:text-5xl lg:text-6xl">
              Menü Tahtası Yönetim Paneli
            </h1>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-dark-4 dark:text-dark-6 md:text-xl">
              Ekranlarınızı ve tasarımlarınızı kolayca yönetin. Modern ve kullanıcı dostu
              arayüz ile menü tahtalarınızı profesyonelce yönetin.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
              <Link
                href="/auth/sign-up"
                className="flex items-center justify-center rounded-lg bg-primary px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium text-white transition hover:bg-opacity-90"
              >
                Hemen Başla
              </Link>
              <Link
                href="/auth/sign-in"
                className="flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium text-primary transition hover:bg-primary hover:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
              <Image
                src="/images/grids/grid-02.svg"
                alt="Dashboard Preview"
                fill
                className="object-cover dark:opacity-30"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-stroke bg-white py-12 sm:py-16 md:py-20 dark:border-dark-3 dark:bg-gray-dark">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 md:px-6 2xl:px-10">
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-dark dark:text-white md:text-4xl">
              Özellikler
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-dark-4 dark:text-dark-6 px-2 sm:px-4">
              Menü tahtası yönetim sisteminizde ihtiyacınız olan tüm özellikler
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-stroke bg-gray-1 p-3 sm:p-4 md:p-6 dark:border-dark-3 dark:bg-dark-2 w-full">
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-base sm:text-lg md:text-xl font-bold text-dark dark:text-white">
                Ekran Yönetimi
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-dark-4 dark:text-dark-6 leading-relaxed">
                Tüm ekranlarınızı tek bir yerden kolayca yönetin ve organize edin.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-stroke bg-gray-1 p-3 sm:p-4 md:p-6 dark:border-dark-3 dark:bg-dark-2 w-full">
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-base sm:text-lg md:text-xl font-bold text-dark dark:text-white">
                Tasarım Yönetimi
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-dark-4 dark:text-dark-6 leading-relaxed">
                Menü tasarımlarınızı oluşturun, düzenleyin ve yönetin.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-stroke bg-gray-1 p-3 sm:p-4 md:p-6 dark:border-dark-3 dark:bg-dark-2 w-full">
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-base sm:text-lg md:text-xl font-bold text-dark dark:text-white">
                Medya Yönetimi
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-dark-4 dark:text-dark-6 leading-relaxed">
                Görsellerinizi ve medya dosyalarınızı kolayca yükleyin ve yönetin.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border border-stroke bg-gray-1 p-3 sm:p-4 md:p-6 dark:border-dark-3 dark:bg-dark-2 w-full">
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-base sm:text-lg md:text-xl font-bold text-dark dark:text-white">
                Güvenli Platform
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-dark-4 dark:text-dark-6 leading-relaxed">
                Verileriniz güvende. Modern güvenlik standartları ile korunuyor.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-lg border border-stroke bg-gray-1 p-3 sm:p-4 md:p-6 dark:border-dark-3 dark:bg-dark-2 w-full">
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-base sm:text-lg md:text-xl font-bold text-dark dark:text-white">
                Hızlı ve Etkili
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-dark-4 dark:text-dark-6 leading-relaxed">
                Modern teknoloji ile hızlı ve sorunsuz çalışan bir platform.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-lg border border-stroke bg-gray-1 p-3 sm:p-4 md:p-6 dark:border-dark-3 dark:bg-dark-2 w-full">
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-base sm:text-lg md:text-xl font-bold text-dark dark:text-white">
                Özelleştirilebilir
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-dark-4 dark:text-dark-6 leading-relaxed">
                İhtiyaçlarınıza göre özelleştirilebilir tasarım ve ayarlar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-stroke py-12 sm:py-16 md:py-20 dark:border-dark-3">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 md:px-6 2xl:px-10">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-dark dark:text-white md:text-4xl">
            Hemen Başlayın
          </h2>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg text-dark-4 dark:text-dark-6 px-2">
            Menü tahtası yönetim sisteminize bugün başlayın ve işletmenizi bir adım öne taşıyın.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:gap-4 sm:flex-row">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium text-white transition hover:bg-opacity-90"
            >
              Ücretsiz Kayıt Ol
            </Link>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium text-primary transition hover:bg-primary hover:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stroke bg-white py-6 sm:py-8 dark:border-dark-3 dark:bg-gray-dark">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-6 2xl:px-10">
          <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row">
            <p className="text-xs sm:text-sm text-center md:text-left text-dark-4 dark:text-dark-6">
              © 2024 Menü Tahtası Yönetim Paneli. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-4 sm:gap-6">
              <Link
                href="/auth/sign-in"
                className="text-xs sm:text-sm text-dark-4 transition hover:text-primary dark:text-dark-6 dark:hover:text-primary"
              >
                Giriş Yap
              </Link>
              <Link
                href="/auth/sign-up"
                className="text-xs sm:text-sm text-dark-4 transition hover:text-primary dark:text-dark-6 dark:hover:text-primary"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}



