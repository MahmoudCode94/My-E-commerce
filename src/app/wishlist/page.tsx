'use client';

import { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist } from '@/api/wishlist.api';
import { addProductToCart } from '@/api/cart.api';
import { Loader2, HeartOff, ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function WishlistPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function loadWishlist() {
    const data = await getWishlist();
    if (data.status === 'success') {
      setProducts(data.data);
    }
    setIsLoading(false);
  }

  async function handleRemove(id: string) {
    setActionLoading(id);
    const data = await removeFromWishlist(id);
    if (data.status === 'success') {
      setProducts((prev) => prev.filter((item) => item._id !== id));
      toast.success("Removed from wishlist");
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
    setActionLoading(null);
  }

  async function handleAddToCart(id: string) {
    setActionLoading(id);
    const data = await addProductToCart(id);
    if (data.status === "success") {
      toast.success("Added to cart 🛒");
      window.dispatchEvent(new Event("cartUpdated"));
    }
    setActionLoading(null);
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
        <h1 className="flex items-center gap-3 text-4xl font-black text-slate-900">
          My Wishlist <span className="text-3xl text-red-500">❤️</span>
        </h1>
        <p className="mt-2 text-slate-500">You have {products.length} items saved for later</p>
      </header>

      {products.length === 0 ? (
        <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <HeartOff size={64} className="mx-auto mb-4 text-slate-300" />
          <h2 className="text-xl font-bold text-slate-800">Your wishlist is empty</h2>
          <p className="mt-2 mb-8 text-slate-500">Save items you like to see them here.</p>
          <Link href="/" className="px-8 py-3 font-bold text-white transition-all rounded-full bg-emerald-600 hover:bg-emerald-700">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((item) => (
            <div key={item._id} className="relative flex flex-col overflow-hidden transition-all duration-300 bg-white border group border-slate-100 rounded-3xl hover:shadow-2xl hover:shadow-emerald-100">
              <div className="relative p-6 overflow-hidden aspect-square bg-slate-50">
                <img 
                  src={item.imageCover} 
                  alt={item.title} 
                  className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110" 
                />
              </div>

              <div className="flex flex-col flex-grow p-5">
                <div className="mb-4">
                  <h3 className="mb-1 font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                  <p className="text-lg font-black text-emerald-600">{item.price} EGP</p>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button 
                    disabled={actionLoading === item._id}
                    onClick={() => handleAddToCart(item._id)}
                    className="flex-[3] flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl font-bold text-xs hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === item._id ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
                    Add to Cart
                  </button>
                  
                  <button 
                    disabled={actionLoading === item._id}
                    onClick={() => handleRemove(item._id)}
                    className="flex items-center justify-center flex-1 py-3 text-red-500 transition-all bg-red-50 rounded-2xl hover:bg-red-500 hover:text-white disabled:opacity-50"
                  >
                    <Trash2 size={18} />
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