'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { use } from 'react';
import MedicationLogButton from '@/components/MedicationLogButton';
import MedicationHistory from '@/components/MedicationHistory';

export default function MedicationDetails({ params }) {
  const router = useRouter();
  const medicationId = use(params).id;
  const [medication, setMedication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    fetchMedication();
  }, [medicationId]);

  const fetchMedication = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view medication details');
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/medications/${medicationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch medication');
      }
      
      const data = await res.json();
      setMedication(data.medication);
      setEditedData(data.medication);
    } catch (error) {
      console.error('Error fetching medication:', error);
      toast.error(error.message || 'Failed to load medication details');
      router.push('/medications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/medications/${medicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedData)
      });

      if (!res.ok) throw new Error('Failed to update medication');

      const { medication: updatedMedication } = await res.json();
      setMedication(updatedMedication);
      setIsEditing(false);
      toast.success('Medication updated successfully');
    } catch (error) {
      toast.error('Failed to update medication');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-500 text-center">Medication not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Medication' : medication.name}
            </h1>
            <div className="space-x-2">
              {!isEditing && (
                <>
                  <MedicationLogButton 
                    medication={medication} 
                    onLog={fetchMedication}
                  />
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </>
              )}
              <button
                onClick={() => router.push('/medications')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Dosage</label>
                <input
                  type="text"
                  value={editedData.dosage}
                  onChange={(e) => setEditedData({ ...editedData, dosage: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <select
                  value={editedData.frequency}
                  onChange={(e) => setEditedData({ ...editedData, frequency: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="as_needed">As Needed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time of Day</label>
                <div className="mt-2 space-y-2">
                  {['morning', 'afternoon', 'evening', 'night'].map((time) => (
                    <label key={time} className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={editedData.timeOfDay.includes(time)}
                        onChange={(e) => {
                          const updatedTimes = e.target.checked
                            ? [...editedData.timeOfDay, time]
                            : editedData.timeOfDay.filter(t => t !== time);
                          setEditedData({ ...editedData, timeOfDay: updatedTimes });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700 capitalize">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={editedData.startDate.split('T')[0]}
                    onChange={(e) => setEditedData({ ...editedData, startDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={editedData.endDate?.split('T')[0] || ''}
                    onChange={(e) => setEditedData({ ...editedData, endDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={editedData.notes || ''}
                  onChange={(e) => setEditedData({ ...editedData, notes: e.target.value })}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedData(medication);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dosage</h3>
                  <p className="mt-1 text-lg text-gray-900">{medication.dosage}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Frequency</h3>
                  <p className="mt-1 text-lg text-gray-900 capitalize">{medication.frequency}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Time of Day</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {medication.timeOfDay.map((time) => (
                    <span
                      key={time}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {new Date(medication.startDate).toLocaleDateString()}
                  </p>
                </div>
                {medication.endDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                    <p className="mt-1 text-lg text-gray-900">
                      {new Date(medication.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {medication.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="mt-1 text-gray-900">{medication.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Medication History</h2>
        <MedicationHistory medicationId={medicationId} />
      </div>
    </div>
  );
} 