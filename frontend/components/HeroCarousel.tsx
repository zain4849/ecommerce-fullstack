"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Slide = {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  align?: "left" | "right";
};

const slides: Slide[] = [
  {
    id: 1,
    image: "/banners/newest.png",
    eyebrow: "Just dropped",
    title: "New Arrivals 2026",
    subtitle: "The latest tech, before everyone else.",
    cta: "Shop the drop",
    href: "/products?sort=newest",
  },
  {
    id: 2,
    image: "/banners/headset.png",
    eyebrow: "Mid-season sale",
    title: "Up to 50% off Audio",
    subtitle: "Premium headphones & speakers, now for less.",
    cta: "Shop deals",
    href: "/products?category=Audio",
    align: "right",
  },
  {
    id: 3,
    image: "/banners/exclusive.jpg",
    eyebrow: "Exclusive",
    title: "Limited Edition Drops",
    subtitle: "Curated tech, available for a limited time only.",
    cta: "Explore",
    href: "/products",
  },
];

// Embla Carousel API surface we actually use here.
type EmblaApi = {
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  selectedScrollSnap: () => number;
  scrollSnapList: () => number[];
  on: (event: "select" | "reInit", cb: () => void) => void;
  off?: (event: "select" | "reInit", cb: () => void) => void;
};

export function HeroCarousel() {
  const [api, setApi] = useState<EmblaApi | null>(null);
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const handleSetApi = (incoming: unknown) => {
    setApi((incoming as EmblaApi) ?? null);
  };

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    const onReInit = () => setSnaps(api.scrollSnapList());
    onSelect();
    onReInit();
    api.on("select", onSelect);
    api.on("reInit", onReInit);
    return () => {
      api.off?.("select", onSelect);
      api.off?.("reInit", onReInit);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    // auto-advance, infinite
    const interval = setInterval(() => api.scrollNext(), 7000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-border/60 shadow-xl shadow-primary/5">
      <Carousel
        setApi={handleSetApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full h-[360px] sm:h-[440px] md:h-[520px] lg:h-[560px]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={slide.id === 1}
                  sizes="100vw"
                />
                <div
                  className={cn(
                    "absolute inset-0",
                    slide.align === "right"
                      ? "bg-gradient-to-l from-black/75 via-black/40 to-transparent"
                      : "bg-gradient-to-r from-black/75 via-black/40 to-transparent",
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 flex items-end md:items-center",
                    slide.align === "right" && "md:justify-end",
                  )}
                >
                  <div className="p-6 md:p-12 lg:p-16 text-white max-w-xl">
                    <span className="inline-block text-[0.7rem] md:text-xs uppercase tracking-[0.28em] text-white/85 mb-3 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20">
                      {slide.eyebrow}
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] drop-shadow-sm">
                      {slide.title}
                    </h2>
                    <p className="mt-3 md:mt-4 text-sm md:text-base text-white/85 max-w-md">
                      {slide.subtitle}
                    </p>
                    <Link
                      href={slide.href}
                      className="inline-flex items-center gap-2 mt-5 md:mt-7 px-6 py-3 rounded-full bg-white text-foreground font-semibold text-sm md:text-base hover:bg-white/90 transition shadow-lg"
                    >
                      {slide.cta}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex left-4 md:left-6 size-10 bg-white/95 hover:bg-white text-foreground border-none shadow-md" />
        <CarouselNext className="hidden md:flex right-4 md:right-6 size-10 bg-white/95 hover:bg-white text-foreground border-none shadow-md" />
      </Carousel>

      {/* Slide indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {snaps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => api?.scrollTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              idx === selected
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80 w-3",
            )}
          />
        ))}
      </div>
    </div>
  );
}
