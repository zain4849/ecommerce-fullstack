"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CartHeader from "@/components/CartHeader";
import CartRow from "@/components/CartRow";
import Image from "next/image";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/store/cartSlice";
import { getProductId } from "@/types/product";
import { ArrowRight, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

export default function CartPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.product.price) * i.quantity,
    0,
  );
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100,
  );


  if (!user)
    return (
      <div className="container mx-auto px-4">
        <div className="my-16 max-w-md mx-auto text-center bg-card rounded-3xl border border-border/60 p-10">
          <div className="size-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-5">
            <ShoppingBag className="size-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is waiting</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to view your cart and start shopping.
          </p>
          <Link href="/auth/login">
            <Button className="w-full">Log In</Button>
          </Link>
        </div>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="container mx-auto px-4">
        <div className="my-16 max-w-md mx-auto text-center bg-card rounded-3xl border border-border/60 p-10">
          <div className="size-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-5">
            <ShoppingBag className="size-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven&apos;t added anything yet.
          </p>
          <Link href="/products">
            <Button className="w-full">Browse Products</Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 min-h-[60vh]">
      {/* Breadcrumb */}
      <p className="text-xs text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground font-medium">Cart</span>
      </p>

      <h1 className="text-2xl md:text-3xl font-black mb-6">
        Shopping Cart{" "}
        <span className="text-muted-foreground font-medium">
          ({itemCount} item{itemCount !== 1 ? "s" : ""})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border/60 p-4 md:p-8">
            <CartHeader />
            <ul>
              {items.map((item) => (
                <li key={getProductId(item.product)}>
                  <CartRow item={item} />
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent"
              >
                <ArrowRight className="size-4 rotate-180" />
                Continue shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border/60 p-6 md:p-7 lg:sticky lg:top-24 space-y-5">
            <h2 className="text-xl font-bold">Order Summary</h2>

            {/* Free shipping progress */}
            <div className="rounded-xl bg-secondary/50 p-4 border border-border/40">
              {remainingForFreeShipping > 0 ? (
                <p className="text-sm">
                  Add{" "}
                  <span className="font-bold text-primary">
                    AED {remainingForFreeShipping.toFixed(2)}
                  </span>{" "}
                  more for <b>free shipping</b>
                </p>
              ) : (
                <p className="text-sm font-semibold text-success flex items-center gap-1.5">
                  <Truck className="size-4" /> You&apos;ve unlocked free shipping!
                </p>
              )}
              <div className="mt-3 h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="flex items-center gap-1 font-medium">
                  <Image
                    src="/UAE_Dirham_Symbol.svg"
                    alt="AED"
                    width={14}
                    height={14}
                  />
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-success">
                  {subtotal >= freeShippingThreshold ? "Free" : "Calculated at checkout"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Estimated tax</span>
                <span className="font-medium">Included</span>
              </div>
            </div>

            <div className="border-t border-border/60 pt-4 flex items-center justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="text-2xl font-black flex items-center gap-1.5">
                <Image
                  src="/UAE_Dirham_Symbol.svg"
                  alt="AED"
                  width={18}
                  height={18}
                />
                {subtotal.toFixed(2)}
              </span>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full h-12 text-base gap-2 rounded-xl">
                Proceed to checkout
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
              <ShieldCheck className="size-3.5" />
              Secure checkout powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
