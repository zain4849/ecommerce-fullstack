"use client";

import React from "react";
import { useCart } from "../../context/CartContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // if (items.length === 0) return <p className="">No Items Found</p>;

  return (
    <div>
      <h1>Shopping Cart</h1>
      <ul>
        {items.map((i) => (
          <li key={i.product.id}>
            <div>
              <p>{i.product.name}</p>
              <p>
                ${i.product.price.toFixed(2)} x {i.quantity}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => removeItem(i.product.id)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <div>
        <p>Total ${total.toFixed(2)}</p>
        <div>
          <Button variant="outline" onClick={() => clearCart}>
            Clear
          </Button>
          <Link href="checkout">
            <Button>Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
