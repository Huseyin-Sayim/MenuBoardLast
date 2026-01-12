"use client"

import React from 'react';

const BurgerPromo = () => {
  // Arka plan ve ürün görselleri yolları
  const bgImage = "/images/cover/bg.jpg";
  const productImg = "/images/cover/productImage.png";

  return (
    <div className="relative w-full h-screen bg-[#1a1a1a] overflow-hidden font-sans flex items-center justify-between">
      {/* Arka Plan */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-70"
        style={{ backgroundImage: "url('/images/cover/bg.jpg')" }}
      />

      {/* Karartma Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Yazılar */}
      <div className="relative z-20 pl-20 space-y-8 ">
        <div className="text-white font-black text-4xl absolute uppercase -rotate-12  inline-block ">
          TAVUK WRAP
        </div>

        <h1 className=" text-yellow-500 whitespace-nowrap mb-45 text-brandYellow text-[12rem] font-black italic leading-[0.8] -rotate-12 drop-shadow-2xl tracking-tighter">
          TUBORG KOVA
        </h1>

        <div className="text-white text-2xl border-l-8 border-brandYellow pl-6 max-w-lg mt-12">
          200gr tavuk eti yanında tuborg gold 50cl şişe bira
        </div>

        <div className="bg-brandYellow text-yellow-500 text-8xl font-black px-10 py-4 -rotate-3 inline-block shadow-[0_20px_50px_rgba(0,0,0,0.5)] mt-10">
          400 TL
        </div>
      </div>

      {/* Ürün Görseli */}
      <div className="absolute mt-40 z-30 right-10 animate-pulse-slow">
        <img
          src="/images/cover/productImage.png"
          alt="Ürün"
          className="max-w-[750px] drop-shadow-[0_35px_35px_rgba(0,0,0,0.8)] scale-110"
        />
      </div>
    </div>
  );

};

export default BurgerPromo;

// Tailwind için gerekli custom animasyon (tailwind.config.js'e ekleyebilirsin)
// theme: { extend: { animation: { 'pulse-slow': 'pulse 6s infinite' } } }