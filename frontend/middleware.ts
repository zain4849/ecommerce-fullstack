import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // library for verifying JWT tokens

type JwtPayload = {
  id: string;
  role: "CUSTOMER" | "ADMIN" | "customer" | "admin";
};

async function verifyToken(token: string): Promise<JwtPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname: string = request.nextUrl.pathname;
  const token: string | undefined = request.cookies.get("token")?.value;
  const payload: JwtPayload | null = token ? await verifyToken(token) : null;

  const isProtected =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/cart");

  if (isProtected && !payload) { // authentication required
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname.startsWith("/admin")) { // authorization required
    const role = payload?.role?.toString().toUpperCase();
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Note: a user logged in but nothing in cart, can still go to /checkout but cannot proceed to payment (backend will block it)
  
  return NextResponse.next(); // means everything is fine, continue to the requested page
}

export const config = { // tells the server which paths to run the middleware on
  matcher: ["/admin/:path*", "/checkout/:path*", "/orders/:path*", "/cart/:path*"], // Easier than going to each page and adding the middleware
};
