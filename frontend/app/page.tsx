"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
// import { getHealth } from "@/lib/test";
import { useEffect, useState } from "react";
// import { getHealth } from "../lib/api";

export default function Home() {
  const { addItem } = useCart();

  const products = [
    { id: '1', name: "Product 1", price: 29.99 },
    { id: '2', name: "Product 2", price: 49.99 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="shadow hover:shadow-lg transition">
          <CardContent className="p-4">
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-500 flex items-center gap-1"><img src="/UAE_Dirham_Symbol.svg" alt="UAE-Dirham" className="w-3" />{product.price}</p>
            <Button className="mt-4 w-full cursor-pointer" onClick={() => addItem(product)}>
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
