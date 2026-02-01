"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { getProducts, Product } from '@/api/products.api';
import ProductCard from '../_components/ProductCard/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("حدث خطأ غير متوقع");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10 px-10 md:px-20 mt-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[480px] bg-slate-50 animate-pulse rounded-xl border border-slate-100">
            <div className="h-52 bg-slate-200/50 m-4 rounded-lg"></div>
            <div className="h-6 bg-slate-200/50 mx-4 w-3/4 mb-3"></div>
            <div className="h-10 bg-slate-200/50 mt-auto m-4 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] w-full px-6 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center w-full max-w-sm gap-6"
        >
          <div className="p-5 bg-red-50 text-red-500 rounded-full">
            <AlertCircle size={40} strokeWidth={2} />
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-2xl font-bold text-slate-800">
              Oops! Something went wrong
            </h2>
            <p className="text-slate-500 text-base">
              {error?.includes("fetch")
                ? "Please check your internet connection and try again."
                : "We couldn't load the products at the moment."}
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center justify-center gap-3 w-fit p-3 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10 px-10 md:px-20 mt-10">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product._id || product.id || index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: index * 0.06,
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}