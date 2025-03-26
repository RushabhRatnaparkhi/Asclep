'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/activities', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch activities');
      
      const data = await res.json();
      setActivities(data.activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load recent activities');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp)) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`loading-${index}`} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
        <p className="text-gray-500 text-center">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity._id || `${activity.type}-${activity.timestamp}`}
            className="flex items-center space-x-3 text-sm border-l-4 border-blue-500 pl-3"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {activity.type === 'medication' ? (
                  <>
                    {activity.status === 'taken' && 'Took '}
                    {activity.status === 'missed' && 'Missed '}
                    {activity.status === 'skipped' && 'Skipped '}
                    <span className="text-blue-600">{activity.medicationName}</span>
                  </>
                ) : activity.type === 'appointment' ? (
                  <>
                    Added appointment with{' '}
                    <span className="text-green-600">{activity.doctor}</span>
                  </>
                ) : (
                  activity.description
                )}
              </p>
              <p className="text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 