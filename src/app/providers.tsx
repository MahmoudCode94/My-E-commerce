'use client';

import { WishlistProvider } from '@/context/WishlistContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#333',
                                color: '#fff',
                                borderRadius: '10px',
                            },
                        }}
                    />
                    {children}
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    );
}
