"use client";

import React, { useState } from 'react';
import { addToWishlist } from '@/api/wishlist.api';
import toast from 'react-hot-toast';
import { Loader2, Heart } from 'lucide-react';

export default function AddWishlistButton({ productId }: { productId: string }) {
  const [isWishlisting, setIsWishlisting] = useState(false);

  async function handleWishlist() {
    setIsWishlisting(true);
    try {
      const data = await addToWishlist(productId);
      if (data.status === "success") {
        toast.success("Item added to wishlist! ❤️");
        window.dispatchEvent(new Event("wishlistUpdated"));
      } else {
        toast.error(data.message || "Failed to add");
      }
    } catch (error) {
      toast.error("Please login first");
    } finally {
      setIsWishlisting(false);
    }
  }

  return (
    <button 
      onClick={handleWishlist}
      disabled={isWishlisting}
      className="z-10 flex items-center justify-center p-4 transition-all scale-110 border rounded-full shadow-sm bg-white/70 backdrop-blur-md hover:bg-white group/heart hover:scale-125 active:scale-95 disabled:opacity-50 border-slate-100"
    >
      {isWishlisting ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      ) : (
        <Heart className="w-6 h-6 transition-colors text-slate-600 group-hover/heart:text-red-500 group-hover/heart:fill-red-500" />
      )}
    </button>
  );
}