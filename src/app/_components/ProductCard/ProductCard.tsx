"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from '@/api/products.api';
import Link from "next/link";
import { addToWishlist, removeFromWishlist, getWishlist } from '@/api/wishlist.api';
import toast from 'react-hot-toast';
import { Loader2, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const productId = product.id || product._id;

  useEffect(() => {
    async function checkWishlistStatus() {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      try {
        const data = await getWishlist();
        if (data.status === "success") {
          const found = data.data.some((item: any) => item._id === productId);
          setIsInWishlist(found);
        }
      } catch (error) {
        console.error("Wishlist check failed");
      }
    }
    checkWishlistStatus();
  }, [productId]);

  async function handleAddToCart() {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first to shop");
      return;
    }

    setIsAddingToCart(true);
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success(data.message || "Added to cart successfully! 🛒");
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error(data.message || "Failed to add to cart");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsAddingToCart(false);
    }
  }

  async function handleWishlistToggle() {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    setIsWishlisting(true);
    try {
      if (isInWishlist) {
        const data = await removeFromWishlist(productId);
        if (data.status === "success") {
          setIsInWishlist(false);
          toast.success("Removed from wishlist");
          window.dispatchEvent(new Event("wishlistUpdated"));
        }
      } else {
        const data = await addToWishlist(productId);
        if (data.status === "success") {
          setIsInWishlist(true);
          toast.success("Added to wishlist! ❤️");
          window.dispatchEvent(new Event("wishlistUpdated"));
        }
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setIsWishlisting(false);
    }
  }

  return (
    <Card className="relative flex flex-col justify-between pb-4 overflow-hidden transition-all duration-300 bg-white border-transparent shadow-sm group hover:shadow-xl hover:border-slate-200 min-h-120">
      <Link href={`/products/${productId}`}>
        <CardHeader className="p-3 space-y-2">
          <div className="relative w-full overflow-hidden bg-transparent rounded-md h-52">
            <Image
              src={product.imageCover}
              alt={product.title}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
          <div>
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

      <div className='flex items-center gap-2 px-3 mt-4'>
        <button 
          onClick={handleAddToCart}
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
          onClick={handleWishlistToggle}
          disabled={isWishlisting}
          className="p-2.5 transition-all rounded-xl shadow-sm border border-slate-100 bg-white hover:bg-slate-50 group/heart hover:scale-105 disabled:opacity-50"
        >
          {isWishlisting ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill={isInWishlist ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              className={`w-5 h-5 transition-colors ${isInWishlist ? "text-red-500" : "text-slate-400 group-hover/heart:text-red-500"}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          )}
        </button>
      </div>
    </Card>
  );
}