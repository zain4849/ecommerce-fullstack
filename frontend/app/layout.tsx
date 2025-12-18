import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/navbar/NavBar";
import CartProvider from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { BlurProvider } from "@/context/BlurContext";
import Footer from "@/components/layout/Footer";
import Providers from "./providers";
import AuthInit from "./AuthInit";

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
        <Providers>
            <BlurProvider>
              <AuthInit/>
              <NavBar />
              <main className="w-full">
                {children}
              </main>
              <Footer/>
            </BlurProvider>
        </Providers>
      </body>
    </html>
  );
}
