"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { isCartDrawerOpen, setIsCartDrawerOpen, cartData, removeFromCartFn, updateCountFn, isLoading } = useCart();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartDrawerOpen(false);
    };
    if (isCartDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling behind drawer
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isCartDrawerOpen, setIsCartDrawerOpen]);

  async function handleQtyChange(id: string, count: number) {
    if (count < 1) return;
    setUpdatingId(id);
    await updateCountFn(id, count);
    setUpdatingId(null);
  }

  async function handleRemove(id: string) {
    setUpdatingId(id);
    await removeFromCartFn(id);
    setUpdatingId(null);
  }

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartDrawerOpen(false)}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 bottom-0 right-0 z-[101] flex flex-col w-full max-w-md h-screen bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-100 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-emerald-600 dark:text-emerald-400" size={24} />
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-50">My Cart</h2>
                {cartData?.products && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                    {cartData.products.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-2 transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                </div>
              ) : !cartData || !cartData.products || cartData.products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-3/4 gap-4 text-center">
                  <ShoppingBag size={64} className="text-slate-200 dark:text-slate-800 animate-bounce" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Your cart is empty</h3>
                  <p className="text-sm text-slate-400 max-w-[200px]">Add some products to get started!</p>
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="px-6 py-2.5 text-sm font-bold text-white transition-all rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartData.products.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl relative"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden shrink-0">
                      <Image
                        src={item.product.imageCover}
                        alt={item.product.title}
                        fill
                        className="object-contain p-1.5"
                        sizes="80px"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 pr-6 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm truncate text-slate-900 dark:text-slate-100">
                          {item.product.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">{item.product.category?.name}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                          {item.price} EGP
                        </span>

                        {/* Quantity controls */}
                        <div className="flex items-center border rounded-lg bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
                          <button
                            onClick={() => handleQtyChange(item.product._id, item.count - 1)}
                            disabled={updatingId === item.product._id || item.count <= 1}
                            className="p-1 text-slate-400 hover:text-emerald-500 disabled:opacity-30"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-xs font-bold text-center">
                            {updatingId === item.product._id ? "..." : item.count}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item.product._id, item.count + 1)}
                            disabled={updatingId === item.product._id}
                            className="p-1 text-slate-400 hover:text-emerald-500"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      disabled={updatingId === item.product._id}
                      className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartData && cartData.products && cartData.products.length > 0 && (
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Subtotal</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {cartData.totalCartPrice} EGP
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                  Shipping and taxes calculated at checkout.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="flex items-center justify-center py-3 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <CreditCard size={16} />
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
