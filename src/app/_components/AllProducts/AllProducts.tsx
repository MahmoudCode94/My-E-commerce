'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw, Search } from "lucide-react";
import { getProducts, Product } from "@/api/products.api";
import ProductCard from "../ProductCard/ProductCard";

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredProducts = products.filter((product) =>
    product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 px-6 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:px-20">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border h-[400px] rounded-[2rem] border-slate-100 bg-slate-50 animate-pulse">
            <div className="m-4 rounded-[1.5rem] h-52 bg-slate-200/50" />
            <div className="w-3/4 h-6 mx-4 mb-3 rounded-md bg-slate-200/50" />
            <div className="h-10 m-4 rounded-xl bg-slate-200/50" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="p-5 text-red-500 rounded-full bg-red-50">
            <AlertCircle size={40} />
          </div>
          <p className="font-medium text-slate-600">{error}</p>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-6 py-3 text-white transition-all shadow-lg rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 shadow-slate-200"
          >
            <RefreshCw size={18} />
            Try again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 md:px-20">
      {/* Search Bar */}
      <div className="flex justify-center mb-12">
        <div className="relative w-full max-w-xl group">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-6 py-4 text-sm transition-all border-2 shadow-sm outline-none pl-14 border-slate-100 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute transition-colors -translate-y-1/2 left-5 top-1/2 text-slate-400 group-focus-within:text-emerald-500" size={22} />
        </div>
      </div>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id || product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-32 text-center">
          <div className="inline-flex p-6 mb-4 rounded-full bg-slate-50">
            <Search size={40} className="text-slate-300" />
          </div>
          <p className="text-xl font-bold text-slate-800">No products found</p>
          <p className="mt-2 text-slate-400">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}