"use client";
import {
  AddressIcon,
  EmailIcon,
  NameIcon,
  PasswordIcon,
  PhoneNumberIcon,
  PencilSquareIcon,
  TrendingUpIcon,
} from "@/assets/icons";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterValues,
} from "@/lib/validate/validatesSchemas";
import api from "@/lib/api/axios";

export default function SignupWithPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitForm = async (data: RegisterValues) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const response = await api.post("/api/register", data);

      if (response.status === 201) {
        reset();
        router.push("/dashboard");
      } else {
        setErrorMessage("Kayıt başarısız: " + response.data.message);
      }
    } catch (err: any) {
      setErrorMessage("Bir hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("form errors: ", errors);
  console.log("mail errors: ", errors.email);
  console.log("phone errors: ", errors.phoneNumber);

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      {isValidating && (
        <div className="mt-1 rounded border border-red-200 bg-red-50 p-2">
          <p className="mb-2 text-xs text-blue-500">Kontrol ediliyor...</p>
        </div>
      )}
      <InputGroup
        type="text"
        label="Ad Soyad"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Adınızı ve soyadınızı giriniz. Örn: Hüseyin Sayım "
        icon={<NameIcon />}
        {...register("name")}
      />
      {errors.name && (
        <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
      )}
      <InputGroup
        type="text"
        label="Telefon Numarası"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Telefon numaranızı giriniz. Örn: 0555-555-55-55"
        icon={<PhoneNumberIcon />}
        {...register("phoneNumber")}
      />
      {errors.phoneNumber && (
        <p className="mt-1 text-xs text-red-500">
          {errors.phoneNumber.message}
        </p>
      )}
      <InputGroup
        type="email"
        label="E-posta"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="E-posta adresinizi giriniz. Örn: info@info.com"
        icon={<EmailIcon />}
        {...register("email")}
      />
      {errors.email && (
        <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
      )}
      <InputGroup
        type="password"
        label="Şifre"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Şifrenizi girin Örn: 123Aa"
        icon={<PasswordIcon />}
        {...register("password")}
      />
      {errors.password && (
        <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
      )}
      <InputGroup
        type="text"
        label="Adres"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Adresinizi girin Örn: İzmir/Konak..."
        icon={<AddressIcon />}
        {...register("address")}
      />
      {errors.address && (
        <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
      )}

      <InputGroup
        type="text"
        label="İşletme Adı"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="İşletme adını giriniz"
        icon={<PencilSquareIcon />}
        {...register("businessName")}
      />
      {errors.businessName && (
        <p className="mt-1 text-xs text-red-500">{errors.businessName.message}</p>
      )}

      <InputGroup
        type="number"
        label="Şube Sayısı"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Şube sayısını giriniz"
        icon={<TrendingUpIcon />}
        {...register("branchCount", { valueAsNumber: true })}
      />
      {errors.branchCount && (
        <p className="mt-1 text-xs text-red-500">{errors.branchCount.message}</p>
      )}

      <div className="mb-4.5 mt-10">
        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Kayıt Ol
          {(loading || isSubmitting) && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
