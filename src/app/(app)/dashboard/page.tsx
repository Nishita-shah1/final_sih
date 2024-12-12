'use client';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DataRow = [
  string, // pfz
  string, // date
  string, // lat
  string, // long
  string, // depth
  string, // major species
  string // amount
];

const Page: React.FC = () => {
  const [fishData, setFishData] = useState<DataRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [username, setUsername] = useState<string>(''); // Username state

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getData');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const { data } = await response.json();
        setFishData(data);
      } catch (error) {
        setErrorMessage('Error fetching data');
      }
    };

    fetchData();
  }, []);

  // Prepare chart data based on the fetched fish data
  const prepareChartData = () => {
    const labels: string[] = [];
    const amounts: number[] = [];

    fishData.forEach((row) => {
      labels.push(row[1]); // Date column
      amounts.push(parseInt(row[6])); // Amount column
    });

    return {
      labels,
      datasets: [
        {
          label: 'Fish Amounts Over Time',
          data: amounts,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
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
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}

          {fishData.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold mb-4">Catch Chart</h2>
              <Line data={prepareChartData()} />
            </div>
          ) : (
            <p>No data available for the chart.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
