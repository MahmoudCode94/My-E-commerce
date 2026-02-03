'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '@/api/auth.api';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await verifyToken();
        if (data && data.message === 'success') {
          setIsAuthorized(true);
        } else {
          localStorage.removeItem('userToken');
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      }
    }
    checkAuth();
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  return <>{children}</>;
}