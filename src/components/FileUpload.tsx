import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [sampleData, setSampleData] = useState<Record<string, any>[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/parse-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status === 'success') {
        setHeaders(response.data.headers);
        setSampleData(response.data.sampleData);
        setError(null);
      } else {
        setError('Failed to parse CSV');
      }
    } catch (error) {
      setError('Error uploading file');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload CSV</button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {headers.length > 0 && (
        <div>
          <h3>CSV Headers</h3>
          <ul>
            {headers.map((header, idx) => (
              <li key={idx}>{header}</li>
            ))}
          </ul>

          <h3>Sample Data</h3>
          <pre>{JSON.stringify(sampleData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
