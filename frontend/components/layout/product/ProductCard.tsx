"use client";

import React from "react";
import { Product, getProductId } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "../../ui/button";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/cartSlice";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Stable, deterministic discount derived from product id so the cards stay consistent
// between renders without needing the backend to provide an originalPrice.
function deterministicDiscount(id: string): number {
  if (!id) return 0;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  const bucket = Math.abs(hash) % 5;
  // Roughly 60% of products get a discount badge.
  const discounts = [0, 0, 10, 20, 35];
  return discounts[bucket];
}

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch<AppDispatch>();
  const [wishlisted, setWishlisted] = useState(false);

  const pid = getProductId(product);
  const price = Number(product.price);
  const discount = deterministicDiscount(pid);
  const originalPrice = discount > 0 ? price / (1 - discount / 100) : null;
  const inStock = product.inStock !== false;
  const rating = product.rating ?? 0;
  const numReviews = product.numReviews ?? 0;

  return (
    <div className="p-1 h-full">
      <div className="group relative h-full flex flex-col bg-card rounded-2xl border border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 overflow-hidden">
        {/* Top-left badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-sale text-sale-foreground text-[0.7rem] font-bold px-2 py-1 rounded-md shadow-sm">
              -{discount}%
            </span>
          )}
          {!inStock && (
            <span className="bg-foreground/85 text-background text-[0.7rem] font-bold px-2 py-1 rounded-md">
              Out of stock
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((v) => !v);
          }}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 z-10 size-9 rounded-full bg-white/90 backdrop-blur border border-border/60 flex items-center justify-center hover:bg-white hover:scale-110 transition shadow-sm cursor-pointer"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              wishlisted ? "fill-sale text-sale" : "text-muted-foreground",
            )}
          />
        </button>

        <Link href={pid ? `/products/${pid}` : "#"} className="flex flex-col flex-1">
          <div className="relative aspect-square bg-gradient-to-br from-muted/40 to-muted/10 flex items-center justify-center p-6">
            <Image
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="object-contain max-h-full max-w-full transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>

          <div className="px-4 pt-3 pb-4 flex flex-col gap-1.5 flex-1">
            {product.brand && (
              <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold">
                {product.brand}
              </span>
            )}
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {rating > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{rating.toFixed(1)}</span>
                {numReviews > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({numReviews})
                  </span>
                )}
              </div>
            )}

            <div className="flex items-baseline gap-2 mt-auto pt-2">
              <span className="text-base md:text-lg font-bold text-foreground">
                AED {price.toFixed(2)}
              </span>
              {originalPrice !== null && (
                <span className="text-xs text-muted-foreground line-through">
                  AED {originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link>

        <div className="px-4 pb-4">
          <Button
            size="sm"
            className="w-full gap-2 rounded-lg"
            disabled={!inStock}
            onClick={() => dispatch(addItem(product))}
          >
            <ShoppingCart className="size-4" />
            {inStock ? "Add to Cart" : "Sold Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
