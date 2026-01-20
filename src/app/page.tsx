"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Logo } from "@/components/logo";
import InputGroup from "@/components/FormElements/InputGroup";
import { EmailIcon, NameIcon, PhoneNumberIcon, PasswordIcon, AddressIcon, PencilSquareIcon, TrendingUpIcon, ScreenIcon } from "@/assets/icons";
import ForgotPasswordForm from "@/components/Auth/ForgotPassword";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from "@/lib/validate/validatesSchemas";
import api from "@/lib/api/axios";
import { fa } from "zod/v4/locales";

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const lastScrollTime = useRef(0);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    }
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      address: "",
      businessName: "",
      branchCount: 1,
      estimatedScreen: 1,
    }
  });

  const [isLoginForm, setIsLoginForm] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  /* New State for Success Modal */
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false); // New state for warning
  const [countdown, setCountdown] = useState(5);

  const router = useRouter();


  // Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showSuccessModal && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showSuccessModal && countdown === 0) {
      // Countdown finished
      setShowSuccessModal(false);
      setFormKey((prev) => prev + 1);
      setIsLoginForm(true);
      setCountdown(5); // Reset for next time
    }
    return () => clearInterval(interval);
  }, [showSuccessModal, countdown]);

  // Wheel event handler with throttle
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      if (isScrolling) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 800) return;
      lastScrollTime.current = now;

      const deltaY = e.deltaY;
      if (deltaY > 0 && currentSection < 2) {
        // Scroll down - alttan üste
        setScrollDirection("down");
        setIsScrolling(true);
        setCurrentSection((prev) => prev + 1);
        setTimeout(() => setIsScrolling(false), 1000);
      } else if (deltaY < 0 && currentSection > 0) {
        // Scroll up - yukarıdan aşağı
        setScrollDirection("up");
        setIsScrolling(true);
        setCurrentSection((prev) => prev - 1);
        setTimeout(() => setIsScrolling(false), 1000);
      }
    },
    [currentSection, isScrolling]
  );

  useEffect(() => {
    // Disable default scroll
    document.body.style.overflow = "hidden";

    // Add wheel event listener
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  // Animation variants - scroll direction'a göre
  const getSectionVariants = (direction: "down" | "up") => ({
    initial: {
      y: direction === "down" ? "100%" : "-100%",
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: direction === "down" ? "-100%" : "100%",
      opacity: 0,
    },
  });

  const transition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
  };

  const handleRegister = async (data: RegisterValues) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const response = await api.post('/api/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        address: data.address,
        businessName: data.businessName,
        branchCount: data.branchCount,
        estimatedScreen: data.estimatedScreen,
      });

      if (response.status === 201) {
        registerForm.reset();
        setShowSuccessModal(true); // Show modal instead of direct switch
        setCountdown(5); // Ensure countdown starts at 5
      } else {
        setErrorMessage('Kayıt başarısız: ' + response.data.message);
      }
    } catch (err: any) {
      setErrorMessage('Bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async (data: LoginValues) => {
    setErrorMessage(null)
    setLoading(true)

    try {
      const backendData = {
        userData: {
          email: data.email,
          password: data.password,
        },
        devices: navigator.userAgent || "Cihaz bulunamadı!"
      };

      const response = await api.post('/api/login', backendData);

      if (response.status === 200) {
        Cookies.set('accessToken', response.data.accessToken, {
          expires: 1 / 96,
          secure: false,
          sameSite: 'lax'
        });

        Cookies.set('refreshToken', response.data.refreshToken, {
          expires: 7,
          secure: false,
          sameSite: 'lax'
        });

        Cookies.set('user', JSON.stringify(response.data.user), {
          expires: 7,
          secure: false,
          sameSite: 'lax'
        });

        router.push("/dashboard")
      }

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message;
      if (errorMsg && errorMsg.includes('email adresinizi doğrulayınız')) {
        setShowWarningModal(true);
      } else {
        setErrorMessage('Bir hata oluştu: ' + errorMsg);
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-dark/80 backdrop-blur-md border-b border-stroke dark:border-dark-3">
        <div className="flex items-center ml-4 w-full">
          <Logo />
        </div>
        <div className="flex items-center gap-4 w-full justify-end">
          <button
            onClick={() => {
              setScrollDirection("down");
              setCurrentSection(2);
              setFormKey((prev) => prev + 1);
              setIsLoginForm(false);
            }}
            className="rounded-lg px-6 py-2.5 font-medium text-dark dark:text-white transition hover:bg-gray-1 dark:hover:bg-dark-2"
          >
            Kayıt Ol
          </button>
          <button
            onClick={() => {
              setScrollDirection("down");
              setCurrentSection(2);
              setFormKey((prev) => prev + 1);
              setIsLoginForm(true);
            }}
            className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white transition hover:bg-opacity-90"
          >
            Giriş Yap
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {currentSection === 0 && (
          <motion.section
            key="section-1"
            variants={getSectionVariants(scrollDirection)}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="absolute inset-0 h-screen w-full flex items-center justify-center bg-gray-dark dark:bg-dark pt-20"
          >
            <div className="text-center max-w-4xl mx-auto px-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...transition, delay: 0.2 }}
                className="mb-8"
              >
                <Image
                  src="/images/logo/ntx.png"
                  alt="NTX Logo"
                  width={400}
                  height={120}
                  className="mx-auto dark:opacity-90"
                  priority
                />
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...transition, delay: 0.4 }}
                className="space-y-6"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Menu Board Yönetim Sistemi
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Modern ve kullanıcı dostu arayüzü ile dijital menü panolarınızı kolayca yönetin.
                  Menülerinizi güncelleyin, içeriklerinizi düzenleyin ve müşterilerinize en iyi deneyimi sunun.
                </p>
                <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
                  Hızlı, güvenli ve profesyonel çözümlerle işletmenizi bir adım öne taşıyın.
                </p>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Section 2: Menu Board Solutions başlığı ve grid */}
        {currentSection === 1 && (
          <motion.section
            key="section-2"
            variants={getSectionVariants(scrollDirection)}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="absolute inset-0 h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-dark px-4 py-20 pt-28"
          >
            <div className="mx-auto max-w-screen-2xl w-full">
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...transition, delay: 0.2 }}
                className="mb-12 text-center text-5xl font-bold text-dark dark:text-white md:text-6xl lg:text-7xl"
              >
                Özelliklerimiz
              </motion.h1>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...transition, delay: 0.4 }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {[
                  {
                    title: "Menü Yönetimi",
                    description: "Menülerinizi kolayca oluşturun, düzenleyin ve güncelleyin. Ürün bilgileri, fiyatlar ve görselleri tek yerden yönetin."
                  },
                  {
                    title: "İçerik Düzenleme",
                    description: "Görsel içeriklerinizi yükleyin, düzenleyin ve organize edin. Fotoğraflar, videolar ve animasyonları kolayca ekleyin."
                  },
                  {
                    title: "Canlı Güncelleme",
                    description: "Menülerinizi anında güncelleyin. Değişiklikler tüm ekranlarda otomatik olarak yansır, bekleme süresi yok."
                  },
                  {
                    title: "Çoklu Ekran Desteği",
                    description: "Birden fazla ekranı tek panelden yönetin. Farklı lokasyonlar ve ekranlar için özel içerikler oluşturun."
                  },
                  {
                    title: "Tasarım Özelleştirme",
                    description: "Menü panolarınızı markanıza özel tasarlayın. Renkler, fontlar ve düzenleri istediğiniz gibi özelleştirin."
                  },
                  {
                    title: "Analitik ve Raporlama",
                    description: "Menü performansınızı takip edin. Detaylı analitik raporlarla işletmenizi daha iyi yönetin."
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-stroke bg-gray-1 p-6 dark:border-dark-3 dark:bg-dark-2"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-dark-4 dark:text-dark-6">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Section 3: Kayıt/Giriş formu */}
        {currentSection === 2 && (
          <motion.section
            key="section-3"
            variants={getSectionVariants(scrollDirection)}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="absolute inset-0 h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-1 via-white to-gray-2 dark:from-gray-dark dark:via-dark-2 dark:to-gray-dark px-4 py-20 pt-28"
          >
            <div className={`mx-auto w-full ${isLoginForm ? 'max-w-md' : 'max-w-4xl'}`}>
              <AnimatePresence mode="wait" initial={false}>
                {isForgotPassword ? (
                  <motion.div
                    key={`forgot-password-${formKey}`}
                    className="w-full"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                      scale: [0.5, 1.05, 1],
                      opacity: 1,
                    }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      scale: {
                        times: [0, 0.7, 1],
                        duration: 0.4,
                      }
                    }}
                  >
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: 0.1,
                      }}
                    >
                      <ForgotPasswordForm
                        onSuccess={() => {
                          setFormKey((prev) => prev + 1);
                          setIsForgotPassword(false);
                          setIsLoginForm(true);
                        }}
                      />
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => {
                            setFormKey((prev) => prev + 1);
                            setIsForgotPassword(false);
                          }}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          ← Giriş sayfasına dön
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${isLoginForm ? "login" : "register"}-${formKey}`}
                    className="w-full"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{
                      scale: [0.5, 1.05, 1],
                      opacity: 1,
                    }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      scale: {
                        times: [0, 0.7, 1],
                        duration: 0.4,
                      }
                    }}
                  >
                    <motion.h2
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: 0.1,
                      }}
                      className="mb-8 text-center text-4xl font-bold text-dark dark:text-white md:text-5xl"
                    >
                      {isLoginForm ? "Giriş Yap" : "Kayıt Ol"}
                    </motion.h2>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: 0.2,
                      }}
                    >
                      <form
                        onSubmit={
                          isLoginForm
                            ? loginForm.handleSubmit(handleLogin)
                            : registerForm.handleSubmit(handleRegister)
                        }
                        className="space-y-4"
                      >
                        {!isLoginForm ? (
                          // Register Form Layout (2 Columns: 4 Left / 3 Right)
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                              {/* Left Column (4 inputs) */}
                              <div className="flex flex-col gap-4 w-full h-full">
                                <div className="w-full">
                                  <InputGroup
                                    type="text"
                                    label="Ad Soyad"
                                    placeholder="Adınızı ve soyadınızı giriniz"
                                    className="[&_input]:py-[15px]"
                                    icon={<NameIcon />}
                                    {...registerForm.register('name')}
                                    required
                                  />
                                  {registerForm.formState.errors.name && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {registerForm.formState.errors.name.message}
                                    </p>
                                  )}
                                </div>

                                <div className="w-full">
                                  <InputGroup
                                    type="text"
                                    label="Telefon Numarası"
                                    placeholder="Telefon numaranızı giriniz"
                                    className="[&_input]:py-[15px]"
                                    icon={<PhoneNumberIcon />}
                                    {...registerForm.register('phoneNumber')}
                                    required
                                  />
                                  {registerForm.formState.errors.phoneNumber && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {registerForm.formState.errors.phoneNumber.message}
                                    </p>
                                  )}
                                </div>

                                <div className="w-full">
                                  <InputGroup
                                    type="email"
                                    label="E-posta"
                                    placeholder="E-posta adresinizi giriniz"
                                    className="[&_input]:py-[15px]"
                                    icon={<EmailIcon />}
                                    {...registerForm.register('email')}
                                    required
                                  />
                                  {registerForm.formState.errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {registerForm.formState.errors.email?.message}
                                    </p>
                                  )}
                                </div>

                                <div className="w-full">
                                  <InputGroup
                                    type="password"
                                    label="Şifre"
                                    placeholder="Şifrenizi girin"
                                    className="[&_input]:py-[15px]"
                                    icon={<PasswordIcon />}
                                    {...registerForm.register('password')}
                                    required
                                  />
                                  {registerForm.formState.errors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {registerForm.formState.errors.password?.message}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Right Column (3 inputs + Button) */}
                              <div className="flex flex-col gap-4 w-full h-full">
                                <div className="w-full">
                                  <InputGroup
                                    type="text"
                                    label="Adres"
                                    placeholder="Adresinizi giriniz"
                                    className="[&_input]:py-[15px]"
                                    icon={<AddressIcon />}
                                    {...registerForm.register('address')}
                                    required
                                  />
                                  {registerForm.formState.errors.address && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {registerForm.formState.errors.address.message}
                                    </p>
                                  )}
                                </div>

                                <div className="w-full">
                                  <InputGroup
                                    type="text"
                                    label="İşletme Adı"
                                    placeholder="İşletme adını giriniz"
                                    className="[&_input]:py-[15px]"
                                    icon={<PencilSquareIcon />}
                                    {...registerForm.register('businessName')}
                                    required
                                  />
                                  {registerForm.formState.errors.businessName && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {registerForm.formState.errors.businessName.message}
                                    </p>
                                  )}
                                </div>

                                <div className="w-full">
                                  <InputGroup
                                    type="number"
                                    label="Şube Sayısı"
                                    placeholder="Şube sayısını giriniz"
                                    className="[&_input]:py-[15px]"
                                    icon={<TrendingUpIcon />}
                                    {...registerForm.register('branchCount', { valueAsNumber: true })}
                                    required
                                  />
                                  {registerForm.formState.errors.branchCount && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {registerForm.formState.errors.branchCount.message}
                                    </p>
                                  )}
                                </div>

                                <div className="w-full">
                                  <InputGroup
                                    type="number"
                                    label="Tahmini Ekran Sayısı"
                                    placeholder="Kullanacağınız tahmini ekran sayısını giriniz."
                                    className="[&_input]:py-[15px]"
                                    icon={<ScreenIcon />}
                                    {...registerForm.register('estimatedScreen', { valueAsNumber: true })}
                                    required
                                  />
                                  {registerForm.formState.errors.estimatedScreen && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {registerForm.formState.errors.estimatedScreen.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {/* Register Button in Right Column - Effectively the 4th item */}
                            </div>
                            <div className="w-full mt-6">
                              <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-primary px-8 py-[15px] font-medium text-white transition hover:bg-opacity-90"
                              >
                                Kayıt Ol
                              </button>
                            </div>
                          </>
                        ) : (
                          // Login Form Layout (Single Column)
                          <>
                            <InputGroup
                              type="email"
                              label="E-posta"
                              placeholder="E-posta adresinizi giriniz"
                              icon={<EmailIcon />}
                              {...loginForm.register('email')}
                              required
                            />
                            {loginForm.formState.errors.email && (
                              <p className="text-red-500 text-xs mt-1">
                                {loginForm.formState.errors.email?.message}
                              </p>
                            )}

                            <InputGroup
                              type="password"
                              label="Şifre"
                              placeholder="Şifrenizi girin"
                              icon={<PasswordIcon />}
                              {...loginForm.register('password')}
                              required
                            />
                            {loginForm.formState.errors.password && (
                              <p className="text-red-500 text-xs mt-1">
                                {loginForm.formState.errors.password?.message}
                              </p>
                            )}
                          </>
                        )}

                        {errorMessage && (
                          <p className="text-red-500 text-xs mt-1 text-center">
                            {errorMessage}
                          </p>
                        )}

                        {isLoginForm && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setFormKey((prev) => prev + 1);
                                setIsForgotPassword(true);
                              }}
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              Şifremi Unuttum?
                            </button>
                          </div>
                        )}

                        {isLoginForm && (
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-primary px-8 py-4 font-medium text-white transition hover:bg-opacity-90"
                          >
                            Giriş Yap
                          </button>
                        )}
                      </form>

                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ ...transition, delay: 0.6 }}
                        className="mt-6 text-center space-y-4"
                      >
                        <p className="text-dark-4 dark:text-dark-6">
                          {isLoginForm
                            ? "Hesabın yoksa hesap oluştur"
                            : "Zaten hesabın var mı?"}
                        </p>
                        <button
                          onClick={() => {
                            setFormKey((prev) => prev + 1); // Animasyonu kesmek için key değiştir
                            setIsLoginForm(!isLoginForm);
                          }}
                          className="inline-block rounded-lg bg-gray-1 dark:bg-dark-2 px-6 py-2.5 font-medium text-dark dark:text-white transition hover:bg-gray-2 dark:hover:bg-dark-3"
                        >
                          {isLoginForm ? "Kayıt Ol" : "Giriş Yap"}
                        </button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-dark-2"
            >
              <div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-dark dark:text-white">
                Kayıt Başarılı!
              </h3>
              <p className="mb-6 text-dark-4 dark:text-dark-6">
                Mail adresinize doğrulama bağlantısı gönderildi. Lütfen gelen kutunuzu kontrol edin.
              </p>
              <div className="text-sm font-medium text-primary">
                {countdown} saniye içinde giriş ekranına yönlendirileceksiniz...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      <AnimatePresence>
        {showWarningModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-dark-2 relative"
            >
              <button
                onClick={() => setShowWarningModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <svg
                  className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-dark dark:text-white">
                Hesap Doğrulanmadı
              </h3>
              <p className="mb-6 text-dark-4 dark:text-dark-6">
                Giriş yapabilmek için lütfen email adresinizi doğrulayınız. Doğrulama linki email adresinize gönderildi.
              </p>
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full rounded-lg bg-primary px-8 py-3 font-medium text-white transition hover:bg-opacity-90"
              >
                Tamam
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section indicators */}
      <div className="absolute right-8 top-1/2 z-50 -translate-y-1/2 space-y-2">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => {
              if (!isScrolling) {
                setIsScrolling(true);
                setCurrentSection(index);
                setTimeout(() => setIsScrolling(false), 1000);
              }
            }}
            className={`block h-3 w-3 rounded-full transition-all ${currentSection === index
              ? "bg-primary scale-125"
              : "bg-dark-6 hover:bg-dark-4"
              }`}
            aria-label={`Section ${index + 1}`}
          />
        ))}
      </div>
    </div >
  );
}
