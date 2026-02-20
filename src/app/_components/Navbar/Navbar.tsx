"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart, User, LogOut, Package, ChevronDown, UserCircle, KeyRound, Menu, X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface DecodedToken {
  name?: string;
  id?: string;
  iat?: number;
  exp?: number;
}

import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, userName, logout } = useAuth();

  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
    { name: "Brands", path: "/brands" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-xl dark:bg-slate-950/90 dark:border-slate-800">
      <div className="flex items-center justify-between h-20 px-4 mx-auto md:px-6 max-w-7xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 transition-all lg:hidden text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="text-xl font-black tracking-tighter md:text-2xl text-emerald-600">
            FRESH<span className="text-slate-900 dark:text-white">CART</span>
          </Link>
        </div>

        <div className="items-center hidden gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-bold transition-colors ${isActive ? "text-emerald-600" : "text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-600"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Link href="/wishlist" className={`relative p-2 md:p-2.5 rounded-full transition-all ${pathname === '/wishlist' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                <Heart size={22} />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute top-0.5 left-0.5 flex h-4 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm border-2 border-white dark:border-slate-950">
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              <Link href="/cart" className={`relative p-2 md:p-2.5 rounded-full transition-all ${pathname === '/cart' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                <ShoppingCart size={22} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute top-0.5 left-0.5 flex h-4 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm border-2 border-white dark:border-slate-950">
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <div className="relative ml-1 md:ml-2">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1.5 transition-all border rounded-full md:pl-3 border-slate-100 dark:border-slate-800 hover:shadow-md bg-slate-50/50 dark:bg-slate-900/50">
                  <ChevronDown size={14} className={`text-slate-400 hidden md:block transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  <div className="flex items-center justify-center w-8 h-8 overflow-hidden font-bold border-2 border-white dark:border-slate-950 rounded-full shadow-sm md:w-9 md:h-9 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    <User size={18} />
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 z-20 w-56 p-2 mt-3 bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-2xl md:w-64 rounded-2xl border-slate-100">
                        <div className="px-4 py-3 mb-2 text-left border-b border-slate-50 dark:border-slate-800">
                          <p className="text-xs font-medium text-slate-400">Account</p>
                          <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">{userName}</p>
                        </div>
                        <Link href="/allorders" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"><Package size={18} className="text-emerald-600" /> My Orders</Link>
                        <Link href="/addresses" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"><MapPin size={18} className="text-emerald-600" /> My Addresses</Link>
                        <Link href="/update-profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"><UserCircle size={18} className="text-blue-600" /> Update Profile</Link>
                        <Link href="/reset-password" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"><KeyRound size={18} className="text-orange-600" /> Reset Password</Link>
                        <div className="h-px mx-2 my-2 bg-slate-100 dark:bg-slate-800" />
                        <button onClick={handleLogout} className="flex items-center w-full gap-3 px-4 py-3 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"><LogOut size={18} /> Logout</button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link href="/login" className="px-4 py-2 text-xs font-bold text-white transition-all shadow-md rounded-xl bg-slate-950 dark:bg-emerald-600 md:px-6 md:text-sm hover:bg-emerald-600 dark:hover:bg-emerald-700">Login</Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed top-0 bottom-0 left-0 right-0 w-screen h-screen z-[9998] bg-slate-900/40 backdrop-blur-md lg:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 flex flex-col h-screen bg-white dark:bg-slate-950 shadow-2xl z-[9999] w-72 lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-slate-800">
                <span className="text-xl font-black text-emerald-600">MENU</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 transition-colors rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-1 p-4 overflow-y-auto">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      href={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-4 text-base font-bold transition-all rounded-xl flex items-center ${isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-emerald-600"
                        }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
