'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getTimeUntilNextDose } from '@/utils/timeUtils';

export default function MedicationDetailsPage({ params }) {
  const id = use(params).id;  // Using React.use() to unwrap params
  const router = useRouter();
  const [medication, setMedication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMedicationDetails() {
      try {
        const response = await fetch(`/api/medications/${id}`, {
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch medication details');

        const data = await response.json();
        setMedication(data);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load medication details');
        router.push('/medications');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedicationDetails();
  }, [id, router]);

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

  if (!medication) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{medication.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                medication.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Medication Details</h2>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Dosage</dt>
                    <dd className="mt-1 text-sm text-gray-900">{medication.dosage}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Frequency</dt>
                    <dd className="mt-1 text-sm text-gray-900">{medication.frequency}</dd>
                  </div>
                  {medication.customFrequency && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Custom Schedule</dt>
                      <dd className="mt-1 text-sm text-gray-900">{medication.customFrequency}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Instructions</dt>
                    <dd className="mt-1 text-sm text-gray-900">{medication.instructions || 'No special instructions'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Information</h2>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Next Dose</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {medication.nextDoseTime ? (
                        <>
                          {new Date(medication.nextDoseTime).toLocaleString()}
                          <span className="ml-2 text-blue-600">
                            ({getTimeUntilNextDose(medication.nextDoseTime)})
                          </span>
                        </>
                      ) : 'Not scheduled'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(medication.startDate).toLocaleDateString()}
                    </dd>
                  </div>
                  {medication.endDate && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">End Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(medication.endDate).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {medication.prescriptionFile && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Prescription</h2>
                <a
                  href={medication.prescriptionFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-500"
                >
                  View Prescription
                  <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
              <button
                onClick={() => router.push(`/medications/${medication._id}/edit`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Edit Medication
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}