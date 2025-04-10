'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { formatRelativeTime } from '@/utils/dateUtils';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMedications: 0,
    activeMedications: 0,
    upcomingDoses: 0,
    prescriptions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivities();
  }, []);

  async function fetchDashboardData() {
    try {
      const response = await fetch('/api/dashboard/stats', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchRecentActivities() {
    try {
      const response = await fetch('/api/activities', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setRecentActivities(data);
    } catch (error) {
      console.error('Activities error:', error);
      toast.error('Failed to load recent activities');
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Asclep</h1>
          <p className="text-blue-100 text-lg">Your personal medication management dashboard</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Medications"
            value={stats.totalMedications}
            icon={<PillIcon />}
            color="bg-purple-500"
          />
          <StatsCard
            title="Active Medications"
            value={stats.activeMedications}
            icon={<ActiveIcon />}
            color="bg-green-500"
          />
          <StatsCard
            title="Upcoming Doses"
            value={stats.upcomingDoses}
            icon={<ClockIcon />}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Prescriptions"
            value={stats.prescriptions}
            icon={<DocIcon />}
            color="bg-blue-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <QuickActionCard
            title="Add Medication"
            description="Add a new medication to your schedule"
            href="/medications"
            icon={<AddIcon />}
            color="bg-blue-600"
          />
          <QuickActionCard
            title="Upload Prescription"
            description="Upload and store your prescriptions"
            href="/prescriptions"
            icon={<UploadIcon />}
            color="bg-purple-600"
          />
          <QuickActionCard
            title="View Schedule"
            description="Check your medication schedule"
            href="/schedule"
            icon={<CalendarIcon />}
            color="bg-green-600"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity._id} className="flex items-start space-x-3">
                    <div className={`
                      rounded-full p-2
                      ${activity.type === 'MEDICATION_TAKEN' ? 'bg-green-100 text-green-600' :
                        activity.type === 'MEDICATION_ADDED' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'PRESCRIPTION_UPLOADED' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'}
                    `}>
                      <ActivityIcon type={activity.type} />
                    </div>
                    <div>
                      <p className="text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for statistics cards
function StatsCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`${color} rounded-full p-3 text-white`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Component for quick action cards
function QuickActionCard({ title, description, href, icon, color }) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
        <div className={`${color} rounded-full w-12 h-12 flex items-center justify-center text-white mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </Link>
  );
}

// Icons (using heroicons style)
const PillIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ActiveIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AddIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'MEDICATION_TAKEN':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'MEDICATION_ADDED':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      );
    case 'PRESCRIPTION_UPLOADED':
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};