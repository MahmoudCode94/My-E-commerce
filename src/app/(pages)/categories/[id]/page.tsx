'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Loader2, ShoppingBag, Filter } from 'lucide-react';

import { getSpecificCategory, Category } from '@/api/category.api';
import { getProductsByCategory, Product, SubCategory } from '@/api/products.api';

import ProductCard from '@/app/_components/ProductCard/ProductCard';

export default function CategoryDetailsPage() {
    const { id } = useParams();
    
    const [pageData, setPageData] = useState<{
        category: Category | null;
        allProducts: Product[];
        filteredProducts: Product[];
        subCategories: SubCategory[];
    }>({
        category: null,
        allProducts: [],
        filteredProducts: [],
        subCategories: []
    });

    const [activeSubId, setActiveSubId] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!id) return;
        
        try {
            setIsLoading(true);
            
            // جلب البيانات بشكل متوازي لتقليل وقت التحميل
            const [catData, prodData, subRes] = await Promise.all([
                getSpecificCategory(id as string),
                getProductsByCategory(id as string),
                fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories`).then(r => r.json())
            ]);

            setPageData({
                category: catData,
                allProducts: prodData || [],
                filteredProducts: prodData || [],
                subCategories: subRes.data || []
            });
        } catch (error) {
            console.error("Error loading category page:", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleFilter = (subId: string) => {
        setActiveSubId(subId);
        
        if (subId === 'all') {
            setPageData(prev => ({ ...prev, filteredProducts: prev.allProducts }));
        } else {
            const filtered = pageData.allProducts.filter(p => 
                p.subcategory?.some((sub) => sub._id === subId)
            );
            setPageData(prev => ({ ...prev, filteredProducts: filtered }));
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
        </div>
    );

    const { category, filteredProducts, subCategories } = pageData;

    return (
        <div className="min-h-screen pb-20 bg-slate-50">
            <div className="relative w-full h-75 md:h-100">
                {category?.image && (
                    <Image 
                        src={category.image} 
                        alt={category.name} 
                        fill 
                        className="object-cover" 
                        priority 
                    />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/50">
                    <h1 className="px-4 mb-4 text-4xl font-black tracking-tighter text-center uppercase md:text-5xl">
                        {category?.name || "Category"}
                    </h1>
                    <div className="flex items-center gap-2 px-4 py-2 font-bold rounded-full shadow-lg bg-emerald-600">
                        <ShoppingBag size={18} /> 
                        <span>{filteredProducts.length} Products</span>
                    </div>
                </div>
            </div>

            <div className="px-6 -translate-y-12 md:px-20">
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-100 mb-12">
                    <div className="flex items-center gap-2 mb-6 font-bold text-slate-800">
                        <Filter size={20} className="text-emerald-500" />
                        <span>Filter by Subcategory</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                        <button 
                            onClick={() => handleFilter('all')}
                            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                                activeSubId === 'all' 
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            All Products
                        </button>
                        
                        {subCategories.map((sub) => (
                            <button 
                                key={sub._id}
                                onClick={() => handleFilter(sub._id)}
                                className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                                    activeSubId === sub._id 
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </div>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-20 md:p-32 text-center border-2 border-dashed border-slate-200">
                        <p className="text-xl font-medium text-slate-400">No products found for this subcategory.</p>
                    </div>
                )}
            </div>
        </div>
    );
}