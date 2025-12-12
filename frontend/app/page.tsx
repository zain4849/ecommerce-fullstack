"use client";

import { HeroCarousel } from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useBlur from "@/context/BlurContext";
import { useCart } from "@/context/CartContext";
import CategoryBar from "@/components/CategoryBar";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import axios from "axios";
import Link from "next/link";
// import { getHealth } from "@/lib/test";
import { useEffect, useState } from "react";
import Image from "next/image";
import ProductCarousel from "@/components/ui/ProductCarousel";
import NewArrival from "@/components/NewArrival";
// import { getHealth } from "../lib/api";

export default function Home() {
  // const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const [loading, setLoading] = useState(true);
  const { isBlur } = useBlur();
  // const { addItem } = useCart();

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const res = await api.get("/products");
  //     // const data = await res.json();
  //     setProducts(res.data.slice(0, 6)); // show only first 6
  //   };
  //   fetchProducts();
  // }, []);

  return (
    <div className={cn("relative", isBlur ? "blur-[1px]" : "")}>
      {/* grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 */}
      {/* {products.map((product) => (
        <Card key={product.id} className="shadow hover:shadow-lg transition">
          <CardContent className="p-4">
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-500 flex items-center gap-1"><img src="/UAE_Dirham_Symbol.svg" alt="UAE-Dirham" className="w-3" />{product.price}</p>
            <Button className="mt-4 w-full cursor-pointer" onClick={() => addItem(product)}>
              Add to Cart
            </Button>
          </CardContent>
        </Card> */}
      {/* Hero Section */}
      <section className="container mx-auto my-2 min-h-screen">
        <HeroCarousel />

        {/* Categories */}
        <h2 className="text-[3.125rem] font-black mb-12 text-center">
          Browser by Categories
        </h2>
        <CategoryBar />
      </section>

      {/* Featured Products */}
      <section className="container mx-auto py-4 px-4 min-h-screen">
        <h2 className="text-[3.125rem] font-black mb-12 text-center">
          Featured Products
        </h2>
        <ProductCarousel />
        <div className="w-full h-[450px] mt-24 bg-cyan-950 rounded-xl overflow-hidden">

        </div>
      </section>
      <section className="container mx-auto py-4 px-4 min-h-screen">
        <h2 className="text-[3.125rem] font-black mb-12 text-center">
          Trending Products
        </h2>
        <ProductCarousel />
        <NewArrival/>
      </section>

    </div>
  );
}
