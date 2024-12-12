/* eslint-disable */
'use client';
import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// Define a more flexible type for the data row
type DataRow = {
  [key: string]: string | number;
};

// Define filter state to be more dynamic
type FilterState = {
  [key: string]: string;
};

const VillageFishingDataPage: React.FC = () => {
  const [csvData, setCsvData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showGraphs, setShowGraphs] = useState<boolean>(false);
  const [expandFilters, setExpandFilters] = useState<boolean>(true);

  // Comprehensive list of columns for filtering
  const allColumns = [
    'Longitude', 'Latitude', 'Village', 'Reporting Date', 
    'elasmobranchs', 'eels', 'cat.fish', 'dorab', 'oil.sardine', 
    'lesser.sardines', 'hilsa', 'other.hilsa', 'anchovies', 
    'other.anchovies', 'other.clupeids', 'bombay.duck', 
    'lizard.fish', 'ghar.fish', 'flying.fish', 'nemipterids', 
    'goat.fishes', 'polynemids', 'croakers', 'ribbon.fish', 
    'trevally.carangid', 'queen.fish.carangid', 'pompano.carangid', 
    'other.carangids', 'dolphin.fish.carangid', 
    'rainbowrunner.carangid', 'leiognathus', 'pony.fish', 
    'falsetrevally.lactariidae', 'pomfrets', 'indian.mackerel', 
    'seer.fish', 'other.tuna', 'barracuda', 'mullet', 
    'bregmaceros', 'flat.fish', 'penaeid.prawn', 
    'non.penaeid.prawn', 'lobsters', 'crabs', 'mantis.shrimp', 
    'cephalopods', 'miscellaneous'
  ];

  // Dynamic filters based on columns
  const [filters, setFilters] = useState<FilterState>(
    allColumns.reduce((acc, col) => ({ ...acc, [col]: '' }), {})
  );

  // Parse CSV file
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
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        
        const rows = lines.slice(1).map(line => {
          const values = line.split(',').map(value => value.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = isNaN(Number(values[index])) ? values[index] : Number(values[index]);
            return obj;
          }, {} as DataRow);
        });

        setCsvData(rows);
        setFilteredData(rows);
        setErrorMessage('');
      } catch (error) {
        console.error(error);
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

  // Dynamic filter handling
  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Dynamic filtering logic
  const filteredResults = useMemo(() => {
    try {
      return csvData.filter(row => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true; // If no filter, include all
          const rowValue = row[key];
          
          // Handle different types of filtering
          if (typeof rowValue === 'string') {
            return rowValue.toLowerCase().includes(value.toLowerCase());
          }
          if (typeof rowValue === 'number') {
            return rowValue.toString().includes(value);
          }
          return true;
        });
      });
    } catch {
      setGeneralError('An error occurred while filtering data.');
      return [];
    }
  }, [csvData, filters]);

  useEffect(() => {
    setFilteredData(filteredResults);
  }, [filteredResults]);

  // Dynamically render filter inputs
  const renderFilters = () => {
    return Object.keys(filters).map(key => (
      <div key={key} className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
        <input
          name={key}
          type="text"
          placeholder={`Filter by ${key}`}
          onChange={handleFilterChange}
          className="border p-2 w-full rounded-md"
        />
      </div>
    ));
  };

  // Prepare species columns (excluding metadata columns)
  const speciesColumns = useMemo(() => {
    return allColumns.filter(col => 
      !['Longitude', 'Latitude', 'Village', 'Reporting Date'].includes(col)
    );
  }, [csvData]);

  // Pie chart for species distribution
  const speciesDistributionData = {
    labels: speciesColumns,
    datasets: [{
      label: 'Species Distribution',
      data: speciesColumns.map(species => 
        filteredData.reduce((sum, row) => sum + (row[species] as number), 0)
      ),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#FF6384', '#C9CB3F'
      ],
      hoverOffset: 4
    }]
  };

  // Line chart for total catch over time
  const totalCatchOverTimeData = {
    labels: [...new Set(filteredData.map(row => row['Reporting Date']))],
    datasets: [{
      label: 'Total Catch',
      data: [...new Set(filteredData.map(row => row['Reporting Date']))].map(date => 
        filteredData
          .filter(row => row['Reporting Date'] === date)
          .reduce((sum, row) => {
            return sum + speciesColumns.reduce((speciesSum, species) => 
              speciesSum + (row[species] as number), 0);
          }, 0)
      ),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex">
      <aside className={`
        ${expandFilters ? 'w-1/3' : 'w-16'} 
        bg-white shadow p-4 rounded-lg sticky top-8 
        transition-all duration-300 ease-in-out
      `}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {expandFilters ? 'Filters' : ''}
          </h2>
          <button 
            onClick={() => setExpandFilters(!expandFilters)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            {expandFilters ? '←' : '→'}
          </button>
        </div>

        {expandFilters && (
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            {renderFilters()}
          </div>
        )}
      </aside>

      <main className="flex-1 ml-8">
        <h1 className="text-2xl font-bold mb-4">Village Fishing Data</h1>
        
        <div className="mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="border p-2 mb-2"
          />
        </div>

        {generalError && <div className="text-red-500">{generalError}</div>}

        <div className="mb-4">
          <button
            onClick={() => setShowGraphs(!showGraphs)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {showGraphs ? 'Hide Graphs' : 'Show Graphs'}
          </button>
        </div>

        {showGraphs && (
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Species Distribution</h3>
              <Pie data={speciesDistributionData} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Total Catch Over Time</h3>
              <Line data={totalCatchOverTimeData} />
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                {Object.keys(filters).map(key => (
                  <th key={key} className="px-4 py-2 border">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr key={index}>
                    {Object.keys(filters).map(key => (
                      <td key={key} className="px-4 py-2 border">{row[key]}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Object.keys(filters).length} className="text-center px-4 py-2 border">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default VillageFishingDataPage;