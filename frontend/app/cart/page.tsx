"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import { CartItem } from "@/types/cart";
import CartHeader from "@/components/CartHeader";
import CartRow from "@/components/CartRow";
import Image from "next/image";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/store/cartSlice";

export default function CartPage({ isBlur }) {
  const user = useSelector((state: RootState) => state.auth.user)
  // const items = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch<AppDispatch>();
  // const { items, removeItem, clearCart } = useCart();

  // const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // if (items.length === 0) return <p className="">No Items Found</p>;

  useEffect(() => {
    if (user) {
      dispatch(fetchCart())
    }
  }, [user, dispatch]) // you can remove dispatch here since it won't ever change, but some ESlint problems come in.

  const items: CartItem[] = [
    {
      product: {
        _id: "1",
        name: "Product 1",
        price: 29.99,
        images: "/categories/camera.png",
        inStock: true,
      },
      quantity: 1,
    },
    {
      product: {
        _id: "2",
        name: "Product 2",
        price: 49.99,
        images: "/categories/camera.png",
        inStock: true,
      },
      quantity: 2,
    },
    {
      product: {
        _id: "3",
        name: "Product 3",
        price: 19.99,
        images: "/categories/camera.png",
        inStock: true,
      },
      quantity: 1,
    },
    {
      product: {
        _id: "4",
        name: "Product 4",
        price: 39.99,
        images: "/categories/camera.png",
        inStock: true,
      },
      quantity: 3,
    },
    {
      product: {
        _id: "5",
        name: "Product 5",
        price: 59.99,
        images: "/categories/camera.png",
        inStock: true,
      },
      quantity: 1,
    },
    {
      product: {
        _id: "6",
        name: "Product 6",
        price: 89.99,
        images: "/categories/camera.png",
        inStock: true,
      },
      quantity: 2,
    },
  ];

  return (
    <div className="p-6 container h-fit mx-auto">
      <p className="my-12">
        {" "}
        Cameras / <b>Canon Camera</b> {/*Breadcrumb Navigation*/}
      </p>
      <h1 className="mb-4 text-2xl font-bold">Cart ({items.length})</h1>
      <div className="flex gap-4 ">
        <div className="w-9/12 border-black rounded-xl p-12">
          <CartHeader />
          <ul className="space-y-4">
            {items.map((item) => (
              <CartRow key={item.product._id} item={item} />
            ))}
          </ul>
        </div>
        <div className="self-start w-4/12 border-black border p-8 rounded-xl">
          <div className=" flex flex-col justify-between items-center gap-8 mt-6">
            <h1 className="self-start text-2xl font-bold">Cart Summary</h1>
            <div className=" w-full text-lg border-b pb-4  flex items-center justify-between gap-1">
              <div>Subtotal </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/UAE_Dirham_Symbol.svg"
                  alt="UAE-Dirham"
                  width={20}
                  height={20}
                />
                <span>499</span>
              </div>
            </div>{" "}
            <div className=" w-full text-lg border-b pb-4 flex items-center justify-between gap-1">
              <div>Shipping </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/UAE_Dirham_Symbol.svg"
                  alt="UAE-Dirham"
                  width={20}
                  height={20}
                />
                <span>499</span>
              </div>
            </div>{" "}
            <div className=" w-full text-2xl font-black flex items-center justify-between gap-1">
              <div>Total </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/UAE_Dirham_Symbol.svg"
                  alt="UAE-Dirham"
                  width={20}
                  height={20}
                />
                <span>499</span>
              </div>
            </div>{" "}
            {/*total.toFixed(2)*/}
            <Button
              variant="default"
              className="w-full p-6"
            >
              PROCEED TO CHECKOUT
            </Button>
            <Link href="checkout">
                <CheckoutButton cartItems={items} />
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
