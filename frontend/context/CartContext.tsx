"use client";

import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import React, {
  useState,
  createContext,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import User from "@/types/user";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";
import { log } from "console";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // const sendToCart = async () => {
  //   const res = await api.post('/cart', {items})
  // }

  useEffect(() => {
    // if cart is in localStorage no need to go to backend
    // const saved = localStorage.getItem('cart')
    // if (saved)
    // setItems(JSON.parse(saved))              // If in local storage,
    // Get the cart from backend DB
    // else {
    // if (user)
    const fetchCart = async () => {
      console.log("Cart pro");

      // if (user) return
      if (!user) return;

      try {
        const res = await api.get(`/cart`);
        const cartData = res.data;

        console.log(res.data);

        if (cartData?.items) {
          const formattedItems: CartItem[] = cartData.items.map(
            (item: any) => ({
              product: {
                id: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                stock: item.productId.stock,
                images: item.productId.images,
              },
              quantity: item.quantity,
            })
          );

          setItems(formattedItems);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Error fetching cart", err);
      }
    };

    fetchCart();
    // Set items to be that
    // Set localStorage to be that, persist accross pages
    // setItems(JSON.parse(saved)), This makes more sense but TS wanna check if saved is null LOL
  }, [user]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items)); // Usually done first
  }, [items]);

  const addItem = async (product: Product) => {
    const prevItems = items; // capture current state for rollback, MAINTAIN SYNC w/ backend

    setItems((prev) => {
      const existing = prev.find((i) => product._id === i.product._id);

      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...prev, { product, quantity: 1 }];
    });

    try {
      console.log(product);
      await api.post("/cart", { productId: product._id, quantity: 1 });
    } catch (err) {
      console.error("Failed to add item to cart", err);
      setItems(prevItems); // rollback UI
    }
  };

  const removeItem = async (productId: string) => {
    const prevItems = items; // capture current state for rollback, MAINTAIN SYNC w/ backend

    setItems((prev) => prev.filter((i) => i.product._id !== productId));

    try {
      await api.delete(`/cart/${productId}`);
    } catch (err) {
      console.error("Failed to remove item from cart", err);
      setItems(prevItems); // rollback UI
    }
  };

  /* =======================
     Increase quantity (+)
     ======================= */
  const increaseQuantity = async (productId: string) => {
    const prev = items; // used for catch block

    const item = items.find((i) => i.product._id === productId);
    if (!item || item.quantity >= item.product.stock) return;

    setItems((prev) =>
      prev.map((i) =>
        i.product._id === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );

    try {
      await api.patch(`/cart/${productId}`, { delta: 1 }); // this only increases in user's cart, NOT Product stock
    } catch (err) {
      console.error("Increase failed", err);
      setItems(prev);
    }
  };

  /* =======================
     Decrease quantity (-)
     ======================= */
  const decreaseQuantity = async (productId: string) => {
    const prev = items; // used for catch block

    const item = items.find((i) => i.product._id === productId);
    if (!item) return;

    setItems((prev) =>
      item.quantity === 1
        ? prev.filter((i) => i.product._id !== productId)
        : prev.map((i) =>
            i.product._id === productId ? { ...i, quantity: i.quantity - 1 } : i
          )
    );

    try {
      await api.patch(`/cart/${productId}`, { delta: -1 }); // this only reduces from user's cart, NOT Product stock
    } catch (err) {
      console.error("Decrease failed", err);
      setItems(prev);
    }
  };

  const clearCart = async () => {
    const prevItems = items;

    setItems([]);

    try {
      await api.delete("/cart");
    } catch (err) {
      console.error("Failed to remove item:", err);
      setItems(prevItems);
    }
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

export default CartProvider;
