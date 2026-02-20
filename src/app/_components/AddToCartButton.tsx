"use client";

import React, { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ productId }: { productId: string }) {
    const { addToCartFn } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    async function handleAddToCart() {
        setIsLoading(true);
        try {
            await addToCartFn(productId);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex items-center justify-center flex-1 gap-2 py-4 text-xs font-bold tracking-tight text-white uppercase transition-all duration-300 shadow-xl bg-slate-950 dark:bg-emerald-600 rounded-2xl hover:bg-emerald-600 dark:hover:bg-emerald-700 active:scale-95 shadow-slate-200 dark:shadow-none disabled:opacity-70"
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    <ShoppingCart size={16} />
                    Add to Shopping Bag
                </>
            )}
        </button>
    );
}