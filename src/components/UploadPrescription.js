'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function UploadPrescription({ onUploadComplete }) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target);
      const file = formData.get('file');

      if (!file) {
        throw new Error('Please select a file');
      }

      if (!title.trim()) {
        throw new Error('Please enter a title');
      }

      // Upload to Cloudinary
      const cloudinaryData = new FormData();
      cloudinaryData.append('file', file);
      cloudinaryData.append('upload_preset', 'prescriptions');

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: cloudinaryData,
        }
      );

      const cloudinaryResult = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Save prescription to database
      const prescriptionData = {
        title: title.trim(),
        fileUrl: cloudinaryResult.secure_url,
        fileType: file.type,
      };

      const saveResponse = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionData),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save prescription');
      }

      toast.success('Prescription uploaded successfully');
      setTitle('');
      e.target.reset();
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload prescription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Prescription Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter prescription title"
          required
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Upload File
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".pdf,image/jpeg,image/png"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Accepted formats: PDF, JPEG, PNG
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Uploading...' : 'Upload Prescription'}
      </button>
    </form>
  );
}