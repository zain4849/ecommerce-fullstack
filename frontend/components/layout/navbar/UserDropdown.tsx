import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useBlur from "@/context/BlurContext";
import User from "@/types/user";
import Link from "next/link";
import { useEffect } from "react";
import { FaRegUser } from "react-icons/fa";

function UserDropdown({
  user,
  onLogout,
}: {
  user: User | null;
  onLogout: () => void;
}) {
  const { isBlur, setIsBlur } = useBlur();
  console.log("isBlur:", isBlur); // 🧭 watch if it changes

  useEffect(() => {
    console.log("isBlur:", isBlur);
  }, [isBlur]);

  // You can use a fallback avatar if no image available
  const avatarSrc =
    user?.images ||
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
        {/* <svg
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
        </svg> */}
        <FaRegUser  size={25} style={{ cursor: "pointer" }}/>

      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
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

export default UserDropdown;
