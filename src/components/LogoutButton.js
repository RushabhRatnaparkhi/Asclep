'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Logout failed');

      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors duration-200 flex items-center"
    >
      Logout
    </button>
  );
} 