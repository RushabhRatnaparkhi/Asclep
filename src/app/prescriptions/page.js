'use client';

import { useState, useEffect } from 'react';
import UploadPrescription from '@/components/UploadPrescription';
import { toast } from 'react-hot-toast';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions');
      if (!response.ok) throw new Error('Failed to fetch prescriptions');
      const data = await response.json();
      setPrescriptions(data.prescriptions);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>
      
      <UploadPrescription onUploadComplete={fetchPrescriptions} />

      {isLoading ? (
        <div className="text-center">Loading prescriptions...</div>
      ) : prescriptions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <h3 className="font-semibold mb-2">{prescription.title}</h3>
              <div className="mb-2">
                <a
                  href={prescription.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Prescription
                </a>
              </div>
              <div className="text-sm text-gray-500">
                Added: {new Date(prescription.createdAt).toLocaleDateString()}
              </div>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  prescription.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : prescription.status === 'completed'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {prescription.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No prescriptions found. Upload your first prescription above.
        </div>
      )}
    </div>
  );
}