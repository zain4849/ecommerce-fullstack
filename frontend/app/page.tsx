"use client";

import { HeroCarousel } from "@/components/HeroCarousel";
import CategoryBar from "@/components/CategoryBar";
import ProductCarousel from "@/components/layout/product/ProductCarousel";
import NewArrival from "@/components/NewArrival";
import SectionHeader from "@/components/layout/SectionHeader";
import {
  useFeaturedProducts,
  useTrendingProducts,
} from "@/src/features/products/hooks/useHomeProducts";
import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const trustItems = [
  {
    icon: Truck,
    title: "Free Delivery",
    subtitle: "On orders over AED 200",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    subtitle: "30-day hassle-free returns",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    subtitle: "Stripe-protected payments",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "We're always here to help",
  },
];

const brands = ["Apple", "Samsung", "Sony", "Bose", "Microsoft", "LG", "Dell", "HP"];

export default function Home() {
  const { data: featuredData } = useFeaturedProducts();
  const { data: trendingData } = useTrendingProducts();
  const featured = featuredData?.products ?? [];
  const trending = trendingData?.products ?? [];

  return (
    <div className="space-y-14 md:space-y-20 pb-16">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-4 md:pt-6">
        <HeroCarousel />
      </section>

      {/* Trust strip */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="size-11 md:size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <item.icon className="size-5 md:size-6" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm md:text-base leading-tight">
                  {item.title}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Browse the store"
          title="Shop by Category"
          description="From laptops to smart home — pick your gear."
          href="/products"
        />
        <CategoryBar />
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4">
          <SectionHeader
            eyebrow="Editor's picks"
            title="Featured Products"
            description="Handpicked favourites our team is loving right now."
            href="/products"
          />
          <ProductCarousel products={featured} />
        </section>
      )}

      {/* Promo banner */}
      <section className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-purple-700 p-8 md:p-14 text-white">
          <div
            className="absolute -top-20 -right-20 size-72 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -bottom-32 -left-16 size-96 rounded-full bg-white/5 blur-3xl"
            aria-hidden
          />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block text-xs uppercase tracking-[0.28em] font-semibold mb-3 px-3 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur">
              Limited time
            </span>
            <h3 className="text-3xl md:text-5xl font-black leading-tight mb-3">
              Free Shipping on Orders Over AED 200
            </h3>
            <p className="text-white/85 text-sm md:text-base mb-6 max-w-lg">
              Shop the latest tech gadgets with free delivery across the UAE.
              Limited time offer — don&apos;t miss out.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 md:px-8 py-3 rounded-full hover:bg-white/95 hover:shadow-xl transition shadow-lg"
            >
              Shop now
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
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="container mx-auto px-4">
          <SectionHeader
            eyebrow="What's hot"
            title="Trending Now"
            description="The pieces everyone's talking about this week."
            href="/products?sort=rating"
          />
          <ProductCarousel products={trending} />
        </section>
      )}

      {/* New arrivals promo grid */}
      <section className="container mx-auto px-4">
        <NewArrival />
      </section>

      {/* Brand strip */}
      <section className="container mx-auto px-4">
        <div className="rounded-3xl bg-card border border-border/60 p-6 md:p-10">
          <p className="text-center text-xs uppercase tracking-[0.28em] text-muted-foreground font-semibold mb-6">
            Shop the brands you love
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-4">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/products?brand=${encodeURIComponent(brand)}`}
                className="text-base md:text-xl font-bold text-muted-foreground hover:text-primary transition-colors tracking-wide"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
