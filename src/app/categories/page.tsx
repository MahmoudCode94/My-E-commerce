'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCategories, Category } from '@/api/category.api'; // تأكد من اسم الملف api
import { LayoutGrid, Loader2, ArrowRight } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading all categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-50 p-4 rounded-full text-red-500 mb-4">
          <LayoutGrid size={40} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Something went wrong</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 py-12 px-6 md:px-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
            <span className="bg-emerald-100 p-2 rounded-2xl">
              <LayoutGrid className="text-emerald-600 w-8 h-8" />
            </span>
            Our Categories
          </h1>
          <p className="text-slate-500 text-lg max-w-md">
            Find everything you need by exploring our curated collections.
          </p>
        </div>
        <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm flex items-center gap-3">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500"></span>
          <span className="font-bold text-slate-700">{categories.length} Total Categories</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Link
              href={`/categories/${category._id}`}
              className="group relative block bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:-translate-y-3"
            >
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {category.name}
                      </h3>
                      <p className="text-emerald-400 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        Browse Gallery <ArrowRight size={14} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}