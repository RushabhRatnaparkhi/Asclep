'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Navigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST'
      });
      
      if (!res.ok) throw new Error('Logout failed');
      
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="bg-blue-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Asclep Health
        </Link>
        
        <div className="space-x-4">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link href="/prescriptions" className="hover:text-blue-200">
                    Prescriptions
                  </Link>
                  <Link 
                    href="/medications" 
                    className="text-white hover:text-blue-200"
                  >
                    Medications
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hover:text-blue-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-blue-200">
                    Login
                  </Link>
                  <Link href="/register" className="hover:text-blue-200">
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}