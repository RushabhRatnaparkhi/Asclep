'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  async function fetchPrescriptions() {
    try {
      const response = await fetch('/api/prescriptions', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch prescriptions');
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);

    try {
      const response = await fetch('/api/prescriptions/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Upload failed');
      
      toast.success('Prescription uploaded successfully');
      fetchPrescriptions(); // Refresh the list
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload prescription');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset file input
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <label className="relative cursor-pointer">
            <input
              type="file"
              className="sr-only"
              onChange={handleUpload}
              disabled={isUploading}
              accept="*/*"
            />
            <span className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
              {isUploading ? 'Uploading...' : 'Upload Prescription'}
            </span>
          </label>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No prescriptions uploaded yet</h3>
            <p className="text-gray-600">Upload your first prescription to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((prescription) => (
              <div key={prescription._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <p className="text-lg font-medium text-gray-900 mb-2">{prescription.filename}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Uploaded on {new Date(prescription.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-end space-x-2">
                  <a
                    href={prescription.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}