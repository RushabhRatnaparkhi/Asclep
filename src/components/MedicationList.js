'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import NotificationConsent from './NotificationConsent';

export default function MedicationList() {
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchMedications = async () => {
    try {
      const response = await fetch('/api/medications');
      if (!response.ok) throw new Error('Failed to fetch medications');
      const data = await response.json();
      setMedications(data.medications || []);
    } catch (error) {
      toast.error(error.message);
      setMedications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name: e.target.name.value,
        dosage: e.target.dosage.value,
        frequency: e.target.frequency.value,
        startDate: e.target.startDate.value || new Date().toISOString(),
        dosageTime: e.target.dosageTime.value,
        instructions: e.target.instructions.value,
        status: 'active',
      };

      const response = await fetch('/api/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add medication');
      }

      toast.success('Medication added successfully');
      setShowForm(false);
      fetchMedications();
      e.target.reset();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <NotificationConsent />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Medications</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition duration-200 ease-in-out"
        >
          {showForm ? '× Cancel' : '+ Add Medication'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Medication Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Enter medication name"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-2">
                Dosage*
              </label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                required
                placeholder="e.g., 50mg, 2 tablets"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Frequency*
              </label>
              <select
                id="frequency"
                name="frequency"
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Every 4 hours">Every 4 hours</option>
                <option value="Every 6 hours">Every 6 hours</option>
                <option value="Every 8 hours">Every 8 hours</option>
                <option value="As needed">As needed</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="dosageTime" className="block text-sm font-medium text-gray-700 mb-2">
                Time of First Dose*
              </label>
              <input
                type="time"
                id="dosageTime"
                name="dosageTime"
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date*
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                rows="3"
                placeholder="Enter any special instructions (e.g., take with food)"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out"
            >
              Save Medication
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div>Loading medications...</div>
      ) : !medications.length ? (
        <div>No medications found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {medications.map((medication) => (
            <div key={medication._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">{medication.name}</h3>
              <p className="text-gray-600">Dosage: {medication.dosage}</p>
              <p className="text-gray-600">Frequency: {medication.frequency}</p>
              {medication.instructions && (
                <p className="text-gray-600 mt-2">Instructions: {medication.instructions}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}