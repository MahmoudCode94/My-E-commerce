"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, Loader2, CreditCard, Ticket } from "lucide-react";
import CheckoutModal from "@/app/_components/CheckoutModal";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { cartData, isLoading: loading, updateCountFn, removeFromCartFn, clearCartFn, applyCouponFn } = useCart();
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string>("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);

    async function handleUpdateCount(id: string, count: number) {
        if (count < 1) return;
        setUpdatingId(id);
        await updateCountFn(id, count);
        setUpdatingId(null);
    }

    async function handleRemoveItem(id: string) {
        setUpdatingId(id);
        await removeFromCartFn(id);
        setUpdatingId(null);
    }

    async function handleClearAll() {
        await clearCartFn();
    }

    async function handleApplyCoupon() {
        if (!couponCode.trim()) {
            return;
        }
        setIsApplyingCoupon(true);
        await applyCouponFn(couponCode);
        setCouponCode("");
        setIsApplyingCoupon(false);
    }

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        </div>
    );

    if (!cartData || !cartData.products || cartData.products.length === 0) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <ShoppingBag size={80} className="text-slate-200" />
            <h2 className="text-2xl font-bold text-slate-800">Your cart is empty</h2>
            <Link href="/" className="px-8 py-3 text-white transition-all rounded-full bg-emerald-600 hover:bg-emerald-700">
                Start Shopping
            </Link>
        </div>
    );

    return (
        <div className="max-w-6xl px-4 py-12 mx-auto">
            <div className="flex items-end justify-between pb-6 mb-8 border-b">
                <div>
                    <h1 className="text-4xl font-black text-slate-900">Shopping Cart</h1>
                    <p className="mt-2 text-slate-500">You have {cartData.products.length} items</p>
                </div>
                <button onClick={handleClearAll} className="flex items-center gap-2 px-4 py-2 font-medium text-red-500 transition-all rounded-lg hover:bg-red-50">
                    <Trash2 size={18} /> Clear Cart
                </button>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    {cartData.products.map((item) => (
                        <div key={item.product._id} className="flex items-center gap-4 p-4 transition-all bg-white border shadow-sm rounded-2xl border-slate-100 hover:border-emerald-100">
                            <div className="relative w-24 h-24 overflow-hidden border rounded-xl bg-slate-50">
                                <Image src={item.product.imageCover} alt={item.product.title} fill className="object-contain p-2" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold truncate text-slate-900">{item.product.title}</h3>
                                <p className="mt-1 font-bold text-emerald-600">{item.price} EGP</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center border rounded-lg bg-slate-50">
                                        <button
                                            onClick={() => handleUpdateCount(item.product._id, item.count - 1)}
                                            className="p-1 hover:text-emerald-600 disabled:opacity-30"
                                            disabled={updatingId === item.product._id || item.count <= 1}
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="w-10 text-sm font-bold text-center">
                                            {updatingId === item.product._id ? "..." : item.count}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateCount(item.product._id, item.count + 1)}
                                            className="p-1 hover:text-emerald-600"
                                            disabled={updatingId === item.product._id}
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.product._id)}
                                        disabled={updatingId === item.product._id}
                                        className="transition-colors text-slate-400 hover:text-red-500 disabled:opacity-50"
                                    >
                                        {updatingId === item.product._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] sticky top-24 shadow-2xl">
                        <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

                        <div className="pb-6 mb-6 border-b border-slate-700">
                            <label className="block mb-3 text-sm font-medium text-slate-400">Have a coupon?</label>
                            <div className="flex gap-2 p-1.5 bg-slate-800 rounded-2xl border border-slate-700 focus-within:border-emerald-500 transition-colors">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="flex-1 bg-transparent px-3 py-2 outline-none text-sm placeholder:text-slate-600"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={isApplyingCoupon || !couponCode.trim()}
                                    className="px-4 py-2 font-bold text-xs text-white transition-all bg-emerald-600 rounded-xl hover:bg-emerald-500 disabled:opacity-50 disabled:bg-slate-700 flex items-center gap-2"
                                >
                                    {isApplyingCoupon ? <Loader2 size={14} className="animate-spin" /> : <Ticket size={14} />}
                                    Apply
                                </button>
                            </div>
                        </div>

                        <div className="pb-6 space-y-4 border-b border-slate-700">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span className="text-white">{cartData.totalCartPrice} EGP</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Shipping</span>
                                <span className="font-bold text-emerald-400">FREE</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-6 mb-8">
                            <span className="text-lg">Total</span>
                            <span className="text-3xl font-black text-emerald-400">{cartData.totalCartPrice} EGP</span>
                        </div>
                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            className="flex items-center justify-center w-full gap-2 py-4 font-bold text-white transition-all bg-emerald-500 rounded-2xl hover:bg-emerald-400 active:scale-95"
                        >
                            <CreditCard size={20} />
                            Checkout Now
                        </button>
                    </div>
                </div>
            </div>
            {cartData && (
                <CheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    cartId={cartData._id}
                />
            )}
        </div>
    );
}