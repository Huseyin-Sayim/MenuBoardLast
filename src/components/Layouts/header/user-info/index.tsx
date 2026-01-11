"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LogOutIcon, SettingsIcon } from "./icons";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import api from "@/lib/api/axios";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string; img?: string } | null>(null);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUser({
          name: userData.name || userData.firstName || '',
          email: userData.email || '',
          img: userData.img || userData.profileImage || "/images/user/user-03.png",
        });
      } catch (error) {
        console.error('User data parse error:', error);
      }
    }
  }, []);

  const USER = {
    name: user?.name || "",
    email: user?.email || "",
    img: user?.img || "/images/user/user-03.png",
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)

      const refreshToken = Cookies.get('refreshToken');

      if (!refreshToken) {
        console.error('Refresh token bulunamadı !!')
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('user')
        setIsOpen(false)
        router.push("/")
        return;
      }

      await api.post('/api/logout',{
        token: refreshToken
      });

      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
      Cookies.remove('user')
      setIsOpen(false)
      router.push('/');

    } catch (err : any) {
      console.error('Logout hatası:', err.response?.data?.message || err.message);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('user');
      router.push('/');
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">Hesabım</span>

        <figure className="flex items-center gap-3">
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{USER.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">Kullanıcı bilgileri</h2>
        
        {/* Kullanıcı bilgileri - Dropdown açıkken */}
        {isOpen && USER.name && (
          <div className="px-4 py-3 border-b border-[#E8E8E8] dark:border-dark-3">
            <p className="text-base font-semibold text-dark dark:text-white">
              {USER.name}
            </p>
            {USER.email && (
              <p className="text-sm text-gray-500 dark:text-dark-6 mt-1">
                {USER.email}
              </p>
            )}
          </div>
        )}
        
        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
         

          <Link
            href={"/dashboard/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Hesap Ayarları
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Çıkış Yap</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
