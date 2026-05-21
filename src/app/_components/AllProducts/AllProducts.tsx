'use client';

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, Product } from "@/api/products.api";
import ProductCard from "../ProductCard/ProductCard";

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (err) {
      const errorVal = err as Error;
      console.error("Fetch Error:", err);
      setError(errorVal.message || "Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 px-6 py-10 md:py-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:px-20">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border h-[400px] rounded-[2rem] border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 animate-pulse">
            <div className="m-4 rounded-[1.5rem] h-52 bg-slate-200/50 dark:bg-slate-800/50" />
            <div className="w-3/4 h-6 mx-4 mb-3 rounded-md bg-slate-200/50 dark:bg-slate-800/50" />
            <div className="h-10 m-4 rounded-xl bg-slate-200/50 dark:bg-slate-800/50" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center max-w-md p-10 text-center bg-white dark:bg-slate-950 shadow-xl rounded-[2.5rem] border border-slate-100 dark:border-slate-800"
        >
          <div className="p-5 mb-4 text-red-500 rounded-full bg-red-50 dark:bg-red-950/20">
            <AlertCircle size={40} />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">Connection Issue</h3>
          <p className="mb-8 leading-relaxed text-slate-500 dark:text-slate-400">{error}</p>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-8 py-4 font-bold text-white transition-all shadow-lg rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 shadow-slate-200"
          >
            <RefreshCw size={18} />
            Try again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 md:px-20 md:py-4">
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-xl group">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-6 py-4 text-sm transition-all border-2 shadow-sm outline-none pl-14 border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          <Search className="absolute transition-colors -translate-y-1/2 left-5 top-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500" size={22} />
          
          <AnimatePresence>
            {isFocused && searchTerm.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute left-0 right-0 top-full mt-2 z-50 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden space-y-1 max-h-[350px] overflow-y-auto"
              >
                <div className="px-3 py-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-2 text-left">
                  Suggestions ({filteredProducts.length})
                </div>
                {filteredProducts.slice(0, 5).map((prod) => (
                  <Link
                    key={prod._id || prod.id}
                    href={`/products/${prod._id || prod.id}`}
                    className="flex items-center gap-4 p-2 transition-colors rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 group"
                  >
                    <div className="relative w-12 h-12 border rounded-lg bg-white dark:bg-slate-800 p-1 shrink-0 border-slate-100 dark:border-slate-700">
                      <Image
                        src={prod.imageCover}
                        alt={prod.title}
                        fill
                        className="object-contain p-0.5"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-sm font-bold truncate text-slate-850 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {prod.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{prod.category?.name}</p>
                    </div>
                    <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 shrink-0 pr-2">
                      {prod.price} EGP
                    </div>
                  </Link>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="py-6 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
                    No matching products found
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id || product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.02 }}
              >
                <ProductCard product={product} priority={index < 4} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-32 text-center">
          <div className="inline-flex p-6 mb-4 rounded-full bg-slate-50 dark:bg-slate-900">
            <Search size={40} className="text-slate-300 dark:text-slate-700" />
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100">No products found</p>
          <p className="mt-2 text-slate-400 dark:text-slate-500">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}