"use client";

import React from 'react';
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from '@/api/products.api';
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="relative flex flex-col justify-between group overflow-hidden transition-all duration-300 hover:shadow-2xl border-transparent hover:border-slate-200 min-h-[480px] bg-white">
      <Link href={`/products/${product.id}`}>
        <CardHeader className="p-3 space-y-2">
          <div className="relative w-full h-52 overflow-hidden rounded-md bg-transparent">
            <Image
              src={product.imageCover}
              alt={product.title}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
          <div>
            <CardTitle className="line-clamp-1 text-base font-bold text-slate-800">{product.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1 text-sm leading-tight text-slate-500">
              {product.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-4 py-1 flex justify-between items-center">
          <p className="font-bold text-lg text-emerald-700">{product.price} <span className="text-[10px]">EGP</span></p>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
            <span className="text-yellow-500 text-xs">★</span>
            <span className="text-[11px] font-bold text-slate-600">{product.ratingsAverage}</span>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-1">
        </CardFooter>
      </Link>
      <div className='flex gap-2 px-3'>
        <button className="cursor-pointer w-full bg-slate-950 text-white py-2.5 rounded-lg transition-all duration-300 hover:bg-emerald-600 active:scale-95 shadow-sm font-semibold text-xs uppercase">
          Add to Cart
        </button>
        <button className=" z-10 p-2 bg-white/70 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all group/heart scale-90 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-slate-600 group-hover/heart:text-red-500 group-hover/heart:fill-red-500 transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>
    </Card>
  );
}