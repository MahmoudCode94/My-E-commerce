'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSpecificCategory, Category } from '@/api/category.api';
import { getProductsByCategory, Product, SubCategory } from '@/api/products.api';
import ProductCard from '@/app/_components/ProductCard/ProductCard';
import Image from 'next/image';
import { Loader2, ShoppingBag, Filter } from 'lucide-react';

export default function CategoryDetailsPage() {
    const { id } = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [activeSubId, setActiveSubId] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            async function loadData() {
                try {
                    setIsLoading(true);
                    const [catData, prodData, subRes] = await Promise.all([
                        getSpecificCategory(id as string),
                        getProductsByCategory(id as string),
                        fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories`).then(r => r.json())
                    ]);

                    setCategory(catData);
                    setAllProducts(prodData);
                    setFilteredProducts(prodData);
                    setSubCategories(subRes.data || []);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            }
            loadData();
        }
    }, [id]);

    const handleFilter = (subId: string) => {
        setActiveSubId(subId);
        if (subId === 'all') {
            setFilteredProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p => 
                p.subcategory?.some((sub) => sub._id === subId)
            );
            setFilteredProducts(filtered);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-emerald-600 w-12 h-12" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="relative h-[300px] md:h-[400px] w-full">
                {category && <Image src={category.image} alt={category.name} fill className="object-cover" priority />}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-center px-4">
                        {category?.name}
                    </h1>
                    <div className="flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-full font-bold shadow-lg">
                        <ShoppingBag size={18} /> 
                        <span>{filteredProducts.length} Products</span>
                    </div>
                </div>
            </div>

            <div className="px-6 md:px-20 -translate-y-12">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-20 md:p-32 text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 text-xl font-medium">No products found for this selection.</p>
                    </div>
                )}
            </div>
        </div>
    );
}