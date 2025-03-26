'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { requestNotificationPermission } from '@/utils/notifications';
import { reminderService } from '@/services/reminderService';
import { useRouter } from 'next/navigation';
import MedicationLogButton from '@/components/MedicationLogButton';

export default function MedicationList({ medications = [], onUpdate }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/medications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete medication');

      toast.success('Medication deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete medication');
      console.error('Error deleting medication:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleReminder = async (medication) => {
    try {
      if (!medication.reminderEnabled) {
        // Request permission when enabling reminders
        const permissionGranted = await requestNotificationPermission();
        if (!permissionGranted) {
          toast.error('Please enable notifications to use reminders');
          return;
        }
      }

      // Update reminder status in database
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/medications/${medication._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reminderEnabled: !medication.reminderEnabled
        })
      });

      if (!res.ok) throw new Error('Failed to update reminder settings');

      const { medication: updatedMedication } = await res.json();
      
      // Schedule or cancel reminders
      if (updatedMedication.reminderEnabled) {
        reminderService.scheduleReminder(updatedMedication);
      } else {
        reminderService.cancelReminder(updatedMedication._id);
      }

      toast.success(
        medication.reminderEnabled 
          ? 'Reminders disabled' 
          : 'Reminders enabled'
      );
    } catch (error) {
      toast.error('Failed to update reminder settings');
    }
  };

  // Initialize reminders for enabled medications
  useEffect(() => {
    medications.forEach(medication => {
      if (medication.reminderEnabled) {
        reminderService.scheduleReminder(medication);
      }
    });

    // Cleanup on unmount
    return () => {
      medications.forEach(medication => {
        reminderService.cancelReminder(medication._id);
      });
    };
  }, [medications]);

  if (!medications.length) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">No medications added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200">
        {medications.map((medication) => (
          <div key={medication._id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div 
                onClick={() => router.push(`/medications/${medication._id}`)}
                className="cursor-pointer flex-grow"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {medication.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {medication.dosage} • {medication.frequency}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  {medication.timeOfDay.map((time) => (
                    <span
                      key={time}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MedicationLogButton 
                  medication={medication}
                  onLog={onUpdate}
                />
                <button
                  onClick={() => router.push(`/medications/${medication._id}`)}
                  className="text-blue-600 hover:text-blue-800"
                  title="View Details"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => toggleReminder(medication)}
                  disabled={updatingId === medication._id}
                  className={`${
                    medication.reminderEnabled 
                      ? 'text-green-600 hover:text-green-800' 
                      : 'text-gray-400 hover:text-gray-600'
                  } disabled:opacity-50`}
                  title={medication.reminderEnabled ? 'Disable reminders' : 'Enable reminders'}
                >
                  {updatingId === medication._id ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(medication._id)}
                  disabled={deletingId === medication._id}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  {deletingId === medication._id ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {medication.notes && (
              <p className="mt-3 text-sm text-gray-500">
                {medication.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 