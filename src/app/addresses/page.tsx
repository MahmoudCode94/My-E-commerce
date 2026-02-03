"use client";

import React, { useEffect, useState } from "react";
import { getAllAddresses, deleteAddress } from "@/api/address.api";
import AddressModal from "../_components/AddressModal";
import toast from "react-hot-toast";
import { MapPin, Trash2, Loader2, Plus } from "lucide-react";

interface Address {
  _id: string;
  name: string;
  city: string;
  phone: string;
  details: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadAddresses() {
    try {
      const data = await getAllAddresses();
      if (data.status === "success") {
        setAddresses(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const data = await deleteAddress(id);
      if (data.status === "success") {
        setAddresses(data.data);
        toast.success("Address removed");
      }
    } catch (error) {
      toast.error("Failed to delete address");
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Delivery Addresses</h1>
          <p className="mt-1 text-slate-500">Manage your shipping locations</p>
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
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <MapPin size={50} className="mx-auto mb-4 text-slate-300" />
             <p className="font-bold text-slate-500">No addresses found yet.</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr._id} className="p-6 bg-white border border-slate-100 rounded-[2.5rem] flex justify-between items-center shadow-sm hover:shadow-md transition-all">
              <div className="flex gap-5">
                <div className="flex items-center justify-center p-4 bg-slate-50 rounded-3xl text-emerald-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{addr.name}</h3>
                  <p className="font-medium text-slate-500">{addr.city}, {addr.details}</p>
                  <p className="mt-1 text-sm text-slate-400">{addr.phone}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(addr._id)}
                className="p-3 transition-all text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl"
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
        onSuccess={(updatedList) => setAddresses(updatedList)} 
      />
    </div>
  );
}