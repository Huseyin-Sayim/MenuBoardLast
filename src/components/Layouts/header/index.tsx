"use client";

import { SearchIcon } from "@/assets/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
// import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const pathname = usePathname();

  // Şablon düzenleme sayfasında header'ı gizle
  const isTemplateEditPage = pathname?.startsWith("/dashboard/designTemplate/");

  if (isTemplateEditPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Yan Menüyü Aç/Kapat</span>
      </button>

      {isMobile && (
        <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
          <img
            src={"/images/logo/ntx.png"}
            width={120}
            height={32}
            alt="Logo"
            className="h-12 w-auto object-contain"
            role="presentation"
          />
        </Link>
      )}

      <div className="max-xl:hidden">
        <h1 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">

        </h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">

        {/*<ThemeToggleSwitch />*/}


        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
