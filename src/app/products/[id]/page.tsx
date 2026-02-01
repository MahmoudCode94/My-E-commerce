import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React from "react";


interface PageProps {
    params: Promise<{ id: string }>;
}

interface ProductData {
    data: {
        id: string;
        title: string;
        description: string;
        imageCover: string;
        price: number;
        ratingsAverage: number;
        category?: {
            name: string;
        };
    };
}

export default async function ProductDetails({ params }: PageProps) {
    const { id } = await params;

    const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/products/${id}`,
        { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error("فشل في تحميل بيانات المنتج");

    const { data }: ProductData = await res.json();
    return (
        <div className="flex items-center justify-center px-20 px-6 py-10">
            <Card className="w-full max-w-6xl border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center w-full max-w-[400px] 50 rounded-[2rem] overflow-hidden">
                                <Image
                                    src={data.imageCover}
                                    alt={data.title}
                                    width={350}
                                    height={350}
                                    className="object-contain p-4"
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-8 items-center md:items-start text-center md:text-left">
                            <div className="space-y-4 w-full">
                                <h1 className=" md:text-4xl font-black text-slate-900 leading-tight">
                                    {data.title}
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                        <span className="text-yellow-500 text-sm">★</span>
                                        <span className="text-sm font-bold text-slate-700">
                                            {data.ratingsAverage}
                                        </span>
                                    </div>
                                    <span className="text-slate-400">|</span>
                                    <span className="text-slate-500 text-sm font-medium italic">
                                        {data.category?.name || "Premium Product"}
                                    </span>
                                </div>
                                <p className="text-slate-500 leading-relaxed max-w-xl">
                                    {data.description}
                                </p>
                            </div>

                            <div className="flex flex-col gap-6 w-full items-center md:items-start">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-emerald-600">
                                        {data.price}
                                    </span>
                                    <span className="text-xl font-bold text-slate-400 uppercase">
                                        Egp
                                    </span>
                                </div>
                                <div className="flex gap-3 w-full">
                                    <button className="w-full max-w-sm md:w-fit bg-slate-950 text-white px-11 py-4 rounded-xl  font-bold tracking-tight transition-all duration-300 hover:bg-slate-800 active:scale-95 shadow-2xl shadow-slate-200">
                                        Add to Shopping Bag
                                    </button>
                                    <button className=" z-10 p-3 bg-white/70 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all group/heart scale-90 hover:scale-105 active:scale-95">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-slate-600 group-hover/heart:text-red-500 group-hover/heart:fill-red-500 transition-colors">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}