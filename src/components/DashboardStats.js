'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    dueTodayCount: 0,
    lowMedicationCount: 0,
    adherenceRate: 0,
    nextAppointment: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Health Overview</h2>
        <div className="space-y-4 animate-pulse">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Health Overview</h2>
      <div className="space-y-4">
        <div className="border-b pb-2">
          <p className="text-gray-600">Medications Due Today</p>
          <p className="text-2xl font-bold">{stats.dueTodayCount}</p>
        </div>
        
        <div className="border-b pb-2">
          <p className="text-gray-600">Medications Running Low</p>
          <p className={`text-2xl font-bold ${
            stats.lowMedicationCount > 0 ? 'text-yellow-600' : 'text-gray-900'
          }`}>
            {stats.lowMedicationCount}
          </p>
          {stats.lowMedicationCount > 0 && (
            <p className="text-sm text-yellow-600 mt-1">
              Some medications need refill
            </p>
          )}
        </div>

        <div className="border-b pb-2">
          <p className="text-gray-600">Medication Adherence</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold">{stats.adherenceRate}%</p>
            <div className="ml-2 flex-grow">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${stats.adherenceRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {stats.nextAppointment && (
          <div>
            <p className="text-gray-600">Next Appointment</p>
            <p className="text-lg font-semibold">
              {new Date(stats.nextAppointment).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 