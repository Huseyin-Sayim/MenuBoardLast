"use client";

import { EmailIcon } from "@/assets/icons";
import Link from "next/link";
import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";

interface EmailStepProps {
  onSubmit: (email: string) => void;
}

export default function EmailStep({ onSubmit }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setLoading(false);
      onSubmit(email);
    }, 1000);
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">
          Şifremi Unuttum
        </h2>
        <p className="text-body-sm text-dark-4 dark:text-dark-6">
          E-posta adresinize doğrulama kodu göndereceğiz.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <InputGroup
          type="email"
          label="E-posta"
          className="mb-6 [&_input]:py-[15px]"
          placeholder="E-posta adresinizi girin"
          name="email"
          handleChange={(e) => setEmail(e.target.value)}
          value={email}
          icon={<EmailIcon />}
          required
        />

        <div className="mb-4.5">
          <button
            type="submit"
            disabled={loading || !email}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Doğrulama Kodu Gönder
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p>
          Hesabınız var mı?{" "}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </>
  );
}



