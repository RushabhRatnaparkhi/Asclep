'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function UpcomingMedications() {
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMedications() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/medications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch medications');
        
        const data = await res.json();
        
        // Process medications to add next dose times
        const processedMeds = data.medications.map(med => {
          // Calculate next dose based on frequency and time of day
          const now = new Date();
          const [nextDose, timeUntil] = calculateNextDose(med.timeOfDay, med.frequency);
          
          return {
            ...med,
            nextDose: nextDose.toLocaleTimeString([], { 
              hour: 'numeric', 
              minute: '2-digit' 
            }),
            timeUntil
          };
        });

        // Sort by next dose time
        processedMeds.sort((a, b) => new Date(a.nextDose) - new Date(b.nextDose));
        
        setMedications(processedMeds);
      } catch (error) {
        console.error('Error fetching medications:', error);
        toast.error('Failed to load medications');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedications();
  }, []);

  function calculateNextDose(timeOfDay, frequency) {
    const now = new Date();
    const times = {
      'morning': 9,  // 9 AM
      'afternoon': 14, // 2 PM
      'evening': 18,  // 6 PM
      'night': 22,    // 10 PM
    };

    // Find the next available time
    let nextDose = new Date();
    let timeUntil = '';

    if (frequency === 'daily') {
      const availableTimes = timeOfDay.map(t => times[t]);
      const nextTime = availableTimes.find(hour => hour > now.getHours()) || availableTimes[0];
      
      nextDose.setHours(nextTime, 0, 0, 0);
      if (nextTime <= now.getHours()) {
        nextDose.setDate(nextDose.getDate() + 1);
      }
    }
    // Add more frequency calculations as needed

    // Calculate time until next dose
    const diffHours = Math.round((nextDose - now) / (1000 * 60 * 60));
    timeUntil = diffHours === 1 ? '1 hour' : `${diffHours} hours`;

    return [nextDose, timeUntil];
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Medications</h2>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`loading-${index}`} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!medications.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Medications</h2>
        <p className="text-gray-500 text-center py-4">No medications scheduled</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Medications</h2>
      <div className="space-y-4">
        {medications.map((med) => (
          <div
            key={med._id || `med-${med.name}-${med.nextDose}`}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{med.name}</h3>
                <p className="text-sm text-gray-500">{med.dosage}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{med.nextDose}</p>
                <p className="text-sm text-gray-500">in {med.timeUntil}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 