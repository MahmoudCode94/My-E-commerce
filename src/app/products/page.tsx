"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { getProducts, Product } from '@/api/products.api';
import ProductCard from '../_components/ProductCard/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getProducts();
      setProducts(data);
      setIsLoading(false);
    }

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

  return (
    <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10 px-10 md:px-20 mt-10">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product._id || product.id || index}
            initial={{ opacity: .8, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            
            <ProductCard product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}