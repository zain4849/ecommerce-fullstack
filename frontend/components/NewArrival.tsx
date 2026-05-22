import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/layout/SectionHeader";

const tiles = [
  {
    href: "/products?category=Gaming",
    image: "/categories/gaming.png",
    title: "Gaming Collection",
    subtitle: "Consoles, controllers & accessories for every gamer.",
    className:
      "h-[300px] md:h-[420px] lg:h-[450px] lg:col-span-2",
  },
  {
    href: "/products?category=Mobile",
    image: "/categories/mobile.png",
    title: "Latest Smartphones",
    subtitle: "Flagship phones from top brands, now available.",
    className:
      "h-[300px] md:h-[420px] lg:h-auto lg:row-span-2 lg:col-span-2",
  },
  {
    href: "/products?category=Audio",
    image: "/categories/speakers.png",
    title: "Audio",
    subtitle: "Premium headphones & speakers.",
    className: "h-[220px] md:h-[260px]",
  },
  {
    href: "/products?category=Smart%20Home",
    image: "/categories/smart.png",
    title: "Smart Home",
    subtitle: "Automate your living space.",
    className: "h-[220px] md:h-[260px]",
  },
];

export default function NewArrival() {
  return (
    <section className="w-full py-14">
      <SectionHeader
        eyebrow="Fresh drops"
        title="Shop our New Arrivals"
        description="Curated picks that just landed in store this week."
        href="/products?sort=newest"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className={`relative ${tile.className} overflow-hidden rounded-2xl group shadow-md hover:shadow-2xl hover:shadow-primary/10 transition-shadow border border-border/40`}
          >
            <Image
              src={tile.image}
              alt={tile.title}
              fill
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/0" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h3 className="text-lg md:text-xl font-bold leading-tight">
                {tile.title}
              </h3>
              <p className="text-xs md:text-sm text-white/80 max-w-xs mt-1">
                {tile.subtitle}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 group-hover:underline">
                Shop now
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
