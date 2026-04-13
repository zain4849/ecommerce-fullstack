"use client";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import CheckoutForm from "@/components/CheckoutForm";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CheckoutPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    // Call backend to create PaymentIntent when user visits checkout
    const createPaymentIntent = async () => {
      await api
        .post("/orders", {})
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch(console.error);
    };
    createPaymentIntent();
  }, [user, router]);

  if (!clientSecret)
    return <p className="text-center mt-10">Loading payment...</p>;

  return (
    <div className="container mx-auto py-12 min-h-[60vh]">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <Elements
        options={{
          clientSecret,
          appearance: { theme: "stripe", labels: "floating" },
        }}
        stripe={stripePromise}
      >
        <CheckoutForm />
      </Elements>
    </div>
  );
}
