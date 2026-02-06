"use client";

import React, { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { Loader2, Package, Calendar, CheckCircle2, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

interface OrderProduct {
  count: number;
  price: number;
  product: {
    title: string;
    imageCover: string;
    category: { name: string };
  };
}

interface Order {
  _id: string;
  createdAt: string;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  cartItems: OrderProduct[];
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getUserOrders = useCallback(async () => {
    try {
      const token = getCookie("userToken") as string;

      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = jwtDecode<DecodedToken>(token);
      const userId = decoded.id;

      const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your order history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="p-6 rounded-full bg-slate-50">
        <Package size={80} className="text-slate-200" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800">No orders found yet</h2>
      <p className="text-slate-500">Looks like you haven&apos;t made any orders yet.</p>
    </div>
  );

  return (
    <div className="max-w-5xl px-4 py-12 mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900">Order History</h1>
        <p className="mt-2 text-slate-500">Manage and track your recent orders</p>
      </div>

      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b bg-slate-50/50 border-slate-100">
              <div className="flex flex-wrap gap-4 md:gap-8">
                <div>
                  <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Order ID</p>
                  <p className="text-sm font-bold text-slate-700">#{order._id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Date</p>
                  <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                    <Calendar size={14} className="text-slate-400" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Total Amount</p>
                  <p className="text-sm font-black text-emerald-600">{order.totalOrderPrice} EGP</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                  {order.isPaid ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                  {order.isPaid ? "Paid" : "Pending Payment"}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${order.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                  <Package size={13} />
                  {order.isDelivered ? "Delivered" : "Processing"}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {order.cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden transition-transform bg-white border shadow-sm rounded-xl border-slate-100 group-hover:scale-105">
                      <Image
                        src={item.product.imageCover}
                        alt={item.product.title}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 text-sm font-bold leading-tight truncate text-slate-800" title={item.product.title}>
                        {item.product.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Qty: {item.count}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {item.price} EGP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}