'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { getProducts, Product } from "@/api/products.api";
import ProductCard from "../ProductCard/ProductCard";

export default function AllProducts() {
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
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  /* ================= Loading ================= */
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 md:px-20 py-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-120 rounded-xl border border-slate-100 bg-slate-50 animate-pulse"
          >
            <div className="h-52 bg-slate-200/50 m-4 rounded-lg" />
            <div className="h-6 bg-slate-200/50 mx-4 w-3/4 mb-3" />
            <div className="h-10 bg-slate-200/50 m-4 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  /* ================= Error ================= */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="p-5 bg-red-50 text-red-500 rounded-full">
            <AlertCircle size={40} />
          </div>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg"
          >
            <RefreshCw size={18} />
            Try again
          </button>
        </motion.div>
      </div>
    );
  }

  /* ================= Products Grid ================= */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 md:px-20 py-10">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product._id || product.id || index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
