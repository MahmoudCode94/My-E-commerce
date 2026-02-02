'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSpecificBrand, Brand } from '@/api/brands.api';
import ProductCard from '@/app/_components/ProductCard/ProductCard';
import { Product } from '@/api/products.api';
import Image from 'next/image';
import { Loader2, Award } from 'lucide-react';

export default function BrandDetailsPage() {
    const { id } = useParams();
    const [brand, setBrand] = useState<Brand | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            async function loadBrandData() {
                try {
                    setIsLoading(true);
                    const [brandData, prodRes] = await Promise.all([
                        getSpecificBrand(id as string),
                        fetch(`https://ecommerce.routemisr.com/api/v1/products?brand=${id}`).then(r => r.json())
                    ]);

                    setBrand(brandData);
                    setProducts(prodRes.data || []);
                } catch (error) {
                    console.error("Error:", error);
                } finally {
                    setIsLoading(false);
                }
            }
            loadBrandData();
        }
    }, [id]);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-emerald-600 w-12 h-12" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Brand Header */}
            <div className="bg-white border-b border-slate-200 py-12 px-6 md:px-20 mb-10">
                <div className="flex flex-col md:flex-row items-center gap-8 max-w-7xl mx-auto">
                    <div className="relative h-32 w-48 bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-inner">
                        {brand && (
                            <Image src={brand.image} alt={brand.name} fill className="object-contain p-2" />
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 font-bold mb-2">
                            <Award size={20} />
                            <span className="text-sm tracking-widest uppercase">Official Brand</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">{brand?.name}</h1>
                        <p className="text-slate-500">Discover the latest collection and exclusive deals from {brand?.name}.</p>
                    </div>
                </div>
            </div>
            <div className="px-6 md:px-20 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Available Products</h2>
                    <div className="h-px flex-1 bg-slate-200"></div>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-32 text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 text-xl font-medium">No products found for this brand yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}