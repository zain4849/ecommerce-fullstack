"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import CartProvider, { useCart } from "@/context/CartContext";
import api from "@/lib/api";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const router  = useRouter();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check if user exists
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Create Order and send to backend
    try {
      setLoading(true);
      const orderData = {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        shippingAddress: { address, city, country },
        /*
        We're destructuring state vars into into an object, under the hood looks like:

        shippingAddress: {
            address: address,
            city: city,
            country: country
        }
        */
        total,
      };

      const res = await api.post("/orders", orderData);
      clearCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Checkout Failed");
    } finally {
        setLoading(false)
    }
  };

  if (items.length === 0)
    return <p className="mt-10 text-center">No items added yet.</p>;

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <label>City</label>
          <input onChange={(e) => setCity(e.target.value)} type="text" />
        </div>
        <div>
          <label>Country</label>
          <input onChange={(e) => setCountry(e.target.value)} type="text" />
        </div>
        <div>
          <p>Total: {total}</p>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Processing ..." : "Proceed"}
        </Button>
      </form>
    </div>
  );
};

export default Checkout;
