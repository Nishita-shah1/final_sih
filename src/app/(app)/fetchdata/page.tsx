'use client';

import React, { useEffect, useState } from 'react';

interface DataRow {
  pfz: string;
  fishingDate: string;
  latitude: string;
  longitude: string;
  depth: string;
  species: string;
  amount: string;
}

const Page: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getData'); // Change this to the actual API route path
        const result = await response.json();
        
        // Assuming the data is inside the 'data' key
        setData(result.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Fishing Data Table</h1>
      <table >
        <thead>
          <tr>
            <th>PFZ</th>
            <th>Fishing Date</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Depth</th>
            <th>Species</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.pfz}</td>
              <td>{row.fishingDate}</td>
              <td>{row.latitude}</td>
              <td>{row.longitude}</td>
              <td>{row.depth}</td>
              <td>{row.species}</td>
              <td>{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
