import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./_components/Footer/Footer";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Providers } from "./providers";
import Navbar from "./_components/Navbar/Navbar";
import CartDrawer from "./_components/CartDrawer/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreshCart — Shop Online for Electronics, Fashion & More",
  description: "FreshCart is your one-stop online store for electronics, fashion, home goods, and more. Fast shipping, easy returns, and great deals every day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://ecommerce.routemisr.com" />
        <link rel="dns-prefetch" href="https://ecommerce.routemisr.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          <CartDrawer />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}