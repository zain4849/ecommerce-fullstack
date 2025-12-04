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
// import { getHealth } from "../lib/api";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const [loading, setLoading] = useState(true);
  const { isBlur } = useBlur();
  // const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get("/products");
      // const data = await res.json();
      setProducts(res.data.slice(0, 6)); // show only first 6
    };
    fetchProducts();
  }, []);

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
      <HeroCarousel />

      {/* Categories */}
      <h2 className="text-3xl font-black mb-6 text-center">Categories</h2>
      <CategoryBar />

      {/* Featured Products */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-black mb-6 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition">
              <Link
                key={product._id}
                href={`/products/${product._id}`}
              >
                <img
                  src={product.images}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-2 px-5">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-500">${product.price}</p>
                </div>
              </Link>
              <Button className="mb-4 mx-5" onClick={() => addItem(product)}>Add to Cart</Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
