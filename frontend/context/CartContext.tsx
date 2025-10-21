'use client'

import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import React, { useState, createContext, useEffect, ReactNode, useContext } from "react";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items)) // Usually done first
  }, [items])


  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) setItems(JSON.parse(saved))              // If in local storage, 
  }, [])



  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => product.id === i.product.id);

      if (existing) {
        return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }

      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  };

  const clearCart = () => setItems([]);

  return <CartContext.Provider value={{items, addItem, removeItem, clearCart}}>
    {children}
  </CartContext.Provider>;  
};

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be inside CartProvider")
  return ctx
}

export default CartProvider;
