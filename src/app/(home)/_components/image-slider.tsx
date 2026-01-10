"use client";

import { ArrowLeftIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Template = {
  id: string;
  name: string;
  path: string;
  component: string;
};

type ImageSliderProps = {
  images?: string[];
  templates?: Template[];
  className?: string;
};

export function ImageSlider({ images, templates, className }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Template'ler varsa onları kullan, yoksa images kullan
  const items = templates || images || [];
  const isTemplateMode = !!templates;

  // Preview URL oluştur
  const getPreviewUrl = (path: string) => {
    return `${path}?preview=true`;
  };

  useEffect(() => {
    if (items.length === 0) return;
    
    // Otomatik geçiş için interval
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000); // 4 saniye

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [items.length]);

  // Aktif thumbnail'ı görünür alana getir
  useEffect(() => {
    const activeThumbnail = thumbnailRefs.current[currentIndex];
    const container = thumbnailContainerRef.current;
    
    if (activeThumbnail && container) {
      const containerRect = container.getBoundingClientRect();
      const thumbnailRect = activeThumbnail.getBoundingClientRect();
      
      const scrollLeft = container.scrollLeft;
      const thumbnailLeft = thumbnailRect.left - containerRect.left + scrollLeft;
      const thumbnailWidth = thumbnailRect.width;
      const containerWidth = containerRect.width;
      
      // Thumbnail'ı ortala
      const targetScroll = thumbnailLeft - containerWidth / 2 + thumbnailWidth / 2;
      
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const handleImageClick = (index: number) => {
    // Interval'ı sıfırla
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Yeni index'i ayarla
    setCurrentIndex(index);
    
    // Yeni interval başlat
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
  };

  const getImageIndex = (offset: number) => {
    const index = (currentIndex + offset + items.length) % items.length;
    return index;
  };

  // Scroll fonksiyonları
  const scrollLeft = () => {
    if (thumbnailContainerRef.current) {
      thumbnailContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (thumbnailContainerRef.current) {
      thumbnailContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  // Drag & Drop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (thumbnailContainerRef.current?.scrollLeft || 0));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !thumbnailContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - startX;
    thumbnailContainerRef.current.scrollLeft = x;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (thumbnailContainerRef.current?.scrollLeft || 0));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !thumbnailContainerRef.current) return;
    const x = e.touches[0].pageX - startX;
    thumbnailContainerRef.current.scrollLeft = x;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card md:gap-6",
        className,
      )}
    >
      {/* Başlık */}
      <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
        Örnek Tasarımlar
      </h2>

      {/* Slider Container */}
      <div className="flex items-center justify-center gap-2 md:gap-4">
        {/* Sol taraftaki küçük görünen preview */}
        {isTemplateMode && templates ? (
          <button
            onClick={() => handleImageClick(getImageIndex(-1))}
            className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg opacity-60 transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 active:scale-95 md:h-40 md:w-32 bg-gray-2 dark:bg-dark-2"
          >
            <iframe
              src={getPreviewUrl(templates[getImageIndex(-1)].path)}
              className="absolute inset-0 border-0 pointer-events-none"
              style={{
                transform: 'scale(0.15)',
                transformOrigin: 'top left',
                width: '667%',
                height: '667%'
              }}
            />
          </button>
        ) : images ? (
          <button
            onClick={() => handleImageClick(getImageIndex(-1))}
            className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg opacity-60 transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 active:scale-95 md:h-40 md:w-32"
          >
            <Image
              src={images[getImageIndex(-1)]}
              alt={`Previous ${getImageIndex(-1) + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ) : null}

        {/* Ortadaki ana preview */}
        <div className="relative h-64 w-full max-w-2xl overflow-hidden rounded-lg shadow-lg md:h-80 bg-gray-2 dark:bg-dark-2">
          <div className="relative h-full w-full">
            {isTemplateMode && templates ? (
              templates.map((template, index) => {
                const isActive = index === currentIndex;
                const offset = ((index - currentIndex + templates.length) % templates.length);
                const isNext = offset === 1;
                
                return (
                  <div
                    key={template.id}
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-in-out",
                      isActive 
                        ? "z-10 opacity-100 translate-x-0 scale-100" 
                        : isNext
                        ? "z-0 opacity-0 translate-x-12 scale-105"
                        : "z-0 opacity-0 -translate-x-12 scale-95"
                    )}
                  >
                    <iframe
                      src={getPreviewUrl(template.path)}
                      className="absolute inset-0 border-0 pointer-events-none"
                      style={{
                        transform: 'scale(0.33)',
                        transformOrigin: 'top left',
                        width: '303%',
                        height: '303%'
                      }}
                    />
                  </div>
                );
              })
            ) : images ? (
              images.map((image, index) => {
                const isActive = index === currentIndex;
                const offset = ((index - currentIndex + images.length) % images.length);
                const isNext = offset === 1;
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-in-out",
                      isActive 
                        ? "z-10 opacity-100 translate-x-0 scale-100" 
                        : isNext
                        ? "z-0 opacity-0 translate-x-12 scale-105"
                        : "z-0 opacity-0 -translate-x-12 scale-95"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`Slide ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={isActive}
                    />
                  </div>
                );
              })
            ) : null}
          </div>
        </div>

        {/* Sağ taraftaki küçük görünen preview */}
        {isTemplateMode && templates ? (
          <button
            onClick={() => handleImageClick(getImageIndex(1))}
            className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg opacity-60 transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 active:scale-95 md:h-40 md:w-32 bg-gray-2 dark:bg-dark-2"
          >
            <iframe
              src={getPreviewUrl(templates[getImageIndex(1)].path)}
              className="absolute inset-0 border-0 pointer-events-none"
              style={{
                transform: 'scale(0.15)',
                transformOrigin: 'top left',
                width: '667%',
                height: '667%'
              }}
            />
          </button>
        ) : images ? (
          <button
            onClick={() => handleImageClick(getImageIndex(1))}
            className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg opacity-60 transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 active:scale-95 md:h-40 md:w-32"
          >
            <Image
              src={images[getImageIndex(1)]}
              alt={`Next ${getImageIndex(1) + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ) : null}
      </div>

      {/* Thumbnail Gallery */}
      <div className="relative">
        {/* Sol Ok */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-2 hover:scale-110 active:scale-95 dark:bg-gray-dark dark:hover:bg-dark-2"
          aria-label="Sol"
        >
          <ArrowLeftIcon className="size-5 text-dark dark:text-white" />
        </button>

        {/* Thumbnail Container */}
        <div
          ref={thumbnailContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "flex gap-3 overflow-x-auto no-scrollbar px-12 py-2",
            isDragging && "cursor-grabbing select-none"
          )}
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {isTemplateMode && templates ? (
            templates.map((template, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={template.id}
                  ref={(el) => {
                    thumbnailRefs.current[index] = el;
                  }}
                  onClick={() => handleImageClick(index)}
                  className={cn(
                    "relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 md:h-15 md:w-20 bg-gray-2 dark:bg-dark-2",
                    isActive
                      ? "border-primary shadow-lg scale-105"
                      : "border-stroke opacity-70 hover:opacity-100 dark:border-stroke-dark"
                  )}
                >
                  <iframe
                    src={getPreviewUrl(template.path)}
                    className="absolute inset-0 border-0 pointer-events-none"
                    style={{
                      transform: 'scale(0.1)',
                      transformOrigin: 'top left',
                      width: '1000%',
                      height: '1000%'
                    }}
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-primary/20" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-1 py-0.5 truncate">
                    {template.name}
                  </div>
                </button>
              );
            })
          ) : images ? (
            images.map((image, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={index}
                  ref={(el) => {
                    thumbnailRefs.current[index] = el;
                  }}
                  onClick={() => handleImageClick(index)}
                  className={cn(
                    "relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 md:h-15 md:w-20",
                    isActive
                      ? "border-primary shadow-lg scale-105"
                      : "border-stroke opacity-70 hover:opacity-100 dark:border-stroke-dark"
                  )}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-primary/20" />
                  )}
                </button>
              );
            })
          ) : null}
        </div>

        {/* Sağ Ok */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-2 hover:scale-110 active:scale-95 dark:bg-gray-dark dark:hover:bg-dark-2"
          aria-label="Sağ"
        >
          <ArrowLeftIcon className="size-5 rotate-180 text-dark dark:text-white" />
        </button>
      </div>
    </div>
  );
}

