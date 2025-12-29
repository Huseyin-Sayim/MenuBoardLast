"use client";

import { CheckIcon, PasswordIcon } from "@/assets/icons";
import { useState, useEffect, useRef } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import Link from "next/link";

interface NewPasswordStepProps {
  onSubmit: (password: string) => void;
  onBack: () => void;
  onSuccess?: () => void; // Landing page için callback
}

export default function NewPasswordStep({
  onSubmit,
  onBack,
  onSuccess,
}: NewPasswordStepProps) {
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const onSuccessRef = useRef(onSuccess);
  
  // onSuccess callback'ini ref'te sakla
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Şifre en az 8 karakter olmalıdır";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Şifre en az bir küçük harf içermelidir";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Şifre en az bir büyük harf içermelidir";
    }
    if (!/(?=.*[0-9])/.test(password)) {
      return "Şifre en az bir rakam içermelidir";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });

    // Validasyon
    if (name === "password") {
      setErrors({
        ...errors,
        password: validatePassword(value),
        confirmPassword:
          data.confirmPassword && value !== data.confirmPassword
            ? "Şifreler eşleşmiyor"
            : "",
      });
    } else if (name === "confirmPassword") {
      setErrors({
        ...errors,
        confirmPassword:
          value !== data.password ? "Şifreler eşleşmiyor" : "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordError = validatePassword(data.password);
    const confirmError =
      data.password !== data.confirmPassword ? "Şifreler eşleşmiyor" : "";

    if (passwordError || confirmError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmError,
      });
      return;
    }

    setLoading(true);
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onSubmit(data.password);
    }, 1000);
  };

  useEffect(() => {
    if (success) {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // setTimeout ile callback'i bir sonraki tick'te çağır
            setTimeout(() => {
              if (onSuccessRef.current) {
                onSuccessRef.current(); // Landing page için callback
              } else {
                window.location.href = "/auth/sign-in"; // Normal sayfa için yönlendirme
              }
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [success]);

  return (
    <>
      {/* Başarı Mesajı */}
      {success && (
        <div 
          className="mb-6 flex flex-col items-center justify-center"
          style={{
            animation: "fadeIn 0.5s ease-in-out, slideDown 0.5s ease-in-out"
          }}
        >
          <div 
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-light-7 dark:bg-green-light-7"
            style={{
              animation: "scaleIn 0.5s ease-out"
            }}
          >
            <CheckIcon className="h-10 w-10 text-green" />
          </div>
          <h3 className="text-green mb-6 text-xl font-bold text-dark dark:text-white">
            Şifreniz başarıyla sıfırlandı!
          </h3>
          <p className="mb-4 text-sm text-dark-4 dark:text-dark-6">
            {countdown} saniye içinde giriş sayfasına yönlendirileceksiniz
          </p>
        
        </div>
      )}

      {!success && (
        <>
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
              Yeni Şifre Oluştur
            </h2>
            <p className="text-body-sm text-dark-4 dark:text-dark-6">
              Güvenliğiniz için güçlü bir şifre oluşturun.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <InputGroup
              type="password"
              label="Yeni Şifre"
              className="mb-4 [&_input]:py-[15px]"
              placeholder="Yeni şifrenizi girin"
              name="password"
              handleChange={handleChange}
              value={data.password}
              icon={<PasswordIcon />}
              required
            />
            {errors.password && (
              <p className="mb-4 text-sm text-red">{errors.password}</p>
            )}

            <InputGroup
              type="password"
              label="Şifre Tekrar"
              className="mb-5 [&_input]:py-[15px]"
              placeholder="Şifrenizi tekrar girin"
              name="confirmPassword"
              handleChange={handleChange}
              value={data.confirmPassword}
              icon={<PasswordIcon />}
              required
            />
            {errors.confirmPassword && (
              <p className="mb-5 text-sm text-red">{errors.confirmPassword}</p>
            )}

            <div className="mb-4 rounded-lg bg-gray-1 p-4 dark:bg-dark-2">
              <p className="mb-2 text-sm font-medium text-dark dark:text-white">
                Şifre gereksinimleri:
              </p>
              <ul className="space-y-1 text-xs text-dark-4 dark:text-dark-6">
                <li
                  className={
                    data.password.length >= 8
                      ? "text-green"
                      : ""
                  }
                >
                  • En az 8 karakter
                </li>
                <li
                  className={
                    /(?=.*[a-z])/.test(data.password) ? "text-green" : ""
                  }
                >
                  • En az bir küçük harf
                </li>
                <li
                  className={
                    /(?=.*[A-Z])/.test(data.password) ? "text-green" : ""
                  }
                >
                  • En az bir büyük harf
                </li>
                <li
                  className={
                    /(?=.*[0-9])/.test(data.password) ? "text-green" : ""
                  }
                >
                  • En az bir rakam
                </li>
              </ul>
            </div>

            <div className="mb-4.5">
              <button
                type="submit"
                disabled={loading || !data.password || !data.confirmPassword}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Şifreyi Sıfırla
                {loading && (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
                )}
              </button>
            </div>
          </form>

      
        </>
      )}
    </>
  );
}

