'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AddMedicationForm({ onClose, onAdd }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    timeOfDay: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    remainingPills: '',
    reminderEnabled: false
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Medication name is required';
    }
    
    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    }
    
    if (formData.timeOfDay.length === 0) {
      newErrors.timeOfDay = 'Please select at least one time of day';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/medications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to add medication');
      }

      toast.success('Medication added successfully');
      onAdd();
      onClose();
    } catch (error) {
      console.error('Error adding medication:', error);
      toast.error('Failed to add medication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Medication</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medication Name*
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full rounded-md border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dosage*
            </label>
            <input
              type="text"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              className={`w-full rounded-md border ${
                errors.dosage ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
              placeholder="e.g., 500mg"
            />
            {errors.dosage && (
              <p className="mt-1 text-sm text-red-500">{errors.dosage}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency*
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="as-needed">As Needed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time of Day*
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['morning', 'afternoon', 'evening', 'night'].map((time) => (
                <label key={time} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.timeOfDay.includes(time)}
                    onChange={(e) => {
                      const updatedTimes = e.target.checked
                        ? [...formData.timeOfDay, time]
                        : formData.timeOfDay.filter(t => t !== time);
                      setFormData({ ...formData, timeOfDay: updatedTimes });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{time}</span>
                </label>
              ))}
            </div>
            {errors.timeOfDay && (
              <p className="mt-1 text-sm text-red-500">{errors.timeOfDay}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date*
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={`w-full rounded-md border ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={`w-full rounded-md border ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remaining Pills
            </label>
            <input
              type="number"
              value={formData.remainingPills}
              onChange={(e) => setFormData({ ...formData, remainingPills: e.target.value })}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="reminderEnabled"
              checked={formData.reminderEnabled}
              onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="reminderEnabled" className="ml-2 text-sm text-gray-700">
              Enable Reminders
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Medication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 