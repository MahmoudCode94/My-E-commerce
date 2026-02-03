"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ShoppingCart, Loader2 } from 'lucide-react';

export default function AddToCartButton({ productId }: { productId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleAddToCart() {
        const token = localStorage.getItem('userToken');
        if (!token) {
            toast.error("Please login first to add items to your cart");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ productId })
            });

            const data = await res.json();

            if (data.status === "success") {
                toast.success(data.message || "Product added to cart! 🛒");
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                toast.error(data.message || "Failed to add to cart");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button 
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex items-center justify-center flex-1 gap-2 py-4 text-xs font-bold tracking-tight text-white uppercase transition-all duration-300 shadow-xl bg-slate-950 rounded-2xl hover:bg-emerald-600 active:scale-95 shadow-slate-200 disabled:opacity-70"
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