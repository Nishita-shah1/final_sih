'use client';

import React, { useState, ChangeEvent } from 'react';

type DataRow = {
  Longitude: string;
  Latitude: string;
  Village: string;
  ReportingDate: string;
  [key: string]: string; // For dynamically handling fish categories
};

const Page: React.FC = () => {
  const [jsonData, setJsonData] = useState<DataRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setErrorMessage('Please select a file.');
      return;
    }

    if (!file.name.endsWith('.json')) {
      setErrorMessage('Please upload a valid JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsedData: DataRow[] = JSON.parse(text);
        setJsonData(parsedData);
        setErrorMessage('');
      } catch {
        setErrorMessage('Error parsing JSON data.');
      }
    };

    reader.onerror = () => {
      setErrorMessage('Error reading the file.');
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex">
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Village Fish Catch Data</h1>

        <div className="mb-4">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="mb-4"
          />
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </div>

        {/* Render the table with JSON data */}
        {jsonData.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Longitude</th>
                  <th className="border px-4 py-2">Latitude</th>
                  <th className="border px-4 py-2">Village</th>
                  <th className="border px-4 py-2">Reporting Date</th>
                  {/* Dynamically render headers for fish categories */}
                  {Object.keys(jsonData[0])
                    .filter(
                      (key) => !['Longitude', 'Latitude', 'Village', 'Reporting Date'].includes(key)
                    )
                    .map((key) => (
                      <th key={key} className="border px-4 py-2">
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {jsonData.map((row, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{row.Longitude}</td>
                    <td className="border px-4 py-2">{row.Latitude}</td>
                    <td className="border px-4 py-2">{row.Village}</td>
                    <td className="border px-4 py-2">{row.ReportingDate}</td>
                    {Object.keys(row)
                      .filter(
                        (key) => !['Longitude', 'Latitude', 'Village', 'Reporting Date'].includes(key)
                      )
                      .map((key) => (
                        <td key={key} className="border px-4 py-2">
                          {row[key]}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
