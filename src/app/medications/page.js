'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { getTimeUntilNextDose } from '@/utils/timeUtils';

export default function MedicationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams.get('showForm') === 'true');
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once-daily',
    customFrequency: '',
    startDate: '',
    endDate: '',
    firstDoseTime: '',
    instructions: ''
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Update the time display every minute
    const interval = setInterval(() => {
      setRefreshKey(old => old + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchMedications();
  }, []);

  useEffect(() => {
    // Update URL when form visibility changes
    if (showForm) {
      router.push('/medications?showForm=true');
    } else {
      router.push('/medications');
    }
  }, [showForm, router]);

  async function fetchMedications() {
    try {
      const response = await fetch('/api/medications', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch medications');
      const data = await response.json();
      setMedications(data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load medications');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Calculate nextDoseTime and dosageTime
      const startDateTime = new Date(formData.startDate);
      const [hours, minutes] = formData.firstDoseTime.split(':');
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const medicationData = {
        ...formData,
        dosageTime: formData.firstDoseTime,
        nextDoseTime: startDateTime.toISOString(),
        reminders: {
          enabled: true,
          notificationTime: [{
            time: formData.firstDoseTime,
            enabled: true
          }]
        }
      };

      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicationData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add medication');
      }

      toast.success('Medication added successfully');
      setShowForm(false);
      setFormData({
        name: '',
        dosage: '',
        frequency: 'once-daily',
        customFrequency: '',
        startDate: '',
        endDate: '',
        firstDoseTime: '',
        instructions: ''
      });
      fetchMedications();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(medicationId) {
    if (!window.confirm('Are you sure you want to delete this medication?')) {
      return;
    }

    try {
      const response = await fetch(`/api/medications/${medicationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete medication');
      }

      toast.success('Medication deleted successfully');
      fetchMedications();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete medication');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Medications</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Medication'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Medication</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dosage</label>
                  <input
                    type="text"
                    required
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frequency</label>
                  <select
                    required
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <optgroup label="Daily Frequencies">
                      <option value="once-daily">Once Daily</option>
                      <option value="twice-daily">Twice Daily (Morning & Evening)</option>
                      <option value="three-daily">Three Times Daily (Morning, Afternoon & Night)</option>
                      <option value="four-daily">Four Times Daily (Every 6 hours)</option>
                    </optgroup>
                    <optgroup label="Weekly Frequencies">
                      <option value="once-weekly">Once Weekly</option>
                      <option value="twice-weekly">Twice Weekly</option>
                      <option value="three-weekly">Three Times Weekly</option>
                    </optgroup>
                    <optgroup label="Monthly Frequencies">
                      <option value="once-monthly">Once Monthly</option>
                      <option value="twice-monthly">Twice Monthly</option>
                    </optgroup>
                    <optgroup label="Other Frequencies">
                      <option value="as-needed">As Needed (PRN)</option>
                      <option value="every-other-day">Every Other Day</option>
                      <option value="custom">Custom Schedule</option>
                    </optgroup>
                  </select>
                </div>

                {formData.frequency === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Custom Frequency Details
                    </label>
                    <textarea
                      value={formData.customFrequency}
                      onChange={(e) => setFormData({...formData, customFrequency: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Please specify your custom medication schedule..."
                      rows={2}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">First Dose Time</label>
                  <input
                    type="time"
                    required
                    value={formData.firstDoseTime}
                    onChange={(e) => setFormData({...formData, firstDoseTime: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-md text-white ${
                    isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Adding...' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : medications.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No medications added yet</h3>
            <p className="text-gray-600">Add your first medication to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medications.map((medication) => (
              <div key={medication._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                  <button
                    onClick={() => handleDelete(medication._id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                    title="Delete medication"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-1">Dosage: {medication.dosage}</p>
                <p className="text-gray-600 mb-1">Frequency: {medication.frequency}</p>
                <p className="text-gray-600 mb-2">
                  Next dose: {medication.nextDoseTime ? new Date(medication.nextDoseTime).toLocaleString() : 'Not scheduled'}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`/medications/${medication._id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Details
                  </Link>
                  {medication.nextDoseTime && (
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      new Date(medication.nextDoseTime) < new Date()
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getTimeUntilNextDose(medication.nextDoseTime)}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
          </div>
        )}
      </div>
    </div>
  );
}