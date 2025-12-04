"use client";

import { useCart } from "@/context/CartContext";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const {clearCart} = useCart()
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/success`,
      },
      redirect: "if_required",
    });


    if (error) {
      setMessage(error.message!);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment successful!");

      // After success backend logic changes order status to paid and removes necessary # product from stock
      clearCart()
      window.location.href = "/orders/success";
    }

    setLoading(false);
  };

    /* 
    After the handSubmit returns Promise, final status is validated by webhook on the server
    What handleSubmit does above:
    1. Sends the card info directly to Stripe’s servers (securely).
    2. Stripe tries to confirm the payment.
    3. If successful, the PaymentIntent status becomes "succeeded".
    4. Your UI can optimistically show a success message or redirect.
    ** But at this point, your database still doesn’t know the order is paid. That’s where the webhook comes in.
    1. When the payment completes, Stripe automatically sends a webhook (HTTP POST) to your backend at the URL you configured:
      POST https://your-backend.com/api/stripe/webhook, with a payload like this:

      {
        "type": "payment_intent.succeeded", 
        "data": {
          "object": {
            "id": "pi_123456789",
            "amount": 5000,
            "metadata": { "orderId": "abc123" }
          }
        }
      }
    */

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {message && <div className="text-red-500 mt-2">{message}</div>}
    </form>
  );
}
