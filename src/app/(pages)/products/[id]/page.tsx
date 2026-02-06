'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import AddWishlistButton from "@/app/_components/AddWishlistButton";
import AddToCartButton from "@/app/_components/AddToCartButton";
import { getProducts, Product } from '@/api/products.api';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadProductData = useCallback(async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            const allProducts = await getProducts();
            const foundProduct = allProducts.find((p: Product) => p.id === id || p._id === id);
            setProduct(foundProduct || null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadProductData();
    }, [loadProductData]);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        </div>
    );

    if (!product) return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-xl font-medium text-slate-400">Product not found.</p>
        </div>
    );

    const productId = product._id || product.id || "";

    return (
        <div className="flex items-center justify-center px-6 py-10 lg:px-20">
            <Card className="w-full max-w-6xl bg-transparent border-none shadow-none">
                <CardContent className="p-0">
                    <div className="grid items-center grid-cols-1 gap-12 md:grid-cols-2">
                        <div className="flex items-center justify-center">
                            <div className="relative flex items-center justify-center w-full max-w-[400px] rounded-[2rem] overflow-hidden bg-white shadow-sm border border-slate-50 aspect-square">
                                <Image
                                    src={product.imageCover}
                                    alt={product.title}
                                    width={350}
                                    height={350}
                                    className="object-contain p-4 transition-transform duration-500 hover:scale-105"
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-8 text-center md:items-start md:text-left">
                            <div className="w-full space-y-4">
                                <h1 className="text-3xl font-black leading-tight md:text-5xl text-slate-900">
                                    {product.title}
                                </h1>

                                <div className="flex items-center justify-center gap-3 md:justify-start">
                                    <div className="flex items-center gap-1 px-3 py-1 border border-yellow-100 rounded-full bg-yellow-50">
                                        <span className="text-sm text-yellow-500">★</span>
                                        <span className="text-sm font-bold text-slate-700">
                                            {product.ratingsAverage}
                                        </span>
                                    </div>
                                    <span className="text-slate-400">|</span>
                                    <span className="text-sm font-bold tracking-wider uppercase text-emerald-600">
                                        {product.category?.name || "Premium Product"}
                                    </span>
                                </div>

                                <p className="max-w-xl text-lg leading-relaxed text-slate-500">
                                    {product.description}
                                </p>
                            </div>

                            <div className="flex flex-col items-center w-full gap-6 md:items-start">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-emerald-600">
                                        {product.price}
                                    </span>
                                    <span className="text-xl font-bold uppercase text-slate-400">
                                        Egp
                                    </span>
                                </div>

                                <div className="flex w-full max-w-md gap-4">
                                    <AddToCartButton productId={productId} />
                                    <AddWishlistButton productId={productId} />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}