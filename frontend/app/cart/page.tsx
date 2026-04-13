"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CartHeader from "@/components/CartHeader";
import CartRow from "@/components/CartRow";
import Image from "next/image";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "@/store/cartSlice";

export default function CartPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  if (!user)
    return (
      <div className="text-center py-20 min-h-[60vh]">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold mb-2">Your Cart is Waiting</h2>
        <p className="text-gray-500 mb-6">Please log in to view your cart and start shopping.</p>
        <Link href="/auth/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  if (items.length === 0)
    return (
      <div className="text-center py-20 min-h-[60vh]">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );

  return (
    <div className="p-6 container h-fit mx-auto">
      <p className="my-12">
        <Link href="/">Home</Link> / <b>Cart</b>
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
                <span>{total.toFixed(2)}</span>
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
                <span>Free</span>
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
                <span>{total.toFixed(2)}</span>
              </div>
            </div>{" "}
            {/*total.toFixed(2)*/}
            <Link href="/checkout" className="w-full">
              <Button variant="default" className="w-full p-6">
                PROCEED TO CHECKOUT
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
