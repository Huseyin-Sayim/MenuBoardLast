"use client";

import { useState } from "react";
import EmailStep from "./EmailStep";
import VerificationStep from "./VerificationStep";
import NewPasswordStep from "./NewPasswordStep";

type Step = "email" | "verification" | "newPassword";

interface ForgotPasswordFormProps {
  onSuccess?: () => void; // Landing page için callback
}

export default function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps = {}) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleEmailSubmit = (emailValue: string) => {
    setEmail(emailValue);
    setStep("verification");
    // Burada backend'e email gönderme işlemi yapılacak
    console.log("Email gönderiliyor:", emailValue);
  };

  const handleVerificationSubmit = (code: string) => {
    setVerificationCode(code);
    setStep("newPassword");
    // Burada backend'e kod doğrulama işlemi yapılacak
    console.log("Kod doğrulanıyor:", code);
  };

  const handlePasswordReset = (newPassword: string) => {
    // Burada backend'e yeni şifre kaydetme işlemi yapılacak
    console.log("Yeni şifre kaydediliyor:", newPassword);
    // Başarı mesajı NewPasswordStep içinde gösteriliyor
  };

  return (
    <div>
      {step === "email" && <EmailStep onSubmit={handleEmailSubmit} />}
      {step === "verification" && (
        <VerificationStep
          email={email}
          onSubmit={handleVerificationSubmit}
          onBack={() => setStep("email")}
        />
      )}
      {step === "newPassword" && (
        <NewPasswordStep
          onSubmit={handlePasswordReset}
          onBack={() => setStep("verification")}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}

