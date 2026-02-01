'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'Categories', href: '/categories' },
        { name: 'Brands', href: '/brands' },
    ];

    return (
        <nav className='bg-black flex items-center justify-between py-5 px-20 sticky top-0 z-50 shadow-md'>
            <div className='text-white text-xl font-bold'>
                <Link href={'/'} className="flex items-center gap-2">
                    <i className='fa-solid fa-cart-shopping text-emerald-500'></i> FreshCart
                </Link>
            </div>

            <div>
                <ul className='flex text-white gap-8 text-lg'>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.href}>
                                <Link 
                                    href={link.href} 
                                    className={`relative pb-1.5 transition-all duration-300 
                                        after:content-[""] after:absolute after:left-0 after:bottom-0 
                                        after:bg-white after:transition-all after:duration-300
                                        ${isActive 
                                            ? 'after:w-full after:h-0.5' 
                                            : 'after:w-0 after:h-0.5 hover:after:w-full hover:after:h-[2.5px]'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div>
                <ul className='flex gap-6 items-center text-white'>
                    <li>
                        <Link href={'/cart'} className={`transition-transform hover:scale-110 block ${pathname === '/cart' ? 'text-emerald-400' : ''}`}>
                            <i className='fa-solid fa-cart-shopping text-xl'></i>
                        </Link>
                    </li>
                    <li className='hover:text-gray-300 transition-colors'><Link href={'/login'}>Login</Link></li>
                    <li className='hover:text-gray-300 transition-colors'><Link href={'/regester'}>Register</Link></li>
                </ul>
            </div>
        </nav>
    );
}