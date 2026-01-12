"use client";

import { ArrowLeftIcon } from "@/assets/icons";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface VerificationStepProps {
  email: string;
  onSubmit: (code: string) => void;
  onBack: () => void;
}

export default function VerificationStep({
  email,
  onSubmit,
  onBack,
}: VerificationStepProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Otomatik olarak bir sonraki input'a geç
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Tüm kodlar doldurulduğunda otomatik submit
    if (newCode.every((digit) => digit !== "") && newCode.join("").length === 6) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCode = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
    setCode(newCode);
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
      handleSubmit(pastedData);
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const handleSubmit = (codeValue?: string) => {
    const codeToSubmit = codeValue || code.join("");
    if (codeToSubmit.length !== 6) return;

    setLoading(true);
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setLoading(false);
      onSubmit(codeToSubmit);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-dark-4 hover:text-primary dark:text-dark-6 dark:hover:text-primary"
      >
        <ArrowLeftIcon className="size-5" />
        <span className="font-medium">Geri</span>
      </button>

      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
          Doğrulama Kodu
        </h2>
        <p className="text-body-sm text-dark-4 dark:text-dark-6">
          <span className="font-medium">{email}</span> adresine gönderilen 6 haneli kodu girin.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="mb-6">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            Doğrulama Kodu
          </label>
          <div className="flex gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="h-14 w-full rounded-lg border-[1.5px] border-stroke bg-transparent text-center text-2xl font-bold text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                disabled={loading}
              />
            ))}
          </div>
        </div>

        <div className="mb-4.5">
          <button
            type="submit"
            disabled={loading || code.join("").length !== 6}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Doğrula
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-4 text-center">
        <p className="text-body-sm text-dark-4 dark:text-dark-6">
          Kod gelmedi mi?{" "}
          <button
            onClick={() => {
              // Yeniden kod gönderme işlemi
              alert("Yeni kod gönderiliyor...");
            }}
            className="font-medium text-primary hover:underline"
          >
            Tekrar Gönder
          </button>
        </p>
      </div>
    </>
  );
}



