/* eslint-disable */
'use client';
import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import DynamicInsights from "@/components/DynamicInsights";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);


type FilterState = {
  pfz: string;
  fishingDate: string;
  startlatitude: string;
  endlatitude: string;
  startlongitude: string;
  endlongitude: string;
  startdepth: string;
  enddepth: string;
  species: string;
  amount: string;
};



type DataRow = [string, string, string, string, string, string, string];


const Page: React.FC = () => {
  const [csvData, setCsvData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('user123');
  const [sampleData, setSampleData] = useState<DataRow[]>([]); // State to hold sample data
  const [showGraphs, setShowGraphs] = useState<boolean>(false); // New state to toggle graphs



  const [filters, setFilters] = useState<FilterState>({
    pfz: '',
    fishingDate: '',
    startlatitude: '',
    endlatitude: '',
    startlongitude: '',
    endlongitude: '',
    startdepth: '',
    enddepth: '',
    species: '',
    amount: '',
  });

  const loadSampleData = async () => {
    try {
      const response = await fetch('/pfz_new.csv'); // Path to sample CSV in public directory
      const text = await response.text();
      const rows = text
        .split('\n')
        .map((row) => row.split(',').map((cell) => cell.trim())) as DataRow[];
      setSampleData(rows);
      setCsvData(rows);
      setFilteredData(rows);
    } catch (error) {
      setGeneralError('Error loading sample data.');
    }
  };

  



  useEffect(() => {
    const savedData = localStorage.getItem(`csvData_${username}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as DataRow[];
        setCsvData(parsedData);
        setFilteredData(parsedData);
      } catch {
        setGeneralError('An unexpected error occurred while loading saved data.');
      }
    }
  }, [username]);


  useEffect(() => {
    if (csvData.length > 0) {
      localStorage.setItem(`csvData_${username}`, JSON.stringify(csvData));
    }
  }, [csvData, username]);
 
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
  


  const filteredResults = useMemo(() => {
    try {
      return csvData.filter(([pfz, fishingDate, latitude, longitude, depth, species, amount]) => {
        const matchPfz = filters.pfz ? pfz.toLowerCase().includes(filters.pfz.toLowerCase()) : true;
        const matchFishingDate = filters.fishingDate ? fishingDate.includes(filters.fishingDate) : true;
        // const matchLatitude = filters.latitude ? latitude.includes(filters.latitude) : true;
        const matchLatitude =
          (!filters.startlatitude || parseFloat(latitude) >= parseFloat(filters.startlatitude)) &&
          (!filters.endlatitude || parseFloat(latitude) <= parseFloat(filters.endlatitude));
        const matchLongitude =
          (!filters.startlongitude || parseFloat(longitude) >= parseFloat(filters.startlongitude)) &&
          (!filters.endlongitude || parseFloat(longitude) <= parseFloat(filters.endlongitude));
        //const matchLongitude = filters.longitude ? longitude.includes(filters.longitude) : true;
        //const matchDepth = filters.depth ? depth.includes(filters.depth) : true;
        const matchDepth =
        (!filters.startdepth || parseFloat(depth) >= parseFloat(filters.startdepth)) &&
        (!filters.enddepth || parseFloat(depth) <= parseFloat(filters.enddepth));
        const matchSpecies = filters.species ? species.toLowerCase().includes(filters.species.toLowerCase()) : true;
        const matchAmount = filters.amount ? amount.includes(filters.amount) : true;


        return matchPfz && matchFishingDate && matchLatitude && matchLongitude && matchDepth && matchSpecies && matchAmount;
      });
    } catch {
      setGeneralError('An error occurred while filtering data.');
      return [];
    }
  }, [csvData, filters]);


  useEffect(() => {
    setFilteredData(filteredResults);
  }, [filteredResults]);


  const renderFilters = () => {
    const filterFields: { name: keyof FilterState; placeholder: string; type?: string }[] = [
      { name: 'pfz', placeholder: 'PFZ' },
      { name: 'fishingDate', placeholder: 'Fishing Date', type: 'date' },
      { name: 'startlatitude', placeholder: 'Start Latitude' },
      { name: 'endlatitude', placeholder: 'End Latitude' },
      { name: 'startlongitude', placeholder: 'Start Longitude' },
      { name: 'endlongitude', placeholder: 'End Longitude' },
      { name: 'startdepth', placeholder: 'Start Depth' },
      { name: 'enddepth', placeholder: 'End Depth' },
      { name: 'species', placeholder: 'Species' },
      { name: 'amount', placeholder: 'Amount' },
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


  const toggleGraphs = () => {
    setShowGraphs(!showGraphs);
  };


  // Graph data preparation
  const lineChartData = {
    labels: filteredData.map((row) => row[1]), // Using fishingDate as the label
    datasets: [
      {
        label: 'Amount of Fish Caught',
        data: filteredData.map((row) => parseInt(row[6], 10)), // Using amount as data
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };





  const fish_vs_lat = {
    labels: filteredData.map((row) => row[5]), // Using fish name as the label
    datasets: [
      {
        label: 'Fish name vs latitude',
        data: filteredData.map((row) => parseInt(row[3], 10)), // Using amount as data
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };
  const fish_vs_long = {
    labels: filteredData.map((row) => row[5]), // Using fish name as the label
    datasets: [
      {
        label: 'Fish name vs latitude',
        data: filteredData.map((row) => parseInt(row[2], 10)), // Using amount as data
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8 flex">
      <aside className="w-1/4 bg-white shadow p-4 rounded-lg sticky top-8 h-fit">
      <h2 className="text-lg font-bold mb-4">Filters</h2>
  {renderFilters()}
</aside>


      <main className="flex-1 ml-8">
        <h1 className="text-2xl font-bold mb-4">Fish Catch Data</h1>
        <div className="mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="border p-2 mb-2"
          />
          <button
        onClick={loadSampleData}
        className="bg-green-500 text-white py-2 px-4 rounded-md mb-4"
      >
        Show Sample Data
      </button>
        </div>


        {generalError && <div className="text-red-500">{generalError}</div>}


        <div className="mb-4">
          <button
            onClick={toggleGraphs}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {showGraphs ? 'Hide Graphs' : 'Show Graphs'}
          </button>
        </div>


        {showGraphs && (
  <div className="mb-4">
    {/* Line Chart - Total Catch Weight */}
    <DynamicInsights
      title="Total Catch Weight Over Time"
      graphType="line"
      data={lineChartData}
      calculateInsights={() => {
        const totalWeight = filteredData.reduce((sum, row) => {
          const weight = parseFloat(row[6]);
          return !isNaN(weight) ? sum + weight : sum;
        }, 0);
     
        // Validate and extract years from the fishingDate column
        const years = filteredData
          .map((row) => {
            const date = row[1]; // fishingDate
            return date && date.includes('-') ? date.split("-")[0] : null; // Extract the year
          })
          .filter((year) => year && !isNaN(parseInt(year, 10))) // Filter valid years
          .map((year) => parseInt(year, 10)); // Convert to numbers for range calculation
     
       
     
        return [
          `Total catch weight: ${totalWeight.toFixed(2)} kg`,
          `Data points analyzed: ${filteredData.length}`,
        ];
      }}
     
     
    />

<DynamicInsights
  title="Fish Species vs Latitude"
  graphType="line"
  data={fish_vs_lat }// Example for extracting dataset values
  calculateInsights={() => {
    const latitudes = filteredData
      .map((row) => parseFloat(row[3]))
      .filter((lat) => !isNaN(lat)); // Filter out invalid latitudes

    const latRange = latitudes.length > 0
      ? `${Math.min(...latitudes).toFixed(2)} - ${Math.max(...latitudes).toFixed(2)}`
      : 'N/A'; // Compute range only if there are valid latitudes

    const uniqueSpecies = new Set(filteredData.map((row) => row[5])).size;

    return [
      `Latitude range: ${latRange}`,
      `Number of unique species: ${uniqueSpecies}`,
    ];
  }}
/>



    {/* Line Chart - Species vs Longitude */}
    <DynamicInsights
      title="Fish Species vs Longitude"
      graphType="line"
      data={fish_vs_long}
      calculateInsights={() => {
        // Extract and validate longitudes
        const longitudes = filteredData
          .filter((row) => row[2] && !isNaN(parseFloat(row[3]))) // Validate longitude
          .map((row) => parseFloat(row[2])); // Parse valid longitudes
     
        // Compute longitude range
        const longRange = longitudes.length > 0
          ? `${Math.min(...longitudes).toFixed(2)} - ${Math.max(...longitudes).toFixed(2)}`
          : "N/A";
     
        // Count unique species
        const uniqueSpecies = new Set(filteredData.map((row) => row[5])).size;
     
        return [
          `Longitude range: ${longRange}`,
          `Number of unique species: ${uniqueSpecies}`,
        ];
      }}
     
    />
    

  
      
  </div>
)}






        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border">PFZ</th>
                <th className="px-4 py-2 border">Fishing Date</th>
                <th className="px-4 py-2 border">Latitude</th>
                <th className="px-4 py-2 border">Longitude</th>
                <th className="px-4 py-2 border">Depth</th>
                <th className="px-4 py-2 border">Species</th>
                <th className="px-4 py-2 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{row[0]}</td>
                    <td className="px-4 py-2 border">{row[1]}</td>
                    <td className="px-4 py-2 border">{row[2]}</td>
                    <td className="px-4 py-2 border">{row[3]}</td>
                    <td className="px-4 py-2 border">{row[4]}</td>
                    <td className="px-4 py-2 border">{row[5]}</td>
                    <td className="px-4 py-2 border">{row[6]}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center px-4 py-2 border">
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
export default Page;