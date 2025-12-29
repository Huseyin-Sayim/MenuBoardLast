"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function SigninWithPassword() {
  const [data, setData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null)
    setLoading(true);

    try {
      if (!data.email || !data.password) {
        setErrorMessage("E-posta ve şifre alanları zorunludur !!")
        setLoading(false)
        return;
      }

      const response = await fetch('/api/login',{
        method: 'POST',
        headers: {
          'Content-type':'application/json'
        },
        body: JSON.stringify({
          userData: {
            email: data.email,
            password: data.password
          },
          devices: navigator.userAgent || "Cihaz bulunamadı!"
        })
      });

      const cookieOptions = {
        expires: 1/96,
        secure: false,
        path: '/',
        sameSite:'lax' as const
      };

      Cookies.set('accessToken', response.data.accessToken, cookieOptions);

      Cookies.set("refreshToken", response.data.refreshToken, {
        ...cookieOptions,
        expires: 7
      });

      Cookies.set("user", JSON.stringify(response.data.user), {
        ...cookieOptions,
        expires: 7
      });

      if (status === '401') {
        router.push('/')
      }

      router.push('/dashboard');
    }catch (err: any) {
      setErrorMessage('Bir hata oluştu: '+err.message)
    } finally {
      setLoading(false)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Hata mesajını form'un en üstüne taşıdık - daha görünür */}
   

      <InputGroup
        type="email"
        label="E-posta"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="E-posta adresinizi girin"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />



      <InputGroup
        type="password"
        label="Şifre"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Şifrenizi girin"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />
      {errorMessage && (
        <div className="flex items-center gap-2">
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Beni hatırla"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Şifremi Unuttum?
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Giriş Yap
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
