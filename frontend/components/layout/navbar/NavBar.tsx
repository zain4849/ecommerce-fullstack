"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useBlur from "@/context/BlurContext";
import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { RootState } from "@/store/store";
import UserDropdown from "./UserDropdown";
import LangDropdown from "./LanguageDropdown";
import { Input } from "@/components/ui/input";

export default function NavBar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user)
  const items = useSelector((state: RootState) => state.cart.items)
  const pathname = usePathname();

  return (
    <header className="shadow bg-foreground py-2 px-5 text-white z-50 top-0 sticky">
      <nav className="container text-[1rem] flex justify-around items-center mx-auto h-22 ">
        {/* Logo */}
        <Link href="/" className="font-bold text-[1.5rem]">
          ZELECT
        </Link>

        <div className="relative w-full max-w-[60%]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="py-6 pl-13 rounded-[1.15rem] bg-white text-foreground placeholder:text-gray-400"
          />
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          <div className="cursor-pointer flex justify-center items-center">
            <LangDropdown />
            <ChevronDown className="" />
          </div>
          {/* Cart link */}
          <Link
            href="/cart"
            className={cn(
              "relative px-3 py-2 inline-block rounded-md hover:bg-gray-900",
              pathname === "/cart"
                ? "bg-gray-900 text-white hover:bg-gray-700"
                : ""
            )}
          >
            <Image
              src="/Shopping_Cart.png"
              width={30}
              height={30}
              alt="Shopping Cart"
            /> 
            <div
              className="absolute top-0 right-0.5 px-1.5 bg-red-600 rounded-[50%]"
            >
            {items.length}
            </div>
          </Link>
          <UserDropdown user={user} onLogout={() => dispatch(logout())} />
        </div>
      </nav>
    </header>
  );
}



