"use client";

import React, { useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { Loader2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddWishlistButton({ productId }: { productId: string }) {
  const { checkIsInWishlist, addToWishlistFn, removeFromWishlistFn } = useWishlist();
  const [isWishlisting, setIsWishlisting] = useState(false);

  const isInWishlist = checkIsInWishlist(productId);

  async function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

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
    <motion.button
      onClick={handleWishlistToggle}
      animate={isInWishlist ? { scale: 1.2 } : { scale: 1 }}
      transition={{ duration: 0.25, type: "tween" }}
      whileTap={{ scale: 0.9 }}
      className={`z-10 flex items-center justify-center p-4 border rounded-full shadow-sm backdrop-blur-md disabled:opacity-50 transition-colors
        ${isInWishlist
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30'
          : 'bg-white/70 dark:bg-slate-900/70 border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800'
        }
      `}
    >
      {isWishlisting ? (
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      ) : (
        <Heart
          className={`w-6 h-6 transition-all duration-300 
            ${isInWishlist
              ? 'text-red-500 fill-red-500'
              : 'text-slate-600 dark:text-slate-300 hover:text-red-500 hover:fill-red-500'
            }
          `}
        />
      )}
    </motion.button>
  );
}