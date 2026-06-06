import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/navbar/NavBar";
import Footer from "@/components/layout/Footer";
import Providers from "./providers";
import AuthInit from "./AuthInit";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins", // optional CSS variable
});

export const metadata: Metadata = {
  title: "ZELECT — Demo Store (Portfolio Project)",
  description: "Demo store for portfolio project. Features products, cart, checkout, and order tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`} suppressHydrationWarning>
      {/* Extensions (e.g. ColorZilla) inject attributes on <body>; suppressHydrationWarning avoids false-positive hydration errors. */}
      <body className={`antialiased bg-background`} suppressHydrationWarning>
        <Providers>
          <AuthInit />
          <NavBar />
          <main className="w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
