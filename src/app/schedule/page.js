'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  async function fetchSchedule() {
    try {
      const response = await fetch('/api/schedule', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch schedule');
      
      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      console.error('Schedule error:', error);
      toast.error('Failed to load schedule');
    } finally {
      setIsLoading(false);
    }
  }

  const groupByDate = (medications) => {
    return medications.reduce((groups, med) => {
      const date = new Date(med.nextDoseTime).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(med);
      return groups;
    }, {});
  };

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

  const groupedSchedule = groupByDate(schedule);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Medication Schedule</h1>
        
        {Object.entries(groupedSchedule).map(([date, medications]) => (
          <div key={date} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {new Date(date).toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {medications.map((medication) => (
                <div 
                  key={medication._id} 
                  className="p-4 border-b last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {medication.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {medication.dosage}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(medication.nextDoseTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {medication.frequency}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {schedule.length === 0 && (
          <div className="text-center bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No upcoming medications
            </h3>
            <p className="text-gray-600">
              Your schedule for the next 7 days will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}