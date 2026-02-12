'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '@/api/wishlist.api';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface WishlistContextType {
    wishlistIds: Set<string>;
    wishlistCount: number;
    isLoading: boolean;
    addToWishlistFn: (productId: string) => Promise<void>;
    removeFromWishlistFn: (productId: string) => Promise<void>;
    checkIsInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
    const [wishlistCount, setWishlistCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const syncWishlist = useCallback(async () => {
        const token = Cookies.get('userToken');
        if (!token) {
            setWishlistIds(new Set());
            setWishlistCount(0);
            setIsLoading(false);
            return;
        }

        try {
            const res = await getWishlist();
            if (res?.status === 'success' && Array.isArray(res.data)) {
                const ids = new Set(res.data.map((item: any) => item._id || item.id));
                setWishlistIds(ids);
                setWishlistCount(res.count || res.data.length);
            }
        } catch (error) {
            console.error('Failed to sync wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        syncWishlist();

        const handleAuthChange = () => syncWishlist();
        window.addEventListener('userLogin', handleAuthChange);

        return () => {
            window.removeEventListener('userLogin', handleAuthChange);
        };
    }, [syncWishlist]);

    const addToWishlistFn = async (productId: string) => {
        const token = Cookies.get('userToken');
        if (!token) {
            toast.error('Please login first');
            return;
        }

        setWishlistIds(prev => new Set(prev).add(productId));
        setWishlistCount(prev => prev + 1);

        try {
            const res = await addToWishlist(productId);
            if (res?.status !== 'success') {
                throw new Error(res?.message || 'Failed to add');
            }
            toast.success('Added to wishlist! ❤️');
        } catch (error: any) {
            setWishlistIds(prev => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
            setWishlistCount(prev => prev - 1);
            toast.error(error.message || 'Could not add product');
        }
    };

    const removeFromWishlistFn = async (productId: string) => {
        const token = Cookies.get('userToken');
        if (!token) return;

        setWishlistIds(prev => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
        });
        setWishlistCount(prev => Math.max(0, prev - 1));

        try {
            const res = await removeFromWishlist(productId);
            if (res?.status !== 'success') {
                throw new Error(res?.message || 'Failed to remove');
            }
            toast.success('Removed from wishlist');
        } catch (error: any) {
            setWishlistIds(prev => new Set(prev).add(productId));
            setWishlistCount(prev => prev + 1);
            toast.error(error.message || 'Could not remove product');
        }
    };

    const checkIsInWishlist = (productId: string) => wishlistIds.has(productId);

    return (
        <WishlistContext.Provider value={{ wishlistIds, wishlistCount, isLoading, addToWishlistFn, removeFromWishlistFn, checkIsInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
