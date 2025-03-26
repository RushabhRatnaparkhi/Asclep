'use client';

import { useState, useEffect } from 'react';
import AddMedicationForm from '@/components/AddMedicationForm';
import MedicationList from '@/components/MedicationList';
import { toast } from 'react-hot-toast';

export default function MedicationsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/medications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch medications');
      
      const data = await res.json();
      setMedications(data.medications);
    } catch (error) {
      console.error('Failed to fetch medications:', error);
      toast.error('Failed to load medications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Medications</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Medication
        </button>
      </div>

      <MedicationList medications={medications} onUpdate={fetchMedications} />

      {showAddForm && (
        <AddMedicationForm
          onClose={() => setShowAddForm(false)}
          onAdd={fetchMedications}
        />
      )}
    </div>
  );
} 