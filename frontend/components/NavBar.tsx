"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation";

export default function NavBar() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname()

  return (
    <header className="shadow bg-white">
      <nav className="container flex justify-between items-center mx-auto">
        <Link href="/" className="font-bold text-xl">
          Shop
        </Link>
        <div className=""> {/* space-x-8 */}
          {user ? (
            <>
              <span>{user.email}</span>
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={cn("px-3 py-2 inline-block hover:bg-gray-200", pathname === "/auth/login" ? "bg-gray-900 text-white": "")}>Login</Link>
              <Link href="/auth/register" className={cn("px-3 py-2 inline-block hover:bg-gray-200", pathname === "/auth/register" ? "bg-gray-900 text-white": "")}>Register</Link>
            </>
          )}
          <Link href="/cart" className={cn("px-3 py-2 inline-block hover:bg-gray-200", pathname === "/cart" ? "bg-gray-900 text-white": "")}>Cart ({items.length})</Link>
          {/* <Link href="/products">Products</Link> */}
        </div>
      </nav>
    </header>
  );
}
