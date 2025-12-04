"use client";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import CheckoutForm from "@/components/CheckoutForm";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/api";



export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // Call backend to create PaymentIntent when user visits checkout
    const createPaymentIntent = async () => {
      await api
        .post("/orders", {
          /* pass cart items if needed */
        })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch(console.error);
    };
    // fetch("/api/orders", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     /* pass cart items if needed */
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => setClientSecret(data.clientSecret))
    //   .catch(console.error);
    createPaymentIntent();
  }, []);

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  if (!clientSecret) return <p>Loading payment...</p>

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p>Loading payment form...</p>
      )}
    </div>
  );
}
