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

    return (
        <div className="px-6 md:px-20 py-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className='text-2xl md:text-3xl font-bold text-slate-800'>
                    Shop Popular Categories
                </h2>
                <div className="h-1 flex-1 mx-4 bg-slate-100 hidden sm:block rounded-full"></div>
                <Link href="/categories" className="text-emerald-600 font-semibold hover:underline text-sm">
                    View All
                </Link>
            </div>

            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={20}
                slidesPerView={2}
                loop={true}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
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
                        <Link href={`/categories/${cat._id}`} className="group relative flex flex-col gap-3 cursor-pointer">
                            <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-4">
                                    <span className="text-white text-sm font-medium bg-emerald-600 px-3 py-1 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        View Products
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-center font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors duration-300">
                                {cat.name}
                            </h3>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}