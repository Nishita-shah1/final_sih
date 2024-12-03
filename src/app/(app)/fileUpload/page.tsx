'use client';

import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';

type FilterState = {
  fishName: string;
  scientificName: string;
  startDate: string;
  endDate: string;
  startLongitude: string;
  endLongitude: string;
  startLatitude: string;
  endLatitude: string;
  startDepth: string;
  endDepth: string;
};

type DataRow = [string, string, string, string, string, string];

const sampleData: DataRow[] = [
  ['Tilapia', 'Oreochromis niloticus', '2024-02-14', '28.3', '74.485182', '9.419313'],
  ['Pomfret', 'Pampus argenteus', '2024-06-06', '78.47', '73.044818', '9.237499'],
  ['Hilsa', 'Tenualosa ilisha', '2024-09-02', '70.28', '86.148747', '9.352826'],
  ['Pomfret', 'Pampus argenteus', '2024-10-15', '55.91', '96.712525', '29.450134'],
  ['Catla', 'Catla catla', '2024-04-29', '6.58', '81.915818', '32.465435'],
  ['Barramundi', 'Lates calcarifer', '2024-06-30', '28.0', '69.665409', '12.137997'],
  ['Seer Fish', 'Scomberomorus guttatus', '2024-07-18', '15.47', '76.439121', '18.40571'],
];

const Page: React.FC = () => {
  const [csvData, setCsvData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    fishName: '',
    scientificName: '',
    startDate: '',
    endDate: '',
    startLongitude: '',
    endLongitude: '',
    startLatitude: '',
    endLatitude: '',
    startDepth: '',
    endDepth: '',
  });

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('csvData');
      if (savedData) {
        const parsedData = JSON.parse(savedData) as DataRow[];
        setCsvData(parsedData);
        setFilteredData(parsedData);
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please reload it.');
      console.error(error);
    }
  }, []);

  useEffect(() => {
    try {
      if (csvData.length > 0) {
        localStorage.setItem('csvData', JSON.stringify(csvData));
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please reload it.');
      console.error(error);
    }
  }, [csvData]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    try {
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
        } catch (error) {
          setGeneralError('Error parsing CSV data. Please reload it.');
        }
        setIsLoading(false);
      };
      reader.onerror = () => {
        setIsLoading(false);
        setGeneralError('Error reading the file. Please reload it.');
      };
      reader.readAsText(file);
    } catch (error) {
      setIsLoading(false);
      setGeneralError('An unexpected error occurred. Please reload it.');
      console.error('Error occurred during file upload:', error);
    }
  };

  const loadSampleData = () => {
    try {
      setCsvData(sampleData);
      setFilteredData(sampleData);
      setErrorMessage('');
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please reload it.');
    }
  };

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      fishName: '',
      scientificName: '',
      startDate: '',
      endDate: '',
      startLongitude: '',
      endLongitude: '',
      startLatitude: '',
      endLatitude: '',
      startDepth: '',
      endDepth: '',
    });
  };

  const filteredResults = useMemo(() => {
    try {
      return csvData.filter(([fishName, scientificName, date, depth, longitude, latitude]) => {
        const matchFishName = filters.fishName
          ? fishName.toLowerCase().includes(filters.fishName.toLowerCase())
          : true;

        const matchScientificName = filters.scientificName
          ? scientificName.toLowerCase().includes(filters.scientificName.toLowerCase())
          : true;

        const matchDate =
          (!filters.startDate || date >= filters.startDate) &&
          (!filters.endDate || date <= filters.endDate);

        const matchLongitude =
          (!filters.startLongitude || parseFloat(longitude) >= parseFloat(filters.startLongitude)) &&
          (!filters.endLongitude || parseFloat(longitude) <= parseFloat(filters.endLongitude));

        const matchLatitude =
          (!filters.startLatitude || parseFloat(latitude) >= parseFloat(filters.startLatitude)) &&
          (!filters.endLatitude || parseFloat(latitude) <= parseFloat(filters.endLatitude));

        const matchDepth =
          (!filters.startDepth || parseFloat(depth) >= parseFloat(filters.startDepth)) &&
          (!filters.endDepth || parseFloat(depth) <= parseFloat(filters.endDepth));

        return (
          matchFishName &&
          matchScientificName &&
          matchDate &&
          matchLongitude &&
          matchLatitude &&
          matchDepth
        );
      });
    } catch (error) {
      setGeneralError('An error occurred while filtering data. Please reload it.');
      console.error(error);
      return [];
    }
  }, [csvData, filters]);

  useEffect(() => {
    setFilteredData(filteredResults);
  }, [filteredResults]);

  const renderFilters = () => {
    const filterFields: { name: keyof FilterState; placeholder: string; type?: string }[] = [
      { name: 'fishName', placeholder: 'Fish Name' },
      { name: 'scientificName', placeholder: 'Scientific Name' },
      { name: 'startDate', placeholder: 'Start Date', type: 'date' },
      { name: 'endDate', placeholder: 'End Date', type: 'date' },
      { name: 'startLongitude', placeholder: 'Start Longitude' },
      { name: 'endLongitude', placeholder: 'End Longitude' },
      { name: 'startLatitude', placeholder: 'Start Latitude' },
      { name: 'endLatitude', placeholder: 'End Latitude' },
      { name: 'startDepth', placeholder: 'Start Depth' },
      { name: 'endDepth', placeholder: 'End Depth' },
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

  // Function to download the filtered data as a CSV file
  const downloadCSV = () => {
    try {
      const csvContent = filteredData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'filtered_data.csv';
      link.click();
    } catch (error) {
      setGeneralError('An unexpected error occurred while downloading the file. Please reload it.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex">
      <aside className="w-1/4 bg-white shadow p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Filters</h2>
        {renderFilters()}
        <button onClick={clearFilters} className="bg-red-500 text-white px-4 py-2 rounded w-full">
          Clear Filters
        </button>
        <div className="mt-4">
          <button
            onClick={loadSampleData}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Load Sample Data
          </button>
        </div>
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
          {isLoading && <div>Loading...</div>}
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          {generalError && <div className="text-red-500">{generalError}</div>}
          <button onClick={downloadCSV} className="bg-green-500 text-white px-4 py-2 rounded">
            Download Filtered Data (CSV)
          </button>
        </div>
        <table className="table-auto w-full mt-4 border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Fish Name</th>
              <th className="border p-2">Scientific Name</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Depth</th>
              <th className="border p-2">Longitude</th>
              <th className="border p-2">Latitude</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">No data available</td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, idx) => (
                    <td key={idx} className="border p-2">{cell}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Page;
