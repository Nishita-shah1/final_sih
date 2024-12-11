'use client';
import React, { useEffect, useState } from 'react';

const FetchDataPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getData');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Fetched Data</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {data.map((item: any, index: number) => (
          <li key={index}>
            <strong>Username:</strong> {item.username} <br />
            <strong>Date:</strong> {new Date(item.date).toLocaleString()} <br />
            <strong>Data:</strong> {JSON.stringify(item.data)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchDataPage;
