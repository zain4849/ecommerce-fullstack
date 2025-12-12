"use client";

import React from "react";
import { useCart } from "../../context/CartContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";

export default function CartPage({isBlur}) {
  const { items, removeItem, clearCart } = useCart();

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (items.length === 0) return <p className="">No Items Found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Shopping Cart</h1>
      <ul className="space-y-4">
        {items.map((i) => ( 
          <li key={i.product._id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-semibold">{i.product.name}</p>
              <p className="text-sm text-gray-500">
                ${i.product.price.toFixed(2)} x {i.quantity}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => removeItem(i.product._id)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-6">
        <p className="text-smf flex items-center gap-1">Total <img src="/UAE_Dirham_Symbol.svg" alt="UAE-Dirham" className="w-3" />{total.toFixed(2)}</p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => clearCart}>
            Clear
          </Button>
          <Link href="checkout">
            <CheckoutButton cartItems={items}/>
          </Link>
        </div>
      </div>
    </div>
  );
}
