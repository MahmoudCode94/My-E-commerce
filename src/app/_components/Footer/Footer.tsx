"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ShoppingBag } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();
    const excludedRoutes = [
        "/login",
        "/signup",
        "/register",
        "/forgot-password",
        "/verify-code",
        "/reset-password",
    ];

    if (excludedRoutes.includes(pathname)) {
        return null;
    }

    return (
        <footer className="pt-16 pb-8 bg-slate-50 border-t border-slate-200 text-slate-600">
            <div className="container px-4 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6 text-2xl font-black tracking-tighter text-emerald-600">
                            <ShoppingBag size={28} />
                            <span>FRESH<span className="text-slate-900">CART</span></span>
                        </Link>
                        <p className="mb-6 leading-relaxed text-slate-500 max-w-sm">
                            Your one-stop destination for the latest technology, fashion, and lifestyle products. Quality guaranteed with fast shipping and excellent customer service.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="mt-1 text-emerald-600 shrink-0" />
                                <span className="text-sm">123 Shop Street, Octoper City, DC 12345</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={20} className="text-emerald-600 shrink-0" />
                                <span className="text-sm">(+20) 01093333333</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-emerald-600 shrink-0" />
                                <span className="text-sm">support@shopmart.com</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-6 font-bold text-slate-900 uppercase tracking-wider text-sm">Shop</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/products" className="hover:text-emerald-600 transition-colors">Electronics</Link></li>
                            <li><Link href="/products" className="hover:text-emerald-600 transition-colors">Fashion</Link></li>
                            <li><Link href="/products" className="hover:text-emerald-600 transition-colors">Home & Garden</Link></li>
                            <li><Link href="/products" className="hover:text-emerald-600 transition-colors">Sports</Link></li>
                            <li><Link href="/products" className="hover:text-emerald-600 transition-colors">Deals</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-6 font-bold text-slate-900 uppercase tracking-wider text-sm">Customer Service</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/contact" className="hover:text-emerald-600 transition-colors">Contact Us</Link></li>
                            <li><Link href="/help" className="hover:text-emerald-600 transition-colors">Help Center</Link></li>
                            <li><Link href="/orders" className="hover:text-emerald-600 transition-colors">Track Your Order</Link></li>
                            <li><Link href="/returns" className="hover:text-emerald-600 transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="/guide" className="hover:text-emerald-600 transition-colors">Size Guide</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-6 font-bold text-slate-900 uppercase tracking-wider text-sm">Policy</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cookie" className="hover:text-emerald-600 transition-colors">Cookie Policy</Link></li>
                            <li><Link href="/shipping" className="hover:text-emerald-600 transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/refund" className="hover:text-emerald-600 transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 mt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">
                        © {new Date().getFullYear()} FreshCart. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 text-slate-400 transition-colors hover:text-emerald-600 hover:bg-emerald-50 rounded-full">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="p-2 text-slate-400 transition-colors hover:text-emerald-600 hover:bg-emerald-50 rounded-full">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="p-2 text-slate-400 transition-colors hover:text-emerald-600 hover:bg-emerald-50 rounded-full">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="p-2 text-slate-400 transition-colors hover:text-emerald-600 hover:bg-emerald-50 rounded-full">
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
