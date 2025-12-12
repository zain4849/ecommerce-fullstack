"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useBlur from "@/context/BlurContext";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function NavBar() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="shadow bg-foreground py-2 px-5 text-white">
      <nav className="container text-[1rem] flex justify-around items-center mx-auto h-[5.5rem] ">
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
            <LangDrop />
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
              width={25}
              height={25}
              alt="Shopping Cart"
            /> 
            <div
              className="absolute top-0 right-0.5 px-0.5 bg-red-600 rounded-full"
            >
            {items.length}
            </div>
          </Link>
          <UserDrop user={user} onLogout={logout} />
        </div>
      </nav>
    </header>
  );
}

/**
 * 🧍 User Menu Dropdown Component
 */
function LangDrop() {
  const [language, setLanguage] = useState("English");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between w-full">
          <DropdownMenuLabel className="text-[1rem]">{language}</DropdownMenuLabel>
          {/* Optionally, you could add an icon or arrow here */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 flex flex-col">
        <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
          <DropdownMenuRadioItem value="English">English</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Arabic">Arabic</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu> 
  );
}


function UserDrop({ user, onLogout }) {
  const { isBlur, setIsBlur } = useBlur();
  console.log("isBlur:", isBlur); // 🧭 watch if it changes

  useEffect(() => {
    console.log("isBlur:", isBlur);
  }, [isBlur]);

  // You can use a fallback avatar if no image available
  const avatarSrc =
    user?.image ||
    (user?.email
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`
      : "https://ui-avatars.com/api/?name=Guest");

  return (
    <DropdownMenu onOpenChange={() => setIsBlur((prev) => !prev)}>
      <DropdownMenuTrigger asChild>
        {/* <Avatar className="h-9 w-9 cursor-pointer ring-1 ring-gray-200">
          <AvatarImage src={avatarSrc} alt={user?.email || "Guest"} />
          <AvatarFallback>
            {user?.email?.[0]?.toUpperCase() || "G"}
          </AvatarFallback>
        </Avatar> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="" className="w-48">
        {user ? (
          <>
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders">My Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-red-600 focus:text-red-600"
            >
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {/* <DropdownMenuLabel>Welcome, Guest</DropdownMenuLabel> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem asChild>
              <Link
                href="/auth/login"
                className="cursor-pointer justify-center font-semibold"
              >
                Login / Sign Up
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/auth/register">Sign Up</Link>
            </DropdownMenuItem> */}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
