"use client";

import React, { useState } from 'react';
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from '@/api/products.api';
import Link from "next/link";
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import { Loader2, ShoppingCart } from 'lucide-react';
import { getCookie } from 'cookies-next';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { checkIsInWishlist, addToWishlistFn, removeFromWishlistFn } = useWishlist();
  const { addToCartFn } = useCart();
  const productId = product.id || (product as any)._id;
  const isInWishlist = checkIsInWishlist(productId);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  async function handleAddToCart() {
    const token = getCookie("userToken") as string | undefined;

    if (!token) {
      toast.error("Please login first to shop");
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCartFn(productId);
    } catch (error: any) {
    } finally {
      setIsAddingToCart(false);
    }
  }

  async function handleWishlistToggle() {
    setIsWishlisting(true);
    try {
      if (isInWishlist) {
        await removeFromWishlistFn(productId);
      } else {
        await addToWishlistFn(productId);
      }
    } finally {
      setIsWishlisting(false);
    }
  }

  return (
    <Card className="relative flex flex-row gap-5 pb-4 md:pb-1 overflow-hidden transition-all duration-300 bg-white dark:bg-slate-900 border-transparent shadow-sm group hover:shadow-xl hover:border-slate-200 dark:hover:border-slate-800 md:flex-col md:min-h-[440px]">
      <Link href={`/products/${productId}`} className="flex flex-row w-full gap-7 md:flex-col contents">
        <div className="relative w-1/3 shrink-0 md:w-full h-36 md:h-52 bg-transparent rounded-r-xl md:rounded-NONE p-2">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 25vw"
            priority={priority}
          />
        </div>
        <div className="flex flex-col flex-1 px-4 py-4 md:p-0 md:justify-between">
          <div className="space-y-1 md:px-4 md:pt-2">
            <h3 className="text-sm font-bold leading-tight line-clamp-2 md:line-clamp-1 text-slate-800 dark:text-slate-100">{product.title}</h3>
            <p className="text-xs leading-snug line-clamp-2 text-slate-500 dark:text-slate-400 md:text-sm">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-500">{product.price} <span className="text-[10px]">EGP</span></p>
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full border border-yellow-100 dark:border-yellow-900/30">
                <span className="text-xs text-yellow-500">★</span>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{product.ratingsAverage}</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 mt-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              disabled={isAddingToCart}
              className="flex items-center justify-center gap-2 w-full bg-slate-950 dark:bg-emerald-600 text-white py-2.5 pt-2.5 rounded-xl transition-all duration-300 hover:bg-emerald-600 dark:hover:bg-emerald-700 active:scale-95 shadow-sm font-bold text-xs uppercase disabled:opacity-70"
            >
              {isAddingToCart ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart size={15} />
                  Add to Cart
                </>
              )}
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleWishlistToggle();
              }}
              disabled={isWishlisting}
              className="p-2.5 transition-all rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              {isWishlisting ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isInWishlist ? "#ef4444" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke={isInWishlist ? "#ef4444" : "currentColor"}
                  className={`w-5 h-5 transition-all duration-300 ${isInWishlist ? "scale-110" : "text-slate-400 dark:text-slate-500 hover:text-red-500"}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2 mt-auto pt-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              disabled={isAddingToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-950 dark:bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold"
            >
              {isAddingToCart ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add to Cart"}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleWishlistToggle();
              }}
              disabled={isWishlisting}
              className="p-2 border border-slate-100 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isInWishlist ? "#ef4444" : "none"}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke={isInWishlist ? "#ef4444" : "currentColor"}
                className={`w-4 h-4 ${isInWishlist ? "" : "text-slate-400 dark:text-slate-500"}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
