'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function DashboardPage() {
    const [medications, setMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMedications() {
            try {
                const response = await fetch('/api/medications', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch medications');
                }

                const data = await response.json();
                setMedications(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Dashboard error:', error);
                toast.error('Failed to load medications');
            } finally {
                setIsLoading(false);
            }
        }

        fetchMedications();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <Link
                        href="/medications?showForm=true"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add Medication
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : medications.length === 0 ? (
                    <div className="text-center bg-white rounded-lg shadow-sm p-8">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No medications added yet</h3>
                        <p className="text-gray-600 mb-4">Start by adding your first medication</p>
                        <Link
                            href="/medications?showForm=true"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                            Add Medication
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {medications.map((medication) => (
                            <div
                                key={medication._id}
                                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{medication.name}</h3>
                                <p className="text-gray-600 mb-2">Dosage: {medication.dosage}</p>
                                <p className="text-gray-600 mb-4">
                                    Next dose: {medication.nextDoseTime ? new Date(medication.nextDoseTime).toLocaleString() : 'Not scheduled'}
                                </p>
                                <div className="flex justify-end space-x-2">
                                    <Link
                                        href={`/medications/${medication._id}`}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}