"use client";

import React, { useState } from "react";
// import { getStripe } from "@/lib/stripe";
import { CartItem } from "@/types/cart";

export default function CheckoutButton({ cartItems } : {cartItems: CartItem[]}) {
  // const [loading, setLoading] = useState(false);

  // const handleCheckout = async () => {
  //   setLoading(true);

  //   try {
  //     // 1️⃣ Call backend to create order & PaymentIntent
  //     const res = await fetch("/api/orders", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ items: cartItems }),
  //     });

  //     const data = await res.json();
  //     const { clientSecret } = data;

  //     // 2️⃣ Redirect user to Stripe hosted payment
  //     const stripe = await getStripe();
  //     const { error } = await stripe.confirmCardPayment(clientSecret, {
  //       payment_method: {
  //         card: {
  //           // Using Elements or custom card form here
  //           // for simplicity we can assume you have a CardElement
  //         },
  //       },
  //     });

  //     if (error) {
  //       alert(error.message);
  //     } else {
  //       alert("Payment successful!");
  //       // Optionally redirect to /orders/my or /success
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Checkout failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    // <button
    //   onClick={handleCheckout}
    //   disabled={loading || cartItems.length === 0}
    //   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    // >
    //   {loading ? "Processing..." : "Pay Now"}
    // </button>
    <>Hi</>
  );
}
