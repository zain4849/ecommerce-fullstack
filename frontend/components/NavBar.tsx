"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";

export default function NavBar() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  console.log(user)

  return (
    <header className="p-4 shadow bg-white">
      <nav className="container flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          Shop
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <span>{user.email}</span>
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/register">Register</Link>
            </>
          )}
          <Link href="/cart">Cart ({items.length})</Link>
          <Link href="/products">Products</Link>
        </div>
      </nav>
    </header>
  );
}
