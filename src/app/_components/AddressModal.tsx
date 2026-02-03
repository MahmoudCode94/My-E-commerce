"use client";

import React, { useState } from "react";
import { addAddress } from "@/api/address.api";
import toast from "react-hot-toast";
import { X, Loader2 } from "lucide-react";

interface Address {
  _id: string;
  name: string;
  city: string;
  phone: string;
  details: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedAddresses: Address[]) => void;
}

export default function AddressModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phone: "",
    details: "",
  });

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await addAddress(formData);
      if (data.status === "success") {
        toast.success("Address added successfully");
        onSuccess(data.data);
        setFormData({ name: "", city: "", phone: "", details: "" });
        onClose();
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl">
        <button onClick={onClose} className="absolute text-gray-400 top-6 right-6 hover:text-black">
          <X size={24} />
        </button>
        
        <h2 className="mb-6 text-2xl font-bold text-slate-800">Add New Address</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            value={formData.name}
            placeholder="Address Name (e.g., Home)"
            className="w-full p-4 outline-none bg-slate-50 rounded-2xl focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            required
            value={formData.city}
            placeholder="City"
            className="w-full p-4 outline-none bg-slate-50 rounded-2xl focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          <input
            required
            type="tel"
            value={formData.phone}
            placeholder="Phone Number"
            className="w-full p-4 outline-none bg-slate-50 rounded-2xl focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <textarea
            required
            value={formData.details}
            placeholder="Address Details (Street, Building...)"
            className="w-full p-4 outline-none bg-slate-50 rounded-2xl focus:ring-2 focus:ring-emerald-500"
            rows={3}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          />
          
          <button
            disabled={loading}
            className="flex items-center justify-center w-full py-4 font-bold text-white transition-all bg-emerald-600 rounded-2xl hover:bg-emerald-700 disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
}