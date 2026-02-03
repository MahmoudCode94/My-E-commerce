'use client';

import { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist } from '@/api/wishlist.api';
import { Loader2, HeartOff, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export default function WishlistPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadWishlist() {
    setIsLoading(true);
    const data = await getWishlist();
    if (data.status === 'success') {
      setProducts(data.data);
    }
    setIsLoading(false);
  }

  useEffect(() => { loadWishlist(); }, []);

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>;

  return (
    <div className="container p-6 mx-auto md:p-20">
      <h1 className="flex items-center gap-2 mb-8 text-2xl font-black">
        My Wishlist <span className="text-red-500">❤️</span>
      </h1>

      {products.length === 0 ? (
        <div className="py-20 text-center bg-slate-50 rounded-3xl">
          <HeartOff size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <div key={item._id} className="flex gap-4 p-4 transition-shadow bg-white border shadow-sm border-slate-100 rounded-2xl hover:shadow-md">
              <div className="relative flex-shrink-0 w-24 h-24">
                <img src={item.imageCover} alt={item.title} className="object-cover w-full h-full rounded-xl" />
              </div>
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                  <p className="text-sm font-black text-emerald-600">{item.price} EGP</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-grow py-2 bg-emerald-600 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1">
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                  <button 
                    onClick={async () => {
                        await removeFromWishlist(item._id);
                        loadWishlist(); // تحديث القائمة بعد الحذف
                    }}
                    className="p-2 text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <HeartOff size={18} />
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