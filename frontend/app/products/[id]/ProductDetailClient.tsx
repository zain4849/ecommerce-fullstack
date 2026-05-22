"use client";

import Link from "next/link";
import Image from "next/image";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCarousel from "@/components/layout/product/ProductCarousel";
import SectionHeader from "@/components/layout/SectionHeader";
import { AppDispatch, RootState } from "@/store/store";
import { addItem, updateQuantity } from "@/store/cartSlice";
import { Product, getProductId } from "@/types/product";
import {
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailClientProps {
  product: Product;
  similarProducts: Product[];
}

export default function ProductDetailClient({
  product,
  similarProducts,
}: ProductDetailClientProps) {
  const dispatch = useDispatch<AppDispatch>();
  const productId = getProductId(product);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItem = cartItems.find(
    (item) => getProductId(item.product) === productId,
  );

  // Stable, deterministic rating fallback so the page is consistent across renders.
  const getRating = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++)
      hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
    return (Math.abs(hash) % 2) + 4;
  };

  const rating = product.rating ?? getRating(productId);
  const reviewCount =
    product.numReviews ??
    Math.abs(parseInt(productId.slice(-4), 16) % 200) + 12;
  const productImages = product.images?.length
    ? product.images
    : ["/placeholder.svg"];
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const inStock = product.inStock !== false;
  const price = Number(product.price);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumbs */}
        <nav className="text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          {product.category && (
            <>
              <span className="mx-1.5">/</span>
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="hover:text-foreground"
              >
                {product.category}
              </Link>
            </>
          )}
          <span className="mx-1.5">/</span>
          <span className="text-foreground font-medium line-clamp-1 inline">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Gallery */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-[88px_1fr] gap-3 md:gap-4">
            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="order-2 sm:order-1 flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible no-scrollbar">
                {productImages.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "relative size-16 sm:size-20 rounded-xl border-2 transition shrink-0 overflow-hidden bg-card",
                      selectedImage === idx
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <Image
                      src={img}
                      fill
                      alt={`${product.name} ${idx + 1}`}
                      className="object-contain p-1.5"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="order-1 sm:order-2 relative aspect-square w-full bg-card rounded-2xl border border-border/60 overflow-hidden flex items-center justify-center">
              <Image
                src={productImages[selectedImage] ?? productImages[0]}
                fill
                alt={product.name}
                className="object-contain p-8 md:p-12"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <button
                type="button"
                onClick={() => setWishlisted((v) => !v)}
                aria-label="Add to wishlist"
                className="absolute top-4 right-4 size-10 rounded-full bg-white/90 backdrop-blur border border-border/60 flex items-center justify-center hover:bg-white hover:scale-110 transition shadow-sm cursor-pointer"
              >
                <Heart
                  className={cn(
                    "size-5 transition-colors",
                    wishlisted
                      ? "fill-sale text-sale"
                      : "text-muted-foreground",
                  )}
                />
              </button>
            </div>
          </div>

          {/* Buy box */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 flex flex-col gap-5">
              <div>
                {product.brand && (
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {product.brand}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl lg:text-[2rem] font-bold leading-tight mt-1">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) =>
                      star <= Math.round(rating) ? (
                        <FaStar
                          key={star}
                          size={16}
                          className="text-yellow-400"
                        />
                      ) : (
                        <FaRegStar
                          key={star}
                          size={16}
                          className="text-yellow-400/40"
                        />
                      ),
                    )}
                    <span className="text-sm font-medium ml-1">
                      {Number(rating).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price card */}
              <div className="bg-card rounded-2xl border border-border/60 p-5 md:p-6 space-y-5">
                <div>
                  <p className="text-3xl md:text-4xl font-black flex items-center gap-1.5">
                    <Image
                      src="/UAE_Dirham_Symbol.svg"
                      alt="AED"
                      width={22}
                      height={22}
                    />
                    {price.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Inclusive of all taxes
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {inStock ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20">
                      <span className="size-1.5 rounded-full bg-success" />
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-sale/10 text-sale border border-sale/20">
                      Out of Stock
                    </span>
                  )}
                  {product.stock !== undefined && product.stock > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {product.stock} available
                    </span>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium">Quantity</span>
                  <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background">
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(updateQuantity({ productId, delta: -1 }))
                      }
                      disabled={!cartItem || cartItem.quantity <= 0}
                      className="size-10 hover:bg-muted disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {cartItem?.quantity ?? 0}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(updateQuantity({ productId, delta: 1 }))
                      }
                      disabled={
                        product.stock !== undefined &&
                        (cartItem?.quantity ?? 0) >= product.stock
                      }
                      className="size-10 hover:bg-muted disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="flex-1 h-12 text-base gap-2 rounded-xl"
                    onClick={() => dispatch(addItem(product))}
                    disabled={!inStock}
                  >
                    <ShoppingCart className="size-5" />
                    {!inStock ? "Out of Stock" : "Add To Cart"}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 gap-2 rounded-xl"
                    onClick={() => setWishlisted((v) => !v)}
                  >
                    <Heart
                      className={cn(
                        "size-5",
                        wishlisted && "fill-sale text-sale",
                      )}
                    />
                    <span className="sm:sr-only md:not-sr-only">
                      Wishlist
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 gap-2 rounded-xl"
                    aria-label="Share"
                  >
                    <Share2 className="size-5" />
                    <span className="sm:sr-only md:not-sr-only">Share</span>
                  </Button>
                </div>
              </div>

              {/* Trust block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: Truck,
                    title: "Free delivery",
                    sub: "Orders over AED 200",
                  },
                  {
                    icon: RotateCcw,
                    title: "30-day returns",
                    sub: "Hassle-free",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Secure checkout",
                    sub: "Stripe-protected",
                  },
                ].map((t) => (
                  <div
                    key={t.title}
                    className="flex items-start gap-3 bg-card rounded-xl border border-border/60 p-3"
                  >
                    <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <t.icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight">
                        {t.title}
                      </p>
                      <p className="text-[0.7rem] text-muted-foreground truncate">
                        {t.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {product.category && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <Link
                    href={`/products?category=${encodeURIComponent(product.category)}`}
                    className="text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full hover:bg-secondary/80 transition"
                  >
                    {product.category}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description / Highlights */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border/60 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              About this product
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description ??
                "No description available for this product yet."}
            </p>
          </div>
          <div className="bg-card rounded-2xl border border-border/60 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Highlights</h2>
            <ul className="space-y-3 text-sm">
              {[
                product.brand && `Trusted brand · ${product.brand}`,
                product.category && `Category · ${product.category}`,
                "Authentic with full warranty",
                "Ships from the UAE",
                "30-day easy returns",
              ]
                .filter(Boolean)
                .map((line) => (
                  <li key={line as string} className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-16 md:mt-20">
            <SectionHeader
              eyebrow="You might also like"
              title="Similar Products"
              href="/products"
            />
            <ProductCarousel products={similarProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
