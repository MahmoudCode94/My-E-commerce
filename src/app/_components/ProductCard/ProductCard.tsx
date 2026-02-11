"use client";

import React, { useState } from 'react';
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from '@/api/products.api';
import Link from "next/link";
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import { Loader2, ShoppingCart } from 'lucide-react';
import Cookies from 'js-cookie';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use Context instead of local state fetching
  const { checkIsInWishlist, addToWishlistFn, removeFromWishlistFn } = useWishlist();
  const { addToCartFn } = useCart();

  // السيرفر أحياناً يستخدم id وأحياناً _id، نضمن الحصول على القيمة الصحيحة
  const productId = product.id || (product as any)._id;
  const isInWishlist = checkIsInWishlist(productId);
  const [isWishlisting, setIsWishlisting] = useState(false); // Local loading state for wishlist button
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Local loading state for cart button

  async function handleAddToCart() {
    const token = Cookies.get("userToken");

    if (!token) {
      toast.error("Please login first to shop");
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCartFn(productId);
      // Cart count updating is handled inside context
    } catch (error: any) {
      // Toast handled in context
    } finally {
      setIsAddingToCart(false);
    }
  }

  async function handleWishlistToggle() {
    setIsWishlisting(true); // Show loading spinner locally while context action finishes
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
    <Card className="relative flex flex-col justify-between pb-4 overflow-hidden transition-all duration-300 bg-white border-transparent shadow-sm group hover:shadow-xl hover:border-slate-200 min-h-[480px]">
      <Link href={`/products/${productId}`}>
        <CardHeader className="p-3 space-y-2">
          <div className="relative w-full overflow-hidden bg-transparent rounded-md h-52">
            <Image
              src={product.imageCover}
              alt={product.title}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={false}
            />
          </div>
          <div className="pt-2">
            <CardTitle className="text-base font-bold line-clamp-1 text-slate-800">{product.title}</CardTitle>
            <CardDescription className="mt-1 text-sm leading-tight line-clamp-2 text-slate-500">
              {product.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex items-center justify-between px-4 py-1">
          <p className="text-lg font-bold text-emerald-700">{product.price} <span className="text-[10px]">EGP</span></p>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
            <span className="text-xs text-yellow-500">★</span>
            <span className="text-[11px] font-bold text-slate-600">{product.ratingsAverage}</span>
          </div>
        </CardContent>
      </Link>

      <div className="flex items-center gap-2 px-3 mt-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          disabled={isAddingToCart}
          className="flex items-center justify-center gap-2 w-full bg-slate-950 text-white py-2.5 rounded-xl transition-all duration-300 hover:bg-emerald-600 active:scale-95 shadow-sm font-bold text-xs uppercase disabled:opacity-70"
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
          className="p-2.5 transition-all rounded-xl shadow-sm border border-slate-100 bg-white hover:bg-slate-50 disabled:opacity-50"
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
              className={`w-5 h-5 transition-all duration-300 ${isInWishlist ? "scale-110" : "text-slate-400 hover:text-red-500"}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          )}
        </button>
      </div>
    </Card>
  );
}