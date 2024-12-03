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
    const savedData = localStorage.getItem('csvData');
    if (savedData) {
      const parsedData = JSON.parse(savedData) as DataRow[];
      setCsvData(parsedData);
      setFilteredData(parsedData);
    }
  }, []);

  useEffect(() => {
    if (csvData.length > 0) {
      localStorage.setItem('csvData', JSON.stringify(csvData));
    }
  }, [csvData]);

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
      const text = e.target?.result as string;
      const rows = text
        .split('\n')
        .map((row) => row.split(',').map((cell) => cell.trim())) as DataRow[];
      setCsvData(rows);
      setFilteredData(rows);
      setErrorMessage('');
      setIsLoading(false);
    };
    reader.onerror = () => {
      setErrorMessage('Error reading file.');
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  const loadSampleData = () => {
    setCsvData(sampleData);
    setFilteredData(sampleData);
    setErrorMessage('');
  };

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredResults = useMemo(() => {
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
        className="border p-2 mb-2 w-full"
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex">
      <aside className="w-1/4 bg-white shadow p-4">
        <h2 className="text-lg font-bold mb-4">Filters</h2>
        {renderFilters()}
      </aside>

      <main className="w-3/4 px-4">
        <div className="flex items-center mb-4">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="mr-4" />
          <button onClick={loadSampleData} className="bg-blue-500 text-white px-4 py-2">
            Use Sample Data
          </button>
        </div>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        {isLoading ? (
          <p>Loading...</p>
        ) : filteredData.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
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
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results found. Try adjusting your filters.</p>
        )}
      </main>
    </div>
  );
};

export default Page;
