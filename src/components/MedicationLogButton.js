'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function MedicationLogButton({ medication, onLog }) {
  const [isLogging, setIsLogging] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleLog = async (status) => {
    setIsLogging(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/medications/${medication._id}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          scheduledTime: new Date(),
          notes: ''
        })
      });

      if (!res.ok) throw new Error('Failed to log medication');

      toast.success(`Medication marked as ${status}`);
      setShowOptions(false);
      if (onLog) onLog();
    } catch (error) {
      console.error('Error logging medication:', error);
      toast.error('Failed to log medication');
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isLogging}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLogging ? 'Logging...' : 'Log Medication'}
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu">
            <button
              onClick={() => handleLog('taken')}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              ✅ Taken
            </button>
            <button
              onClick={() => handleLog('missed')}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              ❌ Missed
            </button>
            <button
              onClick={() => handleLog('skipped')}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              ⏭️ Skipped
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 