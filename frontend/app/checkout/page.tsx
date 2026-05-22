"use client";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import CheckoutForm from "@/components/CheckoutForm";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Lock, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const items = useSelector((state: RootState) => state.cart.items);
  const router = useRouter();

  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.product.price) * i.quantity,
    0,
  );

  const { mutate: createPaymentIntent, data: clientSecret } = useMutation({
    mutationKey: ["orders", "create-intent"],
    mutationFn: async () => {
      const res = await api.post("/orders", {});
      return res.data.clientSecret as string;
    },
  });

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    // Call backend to create PaymentIntent when user visits checkout
    createPaymentIntent();
  }, [user, router, createPaymentIntent]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 min-h-[60vh]">
      <p className="text-xs text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/cart" className="hover:text-foreground">
          Cart
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground font-medium">Checkout</span>
      </p>

      <h1 className="text-2xl md:text-3xl font-black mb-1">Checkout</h1>
      <p className="text-sm text-muted-foreground mb-6 flex items-center gap-1.5">
        <Lock className="size-3.5" />
        Secure payment with 256-bit encryption
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/60 p-5 md:p-8">
          <h2 className="text-lg font-bold mb-5">Payment Details</h2>
          {!clientSecret ? (
            <div className="space-y-3">
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
              <p className="text-sm text-muted-foreground pt-2">
                Loading secure payment form…
              </p>
            </div>
          ) : (
            <Elements
              options={{
                clientSecret,
                appearance: { theme: "stripe", labels: "floating" },
              }}
              stripe={stripePromise}
            >
              <CheckoutForm />
            </Elements>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border/60 p-6 lg:sticky lg:top-24 space-y-5">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3">
                  <div className="relative size-14 rounded-lg bg-muted/40 border border-border/60 shrink-0 overflow-hidden">
                    <Image
                      src={item.product.images?.[0] ?? "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      sizes="56px"
                      className="object-contain p-1.5"
                    />
                    <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-primary text-primary-foreground text-[0.65rem] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2 leading-snug">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      AED {Number(item.product.price).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border/60 pt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">AED {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-success">
                  {subtotal >= 200 ? "Free" : "Calculated"}
                </span>
              </div>
              <div className="flex items-center justify-between text-base pt-2 border-t border-border/60">
                <span className="font-semibold">Total</span>
                <span className="font-black text-xl">
                  AED {subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground border-t border-border/60 pt-4">
              <ShieldCheck className="size-4 text-success" />
              Protected by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
