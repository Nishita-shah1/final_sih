import React, { useState } from 'react';

const UploadFile: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      // Replace with your upload API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadSuccess(true);
        alert('File uploaded successfully');
      } else {
        alert('Error uploading file');
      }
    } catch {
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>

      {uploadSuccess && (
        <div className="mt-4 text-green-500">File uploaded successfully!</div>
      )}
    </div>
  );
};

export default UploadFile;
