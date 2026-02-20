'use client';

import React, { useEffect, useState, useCallback } from "react";
import { getAllAddresses, deleteAddress } from "@/api/address.api";
import AddressModal from "../../_components/AddressModal";
import toast from "react-hot-toast";
import { MapPin, Trash2, Loader2, Plus } from "lucide-react";
import { getCookie } from "cookies-next";

interface Address {
  _id: string;
  name: string;
  city: string;
  phone: string;
  details: string;
}

interface APIResponse {
  status: string;
  data: Address[];
  message?: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const token = getCookie("userToken");

  const loadAddresses = useCallback(async () => {
    if (!token) {
      setLoading(false);
      toast.error("Please login to see your addresses");
      return;
    }

    try {
      setLoading(true);
      const res: APIResponse = await getAllAddresses();
      if (res.status === "success") {
        setAddresses(res.data);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch addresses";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  async function handleDelete(id: string) {
    const toastId = toast.loading("Removing address...");
    try {
      const res: APIResponse = await deleteAddress(id);
      if (res.status === "success") {
        setAddresses(res.data);
        toast.success("Address removed", { id: toastId });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete address";
      toast.error(message, { id: toastId });
    }
  }

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100">Delivery Addresses</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Manage your shipping locations</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 font-bold text-white transition-all shadow-lg bg-emerald-600 hover:bg-emerald-700 rounded-2xl active:scale-95"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      <div className="grid gap-6">
        {addresses.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <MapPin size={50} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="font-bold text-slate-500 dark:text-slate-400">No addresses found yet.</p>
          </div>
        ) : (
          addresses.map((addr: Address) => (
            <div key={addr._id} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex justify-between items-center shadow-sm hover:shadow-md transition-all">
              <div className="flex gap-5">
                <div className="flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl text-emerald-600 dark:text-emerald-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{addr.name}</h3>
                  <p className="font-medium text-slate-500 dark:text-slate-400">{addr.city}, {addr.details}</p>
                  <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{addr.phone}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(addr._id)}
                className="p-3 transition-all text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-2xl"
              >
                <Trash2 size={22} />
              </button>
            </div>
          ))
        )}
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(updatedList: Address[]) => setAddresses(updatedList)}
      />
    </div>
  );
}