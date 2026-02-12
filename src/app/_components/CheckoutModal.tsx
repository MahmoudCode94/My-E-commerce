"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Banknote, MapPin, CheckCircle2, Loader2, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getAllAddresses, addAddress } from "@/api/address.api";
import emailjs from "@emailjs/browser";
import Cookies from "js-cookie";

interface Address {
  _id: string;
  name: string;
  city: string;
  phone: string;
  details: string;
}

interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
  name?: string;
}

interface OrderData {
  _id: string;
  totalOrderPrice: number;
  user: {
    name: string;
    email: string;
  };
  shippingAddress: {
    city: string;
    details: string;
    phone: string;
  };
}

interface Props {
  cartId: string;
  isOpen: boolean;
  onClose: () => void;
}

import { useCart } from "@/context/CartContext";

export default function CheckoutModal({ cartId, isOpen, onClose }: Props) {
  const router = useRouter();
  const { syncCart } = useCart();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingAddresses, setFetchingAddresses] = useState<boolean>(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [useExisting, setUseExisting] = useState<boolean>(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    details: "",
    phone: "",
    city: "",
    name: "",
  });

  useEffect(() => {
    if (isOpen) {
      async function loadData() {
        try {
          const data = await getAllAddresses();
          if (data.status === "success") {
            setAddresses(data.data);
            if (data.data.length > 0) {
              setSelectedAddressId(data.data[0]._id);
              setUseExisting(true);
            } else {
              setUseExisting(false);
            }
          }
        } catch (error) {
          console.error("Failed to fetch addresses:", error);
        } finally {
          setFetchingAddresses(false);
        }
      }
      loadData();
    }
  }, [isOpen]);

  const sendConfirmationEmail = async (userEmail: string, orderDetails: OrderData) => {
    try {
      const serviceId = "service_fapxnmc";
      const templateId = "template_36164mb";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!publicKey) {
        console.error("EmailJS public key is missing");
        return;
      }

      const templateParams = {
        user_email: userEmail,
        customer_name: orderDetails.user.name,
        order_id: orderDetails._id,
        total_price: orderDetails.totalOrderPrice,
        address_details: `${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.details}`,
        phone: orderDetails.shippingAddress.phone,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      // Email sent successfully
    } catch (error) {
      console.error("EmailJS Error:", error);
    }
  };

  async function prepareAddress(): Promise<ShippingAddress | null> {
    if (useExisting) {
      const selected = addresses.find((addr) => addr._id === selectedAddressId);
      if (!selected) return null;
      return {
        details: selected.details,
        phone: selected.phone,
        city: selected.city,
      };
    } else {
      if (!shippingAddress.city || !shippingAddress.phone || !shippingAddress.details || !email) {
        toast.error("Please fill in all details including email");
        return null;
      }
      await addAddress(shippingAddress);
      return {
        details: shippingAddress.details,
        phone: shippingAddress.phone,
        city: shippingAddress.city,
      };
    }
  }

  async function handleOrder(type: "cash" | "online") {
    if (!email) {
      toast.error("Email is required for order confirmation");
      return;
    }

    setLoading(true);
    const addressToUse = await prepareAddress();
    if (!addressToUse) {
      setLoading(false);
      return;
    }

    const token = Cookies.get("userToken");
    const baseUrl = window.location.origin;
    const url = type === "cash"
      ? `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`
      : `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${baseUrl}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify({ shippingAddress: addressToUse }),
      });

      const data = await res.json();

      if (data.status === "success") {
        if (type === "cash") {
          await sendConfirmationEmail(email, data.data as OrderData);
          await syncCart(); // Refresh cart state (should be empty now)
          toast.success(`Order placed! Check ${email} for confirmation`);
          onClose();
          router.push("/allorders");
        } else {
          window.location.href = data.session.url;
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Process failed";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-100">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg p-8 bg-white shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto"
          >
            <button onClick={onClose} className="absolute p-2 transition-colors rounded-full top-6 right-6 hover:bg-slate-100 text-slate-400">
              <X size={20} />
            </button>

            <h2 className="mb-6 text-2xl font-black text-slate-800">Checkout</h2>

            <div className="mb-6 space-y-3 text-left">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Mail size={16} className="text-emerald-600" /> Confirmation Email
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 transition-all border outline-none bg-slate-50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-2 p-1 mb-6 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setUseExisting(true)}
                disabled={addresses.length === 0}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${useExisting ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 disabled:opacity-50"}`}
              >
                Saved Address
              </button>
              <button
                type="button"
                onClick={() => setUseExisting(false)}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${!useExisting ? "bg-white shadow-sm text-emerald-600" : "text-slate-500"}`}
              >
                New Address
              </button>
            </div>

            {fetchingAddresses ? (
              <div className="py-10 text-center"><Loader2 className="mx-auto animate-spin text-emerald-600" /></div>
            ) : (
              <div className="space-y-4">
                {useExisting ? (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label key={addr._id} className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedAddressId === addr._id ? "border-emerald-500 bg-emerald-50" : "border-slate-100 hover:border-slate-200"}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" className="hidden" checked={selectedAddressId === addr._id} onChange={() => setSelectedAddressId(addr._id)} />
                          <MapPin size={18} className={selectedAddressId === addr._id ? "text-emerald-600" : "text-slate-400"} />
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800">{addr.name}</p>
                            <p className="text-[11px] text-slate-500">{addr.city}, {addr.details}</p>
                          </div>
                        </div>
                        {selectedAddressId === addr._id && <CheckCircle2 size={18} className="text-emerald-600" />}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 text-left">
                    <input placeholder="Label (e.g. Home)" className="w-full p-4 border outline-none bg-slate-50 rounded-2xl focus:ring-2 focus:ring-emerald-500 border-slate-100" onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })} />
                    <input placeholder="City" className="w-full p-4 border outline-none bg-slate-50 rounded-2xl focus:ring-2 focus:ring-emerald-500 border-slate-100" onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
                    <input placeholder="Phone" className="w-full p-4 border outline-none bg-slate-50 rounded-2xl focus:ring-2 focus:ring-emerald-500 border-slate-100" onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} />
                    <textarea placeholder="Street, Building..." rows={2} className="w-full p-4 border outline-none bg-slate-50 rounded-2xl focus:ring-2 focus:ring-emerald-500 border-slate-100" onChange={(e) => setShippingAddress({ ...shippingAddress, details: e.target.value })} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button disabled={loading} onClick={() => handleOrder("cash")} className="flex items-center justify-center gap-2 py-4 font-bold text-white transition-all bg-slate-800 hover:bg-slate-900 rounded-2xl disabled:bg-slate-300">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <><Banknote size={18} /> Cash</>}
                  </button>
                  <button disabled={loading} onClick={() => handleOrder("online")} className="flex items-center justify-center gap-2 py-4 font-bold text-white transition-all bg-emerald-600 hover:bg-emerald-700 rounded-2xl disabled:bg-slate-300">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <><CreditCard size={18} /> Visa</>}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}