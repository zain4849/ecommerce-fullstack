"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import ProductCarousel from "@/components/layout/product/ProductCarousel";
import Image from "next/image";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addItem, updateQuantity } from "@/store/cartSlice";

export default function ProductDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const params = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    setError(false);

    api
      .get(`/products/${params.id}`)
      .then((res) => {
        if (res.data) {
          setProduct(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    api
      .get("/products")
      .then((res) => {
        const others = (res.data as Product[]).filter(
          (p) => p._id !== params.id,
        );
        setSimilarProducts(others.slice(0, 6));
      })
      .catch(() => {});
  }, [params.id]);

  // Deterministic rating from product ID
  const getRating = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
    return (Math.abs(hash) % 2) + 4;
  };

  if (loading) {
    return (
      <div className="p-6 mx-auto container w-full min-h-[70vh] pt-24">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="flex justify-center gap-16 lg:gap-36">
          <div className="w-[400px] h-[400px] bg-gray-200 rounded animate-pulse" />
          <div className="w-120 space-y-4">
            <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 min-h-[60vh]">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-semibold mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">
          This product may have been removed or doesn&apos;t exist.
        </p>
        <Link href="/products">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    );
  }

  const cartItem = cartItems.find((i) => i.product._id === product._id);
  const rating = getRating(product._id);
  const reviewCount = Math.abs(
    parseInt(product._id.slice(-4), 16) % 200,
  ) + 12;

  return (
    <div className="p-6 mx-auto container w-full min-h-[70vh] pt-24">
      <p className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">Home</Link>
        {" / "}
        <Link href="/products" className="hover:text-foreground">Products</Link>
        {product.category && (
          <>
            {" / "}
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-foreground"
            >
              {product.category}
            </Link>
          </>
        )}
        {" / "}
        <b className="text-foreground">{product.name}</b>
      </p>

      <div className="flex flex-col lg:flex-row justify-center gap-12 lg:gap-24">
        {/* Images */}
        <div className="flex flex-col items-center">
          <div className="relative w-[350px] h-[350px] lg:w-[400px] lg:h-[400px] bg-gray-50 rounded-lg">
            <Image
              src={product.images?.[selectedImage] ?? "/placeholder.svg"}
              fill
              alt={product.name}
              className="object-contain p-4"
              sizes="400px"
            />
          </div>
          {(product.images?.length ?? 0) > 1 && (
            <div className="flex mt-6 gap-4 justify-center">
              {product.images?.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 rounded border-2 transition ${
                    selectedImage === idx
                      ? "border-accent"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={img}
                    fill
                    alt={`${product.name} ${idx + 1}`}
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="w-full lg:w-[480px] flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl lg:text-[2.5rem] font-bold leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) =>
                  star <= rating ? (
                    <FaStar key={star} size={20} className="text-yellow-400" />
                  ) : (
                    <FaRegStar key={star} size={20} className="text-yellow-400" />
                  ),
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                ({reviewCount} reviews)
              </span>
            </div>
            <p className="text-2xl font-bold flex items-center gap-1">
              <Image
                src="/UAE_Dirham_Symbol.svg"
                alt="AED"
                width={22}
                height={22}
              />
              {product.price.toFixed(2)}
            </p>
            <div className="flex items-center gap-2">
              {product.inStock !== false ? (
                <span className="text-sm text-green-600 font-medium">✓ In Stock</span>
              ) : (
                <span className="text-sm text-red-500 font-medium">✗ Out of Stock</span>
              )}
              {product.stock !== undefined && product.stock > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({product.stock} available)
                </span>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {product.description ?? "No description available."}
            </p>
          </div>

          <hr />

          {/* Category badge */}
          {product.category && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Category:</span>
              <Link
                href={`/products?category=${product.category}`}
                className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition"
              >
                {product.category}
              </Link>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <Button
                size="sm"
                variant="ghost"
                className="px-4 py-2"
                onClick={() =>
                  dispatch(
                    updateQuantity({ productId: product._id, delta: -1 }),
                  )
                }
                disabled={!cartItem || cartItem.quantity <= 0}
              >
                −
              </Button>
              <span className="w-10 text-center font-medium">
                {cartItem?.quantity ?? 0}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="px-4 py-2"
                onClick={() =>
                  dispatch(
                    updateQuantity({ productId: product._id, delta: 1 }),
                  )
                }
                disabled={
                  product.stock !== undefined &&
                  (cartItem?.quantity ?? 0) >= product.stock
                }
              >
                +
              </Button>
            </div>
          </div>

          <Button
            className="w-full py-6 text-lg"
            onClick={() => dispatch(addItem(product))}
            disabled={product.inStock === false}
          >
            {product.inStock === false ? "Out of Stock" : "Add To Cart"}
          </Button>

          {/* Shipping info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>🚚</span>
              <span>Free delivery on orders over AED 200</span>
            </div>
            <div className="flex items-center gap-2">
              <span>↩️</span>
              <span>Free 30-day returns</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Secure checkout with Stripe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-[2rem] font-black mb-12 text-center">
            Similar Products
          </h2>
          <ProductCarousel products={similarProducts} />
        </div>
      )}
    </div>
  );
}
