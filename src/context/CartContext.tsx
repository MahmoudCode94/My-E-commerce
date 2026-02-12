'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserCart, addProductToCart, updateProductCount, removeCartItem, clearUserCart, applyCoupon, CartData } from '@/api/cart.api';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface CartContextType {
    cartCount: number;
    cartData: CartData | null;
    isLoading: boolean;
    addToCartFn: (productId: string) => Promise<void>;
    updateCountFn: (productId: string, count: number) => Promise<void>;
    removeFromCartFn: (productId: string) => Promise<void>;
    clearCartFn: () => Promise<void>;
    applyCouponFn: (couponName: string) => Promise<void>;
    syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartCount, setCartCount] = useState(0);
    const [cartData, setCartData] = useState<CartData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const syncCart = useCallback(async () => {
        const token = Cookies.get('userToken');
        if (!token) {
            setCartCount(0);
            setCartData(null);
            setIsLoading(false);
            return;
        }

        try {
            const res = await getUserCart();
            if (res?.status === 'success') {
                setCartCount(res.numOfCartItems || 0);
                setCartData(res.data);
            }
        } catch (error: any) {
            console.error('❌ Failed to sync cart:', error.message || error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        syncCart();

        const handleAuthChange = () => syncCart();
        window.addEventListener('userLogin', handleAuthChange);
        window.addEventListener('cartUpdated', handleAuthChange);

        return () => {
            window.removeEventListener('userLogin', handleAuthChange);
            window.removeEventListener('cartUpdated', handleAuthChange);
        };
    }, [syncCart]);

    const addToCartFn = async (productId: string) => {
        const token = Cookies.get('userToken');
        if (!token) {
            toast.error('Please login first to shop');
            return;
        }

        try {
            const res = await addProductToCart(productId);
            if (res?.status === 'success') {
                setCartCount(res.numOfCartItems || cartCount + 1);
                if (res.data) setCartData(res.data);
                toast.success(res.message || 'Added to cart successfully! 🛒');
            } else {
                throw new Error(res?.message || 'Failed to add');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to add to cart');
        }
    };

    const updateCountFn = async (productId: string, count: number) => {
        try {
            const res = await updateProductCount(productId, count);
            if (res?.status === 'success') {
                setCartCount(res.numOfCartItems || 0);
                setCartData(res.data);
                toast.success('Cart updated');
            }
        } catch (error: any) {
            toast.error('Failed to update cart');
        }
    };

    const removeFromCartFn = async (productId: string) => {
        try {
            const res = await removeCartItem(productId);
            if (res?.status === 'success') {
                setCartCount(res.numOfCartItems || 0);
                setCartData(res.data);
                toast.success('Item removed');
            }
        } catch (error: any) {
            toast.error('Failed to remove item');
        }
    };

    const clearCartFn = async () => {
        try {
            const res = await clearUserCart();
            if (res?.message === 'success') {
                setCartCount(0);
                setCartData({ _id: '', totalCartPrice: 0, products: [] });
                toast.success('Cart cleared');
            }
        } catch (error: any) {
            toast.error('Failed to clear cart');
        }
    };

    const applyCouponFn = async (couponName: string) => {
        try {
            const res = await applyCoupon(couponName);
            if (res?.status === 'success') {
                setCartData(res.data);
                toast.success('Coupon applied successfully! 🎉');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to apply coupon');
        }
    };

    return (
        <CartContext.Provider value={{ cartCount, cartData, isLoading, addToCartFn, updateCountFn, removeFromCartFn, clearCartFn, applyCouponFn, syncCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
