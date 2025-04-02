'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardStats from '@/components/DashboardStats';
import MedicationList from '@/components/MedicationList';
import UpcomingMedications from '@/components/UpcomingMedications';
import RecentActivity from '@/components/RecentActivity';
import { toast } from 'react-hot-toast';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();

        if (!data.authenticated) {
          router.replace('/login');
        }
      } catch (error) {
        toast.error('Authentication failed');
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-800">Asclep Health</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardStats />
          <UpcomingMedications />
          <RecentActivity />
        </div>
      </div>
    </main>
  );
}
