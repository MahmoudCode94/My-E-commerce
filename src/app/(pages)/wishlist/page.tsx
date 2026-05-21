'use client';

import { useEffect, useState } from 'react';
import { WishlistItem } from '@/api/wishlist.api';
import { Loader2, HeartOff, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { getWishlist } from '@/api/wishlist.api';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { removeFromWishlistFn } = useWishlist();
  const { addToCartFn } = useCart();

  const [products, setProducts] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function loadWishlist() {
    try {
      const data = await getWishlist();
      if (data.status === 'success') {
        setProducts(data.data);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load wishlist';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemove(id: string) {
    setActionLoading(id);
    try {
      await removeFromWishlistFn(id);
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAddToCart(id: string) {
    setActionLoading(id);
    try {
      await addToCartFn(id);
    } finally {
      setActionLoading(null);
    }
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin text-emerald-600" size={45} />
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto max-w-7xl md:py-12">
      <header className="mb-10">
        <h1 className="flex items-center gap-3 text-4xl font-black text-slate-900 dark:text-slate-50">
          My Wishlist <span className="text-3xl text-red-500">❤️</span>
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          You have {products.length} items saved for later
        </p>
      </header>

      {products.length === 0 ? (
        <div className="py-24 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <HeartOff size={64} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your wishlist is empty</h2>
          <p className="mt-2 mb-8 text-slate-500 dark:text-slate-400">Save items you like to see them here.</p>
          <Link href="/" className="px-8 py-3 font-bold text-white transition-all rounded-full bg-emerald-600 hover:bg-emerald-700">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((item) => (
            <div
              key={item._id}
              className="relative flex flex-row md:flex-col gap-0 md:pb-1 overflow-hidden transition-all duration-300 bg-white dark:bg-slate-900 border border-transparent shadow-sm group hover:shadow-xl hover:border-slate-200 dark:hover:border-slate-800 rounded-3xl"
            >
              {/* Image */}
              <Link
                href={`/products/${item._id}`}
                className="relative w-1/3 shrink-0 md:w-full h-36 md:h-52 bg-transparent rounded-2xl m-3 md:m-0 p-2 overflow-hidden block"
              >
                <Image
                  src={item.imageCover}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-110 rounded-2xl"
                />
              </Link>

              {/* Content */}
              <div className="flex flex-col flex-1 px-4 py-4 md:p-0 md:justify-between min-w-0">
                {/* Text */}
                <div className="space-y-1 md:px-4 md:pt-2">
                  <Link href={`/products/${item._id}`}>
                    <h3 className="text-sm font-bold leading-tight line-clamp-2 md:line-clamp-1 text-slate-800 dark:text-slate-100">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-500">
                      {item.price} <span className="text-[10px]">EGP</span>
                    </p>
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full border border-yellow-100 dark:border-yellow-900/30">
                      <span className="text-xs text-yellow-500">★</span>
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {item.ratingsAverage}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-3 pb-1 md:px-3 md:pb-3">
                  <button
                    disabled={actionLoading === item._id}
                    onClick={() => handleAddToCart(item._id)}
                    className="flex items-center justify-center gap-1.5 flex-1 bg-slate-950 dark:bg-emerald-600 text-white py-2.5 rounded-xl transition-all duration-300 hover:bg-emerald-600 dark:hover:bg-emerald-700 active:scale-95 shadow-sm font-bold text-xs uppercase disabled:opacity-70"
                  >
                    {actionLoading === item._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart size={14} />
                        Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    disabled={actionLoading === item._id}
                    onClick={() => handleRemove(item._id)}
                    className="flex items-center justify-center p-2.5 shrink-0 text-red-500 transition-all bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-500 hover:text-white disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}