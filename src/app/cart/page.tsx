"use client";

import React, { useEffect, useState } from "react";
import { getUserCart, updateProductCount, removeCartItem, clearUserCart } from "@/api/cart.api";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Trash2, Plus, Minus, ShoppingBag, Loader2, CreditCard } from "lucide-react";
// تصحيح المسار بناءً على هيكلة ملفاتك
import CheckoutModal from "../_components/CheckoutModal";

interface Product {
  _id: string;
  title: string;
  imageCover: string;
}

interface CartItem {
  count: number;
  price: number;
  product: Product;
}

interface CartData {
  _id: string;
  totalCartPrice: number;
  products: CartItem[];
}

export default function CartPage() {
    const [cartDetails, setCartDetails] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    async function getCart() {
        try {
            const data = await getUserCart();
            if (data.status === "success") {
                setCartDetails(data.data);
            }
        } catch (error) {
            toast.error("Failed to load cart");
        } finally {
            setLoading(false);
        }
    }
    async function updateCount(id: string, count: number) {
        if (count < 1) return;
        setUpdatingId(id);
        try {
            const data = await updateProductCount(id, count);
            if (data.status === "success") {
                setCartDetails(data.data);
                toast.success("Quantity updated");
                window.dispatchEvent(new Event("cartUpdated"));
            }
        } catch (error) {
            toast.error("Error updating quantity");
        } finally {
            setUpdatingId(null);
        }
    }
    async function removeItem(id: string) {
        setUpdatingId(id);
        try {
            const data = await removeCartItem(id);
            if (data.status === "success") {
                setCartDetails(data.data);
                toast.success("Item removed");
                window.dispatchEvent(new Event("cartUpdated"));
            }
        } catch (error) {
            toast.error("Failed to remove item");
        } finally {
            setUpdatingId(null);
        }
    }
    async function clearAll() {
        try {
            const data = await clearUserCart();
            if (data.message === "success") {
                setCartDetails(null);
                toast.success("Cart cleared");
                window.dispatchEvent(new Event("cartUpdated"));
            }
        } catch (error) {
            toast.error("Failed to clear cart");
        }
    }
    useEffect(() => { getCart(); }, []);
    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        </div>
    );
    if (!cartDetails || cartDetails.products.length === 0) return (
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
                    <p className="mt-2 text-slate-500">You have {cartDetails.products.length} items in your bag</p>
                </div>
                <button onClick={clearAll} className="flex items-center gap-2 px-4 py-2 font-medium text-red-500 transition-all rounded-lg hover:bg-red-50">
                    <Trash2 size={18} /> Clear Cart
                </button>
            </div>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    {cartDetails.products.map((item) => (
                        <div key={item.product._id} className="flex items-center gap-4 p-4 bg-white border shadow-sm rounded-2xl border-slate-100">
                            <div className="relative w-24 h-24 overflow-hidden border rounded-xl bg-slate-50">
                                <Image src={item.product.imageCover} alt={item.product.title} fill className="object-contain p-2" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold truncate text-slate-900">{item.product.title}</h3>
                                <p className="mt-1 font-bold text-emerald-600">{item.price} EGP</p>
                                
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center border rounded-lg bg-slate-50">
                                        <button 
                                            onClick={() => updateCount(item.product._id, item.count - 1)}
                                            className="p-1 hover:text-emerald-600 disabled:opacity-30"
                                            disabled={updatingId === item.product._id || item.count <= 1}
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="w-8 text-sm font-bold text-center">
                                            {updatingId === item.product._id ? "..." : item.count}
                                        </span>
                                        <button 
                                            onClick={() => updateCount(item.product._id, item.count + 1)}
                                            className="p-1 hover:text-emerald-600"
                                            disabled={updatingId === item.product._id}
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => removeItem(item.product._id)} 
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
                        <div className="pb-6 space-y-4 border-b border-slate-700">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span className="text-white">{cartDetails.totalCartPrice} EGP</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Shipping</span>
                                <span className="font-bold text-emerald-400">FREE</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-6 mb-8">
                            <span className="text-lg">Total</span>
                            <span className="text-3xl font-black text-emerald-400">{cartDetails.totalCartPrice} EGP</span>
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
            {cartDetails && (
              <CheckoutModal 
                  isOpen={isCheckoutOpen} 
                  onClose={() => setIsCheckoutOpen(false)} 
                  cartId={cartDetails._id} 
              />
            )}
        </div>
    );
}