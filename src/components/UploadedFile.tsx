'use client';

import React, { useState } from 'react';

export const UploadFile: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null); // Clear error when a file is selected
      setSuccessMessage(null); // Clear any success message
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setLoading(true);
    setError(null); // Reset any previous errors
    setSuccessMessage(null); // Reset success message

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text(); // Get the response as plain text
      console.log('Raw response:', responseText); // Log the raw response for debugging

      if (response.ok) {
        // Only attempt to parse JSON if responseText is not empty
        const responseData = responseText ? JSON.parse(responseText) : {};
        setSuccessMessage('File uploaded successfully!');
      } else {
        const errorData = responseText || 'Unknown error';
        setError(`Error: ${errorData}`);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('An error occurred during the upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Uploading...' : 'Upload CSV'}
      </button>
    </div>
  );
};
