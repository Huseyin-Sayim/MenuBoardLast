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

      // Response durumunu kontrol et
      if (!response.ok) {
        let errorMsg = 'Giriş başarısız!';
        
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || `Sunucu hatası: ${response.status} ${response.statusText}`;
          console.error('❌ API Hata Yanıtı:', errorData);
        } catch (parseError) {
          errorMsg = `Sunucu hatası: ${response.status} ${response.statusText}`;
          console.error('❌ Response parse hatası:', parseError);
        }
        
        setErrorMessage(errorMsg);
        setLoading(false);
        return;
      }

      // Başarılı response'u parse et
      let responseData;
      try {
        responseData = await response.json();
        console.log('✅ Login başarılı:', { user: responseData.user?.email });
      } catch (parseError) {
        console.error('❌ Response parse hatası:', parseError);
        setErrorMessage('Sunucudan geçersiz yanıt alındı. Lütfen tekrar deneyin.');
        setLoading(false);
        return;
      }

      const cookieOptions = {
        expires: 1/96,
        secure: false,
        path: '/',
        sameSite:'lax' as const
      };

      Cookies.set('accessToken', responseData.accessToken, cookieOptions);

      Cookies.set("refreshToken", responseData.refreshToken, {
        ...cookieOptions,
        expires: 7
      });

      Cookies.set("user", JSON.stringify(responseData.user), {
        ...cookieOptions,
        expires: 7
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.error('❌ Login catch hatası:', err);
      
      // Daha açıklayıcı hata mesajları
      let errorMsg = 'Giriş yapılırken bir hata oluştu';
      
      if (err.message) {
        errorMsg = err.message;
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMsg = 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.';
      } else if (err.response) {
        errorMsg = err.response.data?.message || `Sunucu hatası: ${err.response.status}`;
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>


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
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{errorMessage}</span>
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
