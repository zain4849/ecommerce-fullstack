"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    image: "/banners/newest.png",
    title: "New Arrivals",
    subtitle: "Check out the latest trends",
  },
  {
    id: 2,
    image: "/banners/headset.png",
    title: "Winter Sale",
    subtitle: "Up to 50% off selected items",
  },
  {
    id: 3,
    image: "/banners/exclusive.jpg",
    title: "Exclusive Collection",
    subtitle: "Limited edition pieces just dropped",
  },
];

export function HeroCarousel() {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => api.scrollNext(), 7000); // interval ticks forever until component unmounts
    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/20">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full h-[420px] md:h-[560px]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={slide.id === 1}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
                <div className="absolute inset-0 flex items-end md:items-center">
                  <div className="p-6 md:p-12 text-white max-w-xl">
                    <p className="text-xs md:text-sm uppercase tracking-[0.24em] text-white/80 mb-3">
                      ShopHub picks
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black leading-tight">
                      {slide.title}
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-white/85">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 md:left-6 bg-white/90 hover:bg-white border-none" />
        <CarouselNext className="right-4 md:right-6 bg-white/90 hover:bg-white border-none" />
      </Carousel>
    </div>
  );
}
