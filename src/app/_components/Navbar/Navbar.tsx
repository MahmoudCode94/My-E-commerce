"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Categories', href: '/categories' },
        { name: 'Brands', href: '/brands' },
    ];

    return (
        <nav className='bg-black text-white sticky top-0 z-50 shadow-md transition-all duration-300'>
            <div className='flex items-center justify-between py-4 px-6 lg:px-20'>
                
                <div className='text-white text-xl font-bold'>
                    <Link href={'/'} className="flex items-center gap-2">
                        <i className='fa-solid fa-cart-shopping text-emerald-500'></i> FreshCart
                    </Link>
                </div>
                <div className='hidden lg:block'>
                    <ul className='flex gap-8 text-lg'>
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`relative pb-1 transition-all duration-300 after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-white after:transition-all ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className='flex items-center gap-6'>
                    <Link href={'/cart'} className={`transition-transform hover:scale-110 ${pathname === '/cart' ? 'text-emerald-400' : ''}`}>
                        <i className='fa-solid fa-cart-shopping text-xl'></i>
                    </Link>
                    <ul className='hidden lg:flex gap-6 items-center'>
                        <li className='hover:text-emerald-400 transition-colors'><Link href={'/login'}>Login</Link></li>
                        <li className='bg-emerald-600 px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors'><Link href={'/register'}>Register</Link></li>
                    </ul>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='lg:hidden text-2xl focus:outline-none'
                    >
                        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                    </button>
                </div>
            </div>
            <div className={`lg:hidden overflow-hidden transition-all duration-300 bg-zinc-900 ${isOpen ? 'max-h-[500px] border-t border-zinc-800' : 'max-h-0'}`}>
                <ul className='flex flex-col p-6 gap-4'>
                    {navLinks.map((link) => (
                        <li key={link.href} onClick={() => setIsOpen(false)}>
                            <Link href={link.href} className={`block py-2 ${pathname === link.href ? 'text-emerald-500' : 'text-white'}`}>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <hr className='border-zinc-700 my-2' />
                    <li onClick={() => setIsOpen(false)}>
                        <Link href={'/login'} className='block py-2 text-gray-300'>Login</Link>
                    </li>
                    <li onClick={() => setIsOpen(false)}>
                        <Link href={'/register'} className='block py-2 text-emerald-500 font-bold'>Register</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}