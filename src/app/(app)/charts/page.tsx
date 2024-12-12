// Use client directive at the top to mark this component as a Client Component
'use client';

import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';

type FilterState = {
  fishName: string;
  date: string;
  startLongitude: string;
  endLongitude: string;
  startLatitude: string;
  endLatitude: string;
  village: string;
};

type DataRow = [string, string, string, string, string, string, string]; // Adjusted for data structure

const Page: React.FC = () => {
  const [csvData, setCsvData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    fishName: '',
    date: '',
    startLongitude: '',
    endLongitude: '',
    startLatitude: '',
    endLatitude: '',
    village: '',
  });

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

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text
          .split('\n')
          .map((row) => row.split(',').map((cell) => cell.trim())) as DataRow[];
        setCsvData(rows);
        setFilteredData(rows);
        setErrorMessage('');
      } catch {
        setGeneralError('Error parsing CSV data.');
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setIsLoading(false);
      setGeneralError('Error reading the file.');
    };
    reader.readAsText(file);
  };

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const renderFilters = () => {
    const filterFields: { name: keyof FilterState; placeholder: string; type?: string }[] = [
      { name: 'fishName', placeholder: 'Fish Name' },
      { name: 'date', placeholder: 'Date', type: 'date' },
      { name: 'startLongitude', placeholder: 'Start Longitude' },
      { name: 'endLongitude', placeholder: 'End Longitude' },
      { name: 'startLatitude', placeholder: 'Start Latitude' },
      { name: 'endLatitude', placeholder: 'End Latitude' },
      { name: 'village', placeholder: 'Village' },
    ];

    return filterFields.map(({ name, placeholder, type = 'text' }) => (
      <input
        key={name}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={handleFilterChange}
        className="border p-2 mb-2 w-full rounded-md"
      />
    ));
  };

  const clearFilters = () => {
    setFilters({
      fishName: '',
      date: '',
      startLongitude: '',
      endLongitude: '',
      startLatitude: '',
      endLatitude: '',
      village: '',
    });
  };

  // ... Effects and Functions (remained unchanged for brevity)

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex">
      <aside className="w-1/4 bg-white shadow p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Filters</h2>
        {renderFilters()}
        <button onClick={clearFilters} className="bg-red-500 text-white px-4 py-2 rounded w-full">
          Clear Filters
        </button>
      </aside>

      <main className="flex-1 ml-8">
        <h1 className="text-2xl font-bold mb-4">Fish Catch Data</h1>
        <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>pfs</th>
              <th>date</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>depth</th>
              <th>species name</th>
              <th>amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                {row.map((cell) => (
                  <td>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Page;