'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getSpecificBrand, Brand } from '@/api/brands.api';
import ProductCard from '@/app/_components/ProductCard/ProductCard';
import { Product, getProducts } from '@/api/products.api';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { BrandOrCategorySkeleton } from '@/app/_components/Skeleton';

interface BrandInProduct {
    _id: string;
    name?: string;
    slug?: string;
    image?: string;
}

interface EnhancedProduct extends Omit<Product, 'brand'> {
    brand?: BrandInProduct | string;
}

export default function BrandDetailsPage() {
    const { id } = useParams();
    const [brand, setBrand] = useState<Brand | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadBrandData = useCallback(async () => {
        if (!id) return;
        
        try {
            setIsLoading(true);
            
            const [brandData, allProducts] = await Promise.all([
                getSpecificBrand(id as string),
                getProducts()
            ]);

            setBrand(brandData);
            
            const brandProducts = (allProducts as EnhancedProduct[]).filter((p) => {
                if (!p.brand) return false;
                // لو البراند كائن بناخد الـ id منه، لو نص بنقارنه مباشرة
                const productBrandId = typeof p.brand === 'object' ? p.brand._id : p.brand;
                return productBrandId === id;
            });
            
            setProducts(brandProducts as Product[]);
        } catch (error) {
            console.error("Error loading brand data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadBrandData();
    }, [loadBrandData]);

    if (isLoading) return <BrandOrCategorySkeleton />;

    return (
        <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950">
            <div className="px-6 py-12 mb-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 md:px-20">
                <div className="flex flex-col items-center gap-8 mx-auto md:flex-row max-w-7xl">
                    <div className="relative w-48 h-32 p-4 border shadow-inner bg-slate-50 dark:bg-slate-800 rounded-2xl border-slate-100 dark:border-slate-700">
                        {brand && (
                            <Image src={brand.image} alt={brand.name} fill className="object-contain p-2" priority />
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center gap-2 mb-2 font-bold md:justify-start text-emerald-600 dark:text-emerald-400">
                            <Award size={20} />
                            <span className="text-sm tracking-widest uppercase">Official Brand</span>
                        </div>
                        <h1 className="mb-2 text-4xl font-black text-slate-900 dark:text-slate-50">{brand?.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400">Discover the latest collection and exclusive deals from {brand?.name}.</p>
                    </div>
                </div>
            </div>

            <div className="px-6 mx-auto md:px-20 max-w-7xl">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Available Products</h2>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-32 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-xl font-medium text-slate-400 dark:text-slate-500">No products found for this brand yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}