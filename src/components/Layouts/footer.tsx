export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stroke bg-white py-4 dark:border-stroke-dark dark:bg-gray-dark">
      <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 2xl:px-10">
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-dark-4 dark:text-dark-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span>© {currentYear}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Hüseyin SAYIM</span>
          </div>
          <div className="text-center sm:text-right">
            <span>Tüm hakları saklıdır</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

