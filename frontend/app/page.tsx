"use client";

import { HeroCarousel } from "@/components/HeroCarousel";
import CategoryBar from "@/components/CategoryBar";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import ProductCarousel from "@/components/layout/product/ProductCarousel";
import NewArrival from "@/components/NewArrival";
import api from "@/lib/api";
import Link from "next/link";

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get("/products?featured=true")
      .then((res) => setFeatured(res.data))
      .catch(() => {});
    api
      .get("/products")
      .then((res) => setTrending(res.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-gradient-to-b from-background via-background to-muted/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-6 md:pt-10">
        <HeroCarousel />

        {/* Categories */}
        <div className="mt-14 md:mt-20 mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Shop smarter
          </p>
          <h2 className="text-3xl md:text-5xl font-black">Browse by Category</h2>
        </div>
        <CategoryBar />
      </section>

      {/* Featured Products */}
      <section className="container mx-auto py-16 px-4">
        <div className="mb-8 md:mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Handpicked deals
          </p>
          <h2 className="text-3xl md:text-5xl font-black">Featured Products</h2>
        </div>
        {featured.length > 0 && <ProductCarousel products={featured} />}
        <div className="w-full mt-16 md:mt-20 rounded-3xl overflow-hidden bg-gradient-to-r from-accent via-indigo-600 to-fuchsia-700 p-8 md:p-12 text-white shadow-2xl shadow-accent/20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-4xl font-black mb-4">
              Free Shipping on Orders Over AED 200
            </h3>
            <p className="text-white/85 mb-7 text-sm md:text-base">
              Upgrade your setup with top tech picks and enjoy fast, free delivery
              across the UAE.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 font-semibold text-accent transition hover:translate-y-[-1px] hover:bg-gray-100"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </section>
      <section className="container mx-auto py-12 md:py-16 px-4">
        <div className="mb-8 md:mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Most loved
          </p>
          <h2 className="text-3xl md:text-5xl font-black">Trending Products</h2>
        </div>
        {trending.length > 0 && <ProductCarousel products={trending} />}
        <NewArrival />
      </section>
    </div>
  );
}
