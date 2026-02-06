"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories, Category } from '@/api/category.api';

import 'swiper/css';
import 'swiper/css/pagination';

export default function CategorySlider() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error loading categories:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadCategories();
    }, []);

    if (isLoading) return <div className="p-20 text-center text-gray-400 animate-pulse">Loading Categories...</div>;

    const shouldLoop = categories.length >= 6;

    return (
        <div className="px-6 py-10 md:px-20">
            <div className="flex items-center justify-between mb-6">
                <h2 className='text-2xl font-bold md:text-3xl text-slate-800'>
                    Shop Popular Categories
                </h2>
                <div className="flex-1 hidden h-1 mx-4 rounded-full bg-slate-100 sm:block"></div>
                <Link href="/categories" className="text-sm font-semibold text-emerald-600 hover:underline">
                    View All
                </Link>
            </div>

            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={20}
                slidesPerView={2}
                loop={shouldLoop}
                autoplay={shouldLoop ? { delay: 3500, disableOnInteraction: false } : false}
                pagination={{ clickable: true, dynamicBullets: true }}
                breakpoints={{
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 6 },
                }}
                className="pb-12 !px-2"
            >
                {categories.map((cat) => (
                    <SwiperSlide key={cat._id}>
                        <Link href={`/categories/${cat._id}`} className="relative flex flex-col gap-3 cursor-pointer group">
                            <div className="relative w-full h-64 overflow-hidden transition-all duration-500 border shadow-sm rounded-2xl border-slate-100 group-hover:shadow-xl group-hover:-translate-y-2">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                                />
                                <div className="absolute inset-0 flex items-end justify-center p-4 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:opacity-100">
                                    <span className="px-3 py-1 text-sm font-medium text-white transition-transform transform translate-y-4 rounded-full bg-emerald-600 group-hover:translate-y-0">
                                        View Products
                                    </span>
                                </div>
                            </div>
                            <h3 className="font-semibold text-center transition-colors duration-300 text-slate-700 group-hover:text-emerald-600">
                                {cat.name}
                            </h3>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}