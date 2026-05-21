"use client";

import React, { useEffect, useState } from 'react';
import { getSpecificProduct, Product } from '@/api/products.api';
import ProductCard from './ProductCard/ProductCard';
import { motion } from 'framer-motion';

export default function RecentlyViewed({ currentProductId }: { currentProductId: string }) {
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchRecent() {
            try {
                const ids = JSON.parse(localStorage.getItem('freshcart_recently_viewed') || '[]');
                const otherIds = ids.filter((id: string) => id !== currentProductId).slice(0, 4);
                
                if (otherIds.length === 0) {
                    setIsLoading(false);
                    return;
                }

                const data = await Promise.all(
                    otherIds.map(async (id: string) => {
                        try {
                            const p = await getSpecificProduct(id);
                            return p;
                        } catch {
                            return null;
                        }
                    })
                );

                setRecentProducts(data.filter((p): p is Product => p !== null));
            } catch (err) {
                console.error("Error loading recently viewed:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchRecent();
    }, [currentProductId]);

    if (isLoading || recentProducts.length === 0) return null;

    return (
        <div className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex flex-col items-center md:items-start mb-8 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-1">Based on your activity</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">Recently Viewed Products</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {recentProducts.map((product, idx) => (
                    <motion.div
                        key={product._id || product.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
