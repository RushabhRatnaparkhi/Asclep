'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch('/api/prescriptions');
        if (!response.ok) throw new Error('Failed to fetch prescriptions');
        const data = await response.json();
        // Make sure we're setting an array
        setPrescriptions(data.prescriptions || []);
      } catch (error) {
        toast.error(error.message);
        setPrescriptions([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!Array.isArray(prescriptions) || prescriptions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No prescriptions found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptions.map((prescription) => (
          <div key={prescription._id} className="bg-white rounded-lg shadow p-6">
            {prescription.imageUrl && (
              <div className="mb-4">
                <img
                  src={prescription.imageUrl}
                  alt="Prescription"
                  className="w-full h-48 object-cover rounded"
                />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2">{prescription.medication}</h2>
            <p className="text-gray-600">Dosage: {prescription.dosage}</p>
            <p className="text-gray-600">Frequency: {prescription.frequency}</p>
            {prescription.startDate && (
              <p className="text-gray-600">
                Start Date: {new Date(prescription.startDate).toLocaleDateString()}
              </p>
            )}
            {prescription.instructions && (
              <p className="text-gray-600 mt-2">
                Instructions: {prescription.instructions}
              </p>
            )}
            <div className="mt-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                prescription.status === 'active' ? 'bg-green-100 text-green-800' :
                prescription.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {prescription.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}