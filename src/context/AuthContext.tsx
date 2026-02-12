'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface DecodedToken {
    name?: string;
    id?: string;
    iat?: number;
    exp?: number;
}

interface AuthContextType {
    isLoggedIn: boolean;
    userName: string;
    userId: string;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const router = useRouter();

    const checkAuth = useCallback(async () => {
        const token = Cookies.get('userToken');
        if (token) {
            try {
                // 1. Decode locally for immediate UI feedback
                const decoded = jwtDecode<DecodedToken>(token);

                // 2. Optimistically set state
                setIsLoggedIn(true);
                setUserName(decoded.name || 'User');
                setUserId(decoded.id || '');

                // 3. Verify with server in background to ensure token hasn't been revoked
                // We import dynamically to avoid circular dependencies if any, though imports are usually hoisted.
                // Better to just use the imported verifyToken from api/auth.api if available in scope.
                const { verifyToken } = await import('@/api/auth.api');
                await verifyToken();

            } catch (error) {
                console.error('Token verification failed:', error);
                handleLogout();
            }
        } else {
            setIsLoggedIn(false);
            setUserName('');
            setUserId('');
        }
    }, []);

    useEffect(() => {
        checkAuth();
        window.addEventListener('userLogin', checkAuth);
        return () => window.removeEventListener('userLogin', checkAuth);
    }, [checkAuth]);

    const handleLogin = (token: string) => {
        Cookies.set('userToken', token, {
            secure: true,
            sameSite: 'strict',
            expires: 7
        });
        window.dispatchEvent(new Event('userLogin'));
    };

    const handleLogout = () => {
        Cookies.remove('userToken');
        setIsLoggedIn(false);
        setUserName('');
        setUserId('');
        window.dispatchEvent(new Event('userLogin'));
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userName, userId, login: handleLogin, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
