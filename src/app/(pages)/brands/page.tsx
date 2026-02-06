import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBrands } from '@/api/brands.api';
import { LayoutGrid } from 'lucide-react';

export default async function BrandsPage() {
    const brands = await getBrands();

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-6 md:px-20">
            {/* Header */}
            <div className="flex flex-col items-center mb-16">
                <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold mb-4">
                    <LayoutGrid size={16} />
                    <span>OUR PARTNERS</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 text-center">
                    Shop by <span className="text-emerald-600">Brand</span>
                </h1>
                <p className="text-slate-500 mt-4 text-center max-w-xl">
                    Experience excellence with our curated selection of world-class brands. 
                    Quality guaranteed in every purchase.
                </p>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {brands.map((brand) => (
                    <Link 
                        href={`/brands/${brand._id}`} 
                        key={brand._id}
                        className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center justify-center gap-4"
                    >
                        <div className="relative h-24 w-full grayscale group-hover:grayscale-0 transition-all duration-500">
                            <Image
                                src={brand.image}
                                alt={brand.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h3 className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                            {brand.name}
                        </h3>
                    </Link>
                ))}
            </div>

            {brands.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400">No brands found at the moment.</p>
                </div>
            )}
        </div>
    );
}