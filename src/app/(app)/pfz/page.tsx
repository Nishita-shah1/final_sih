'use client';
import React, { useState, ChangeEvent } from 'react';

type DataRow = [
  string, // pfz
  string, // date
  string, // lat
  string, // long
  string, // depth
  string, // major species
  string // ammount
 
];

const Page: React.FC = () => {
  const [csvData, setCsvData] = useState<DataRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [username, setUsername] = useState<string>(''); // Username state

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setErrorMessage('Please select a file.');
      return;
    }
    if (!file.name.endsWith('.csv')) {
      setErrorMessage('Please upload a valid CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text
          .split('\n')
          .map((row) => row.split(',').map((cell) => cell.trim())) as DataRow[];
        setCsvData(rows);
        setErrorMessage('');
      } catch {
        setErrorMessage('Error parsing CSV data.');
      }
    };
    reader.onerror = () => {
      setErrorMessage('Error reading the file.');
    };
    reader.readAsText(file);
  };

  const saveDataToDatabase = async () => {
    if (!username || csvData.length === 0) {
      setErrorMessage('Please provide a username and upload data.');
      return;
    }

    try {
      const response = await fetch('/api/saveData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          data: csvData.map(row => ({
            pfz: row[0],
            fishingDate: row[1],
            latitude: row[2],
            longitude: row[3],
            depth: row[4],
            species: row[5],
            amount: row[6],
           
            
          })),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Data saved successfully!');
        setCsvData([]); // Optionally reset CSV data after saving
        setUsername(''); // Optionally reset username
      } else {
        setErrorMessage(result.message || 'Failed to save data');
      }
    } catch (error) {
      setErrorMessage('An error occurred while saving the data.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex">
      <aside className="w-1/4 bg-white shadow p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Filters</h2>
        {/* Add an input for username */}
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-4 w-full rounded-md"
        />
      </aside>

      <main className="flex-1 ml-8">
        <h1 className="text-2xl font-bold mb-4">Fish Catch Data</h1>
        <div className="mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mb-4"
          />
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}

          <button
            onClick={saveDataToDatabase}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Data to Database
          </button>
        </div>
      </main>
    </div>
  );
};

export default Page;