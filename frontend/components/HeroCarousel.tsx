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
    image: "/banners/newest.jpg",
    title: "New Arrivals",
    subtitle: "Check out the latest trends",
  },
  {
    id: 2,
    image: "/banners/winter.jpg",
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
    <div className="relative w-full mb-25">
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
              <div className="relative w-full h-[400px] md:h-[600px]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
                  <h2 className="text-3xl md:text-5xl font-bold">
                    {slide.title}
                  </h2>
                  <p className="mt-2 text-lg md:text-xl">{slide.subtitle}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Optional navigation arrows */}
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}
