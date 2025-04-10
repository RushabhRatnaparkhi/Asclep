'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function EditMedicationPage({ params }) {
  const id = use(params).id;  // Unwrap params using React.use()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    async function fetchMedication() {
      try {
        const response = await fetch(`/api/medications/${id}`, {
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch medication');

        const data = await response.json();
        setFormData({
          name: data.name,
          dosage: data.dosage,
          frequency: data.frequency,
          customFrequency: data.customFrequency || '',
          startDate: new Date(data.startDate).toISOString().split('T')[0],
          endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
          firstDoseTime: data.dosageTime,
          instructions: data.instructions || ''
        });
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load medication');
        router.push('/medications');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedication();
  }, [id, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/medications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to update medication');

      toast.success('Medication updated successfully');
      router.push(`/medications/${id}`);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to update medication');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Medication</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium text-gray-700">Custom Schedule</label>
                  <textarea
                    value={formData.customFrequency}
                    onChange={(e) => setFormData({...formData, customFrequency: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-white ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}