import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import CartProvider from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { BlurProvider } from "@/context/BlurContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins", // optional CSS variable
});

export const metadata: Metadata = {
  title: "E-commerce App",
  description: "Full-stack project built with Next.js & Node.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body
        className={`antialiased bg-background`}
      >
        <AuthProvider>
          <CartProvider>
            <BlurProvider>
              <NavBar />
              <main className="w-full">
                {children}
              </main>
            </BlurProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
