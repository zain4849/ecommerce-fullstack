"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { RootState } from "@/store/store";
import UserDropdown from "./UserDropdown";
import NavBarSearch from "./NavBarSearch";

export default function NavBar() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const items = useSelector((state: RootState) => state.cart.items);
  const pathname = usePathname();

  return (
    <header className="shadow bg-foreground py-2 px-5 text-white z-50 top-0 sticky">
      <nav className="container text-[1rem] flex justify-around items-center mx-auto h-22 ">
        {/* Logo */}
        <Link href="/" className="font-bold text-[1.5rem]">
          ZELECT
        </Link>

        <NavBarSearch />

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Admin link */}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-900",
                pathname.startsWith("/admin") ? "bg-gray-900" : "",
              )}
            >
              Admin
            </Link>
          )}
          {/* Cart link */}
          <Link
            href="/cart"
            className={cn(
              "relative px-3 py-2 inline-block rounded-md hover:bg-gray-900",
              pathname === "/cart"
                ? "bg-gray-900 text-white hover:bg-gray-700"
                : "",
            )}
          >
            <Image
              src="/Shopping_Cart.png"
              width={30}
              height={30}
              alt="Shopping Cart"
            />
            <div className="absolute top-0 right-0.5 px-1.5 bg-red-600 rounded-[50%]">
              {items.length}
            </div>
          </Link>
          <UserDropdown user={user} onLogout={() => dispatch(logout())} />
        </div>
      </nav>
    </header>
  );
}
