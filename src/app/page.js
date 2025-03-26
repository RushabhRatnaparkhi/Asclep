import Image from "next/image";
import DashboardStats from '@/components/DashboardStats';
import MedicationList from '@/components/MedicationList';
import NutritionTracker from '@/components/NutritionTracker';
import UpcomingMedications from '@/components/UpcomingMedications';
import RecentActivity from '@/components/RecentActivity';

export default function Home() {
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
