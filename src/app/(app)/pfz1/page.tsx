/* eslint-disable */

//pfz1
'use client';

import React, { useEffect, useState } from 'react';

const FetchDataPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]); // All data fetched from the API
  const [filteredData, setFilteredData] = useState<any[]>([]); // Data after applying filters
  const [error, setError] = useState<string | null>(null);

  // Predefined filters for specific fields
  const [filters, setFilters] = useState({
    pfz_or_non_pfz: '',
    fishing_date: '',
    latitude: '',
    longitude: '',
    depth: '',
    major_species: ''
  });

  useEffect(() => {
    // Fetch data on component mount
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getData');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result.data);
        setFilteredData(result.data); // Initialize filtered data to all data
      } catch (error) {
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  // Function to handle filter inputs
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Function to apply filters
  const applyFilters = () => {
    const filtered = data.filter((item) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key];
        if (!filterValue) return true; // If no filter value, no filtering applied
        const itemValue = item[key];
        if (itemValue && typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(filterValue.toLowerCase());
        } else if (itemValue && typeof itemValue === 'number') {
          return itemValue === Number(filterValue);
        }
        return false;
      });
    });

    setFilteredData(filtered);
  };

  return (
    <div className="flex">
      {/* Left Sidebar for Filters */}
      <div className="w-1/4 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Filters</h2>

        <label className="block mb-2">
          PFZ or Non-PFZ:
          <input
            type="text"
            name="pfz_or_non_pfz"
            className="border w-full p-2"
            value={filters.pfz_or_non_pfz}
            onChange={handleFilterChange}
          />
        </label>

        <label className="block mb-2">
          Fishing Date:
          <input
            type="date"
            name="fishing_date"
            className="border w-full p-2"
            value={filters.fishing_date}
            onChange={handleFilterChange}
          />
        </label>

        <label className="block mb-2">
          Latitude:
          <input
            type="text"
            name="latitude"
            className="border w-full p-2"
            value={filters.latitude}
            onChange={handleFilterChange}
          />
        </label>

        <label className="block mb-2">
          Longitude:
          <input
            type="text"
            name="longitude"
            className="border w-full p-2"
            value={filters.longitude}
            onChange={handleFilterChange}
          />
        </label>

        <label className="block mb-2">
          Depth:
          <input
            type="text"
            name="depth"
            className="border w-full p-2"
            value={filters.depth}
            onChange={handleFilterChange}
          />
        </label>

        <label className="block mb-2">
          Major Species:
          <input
            type="text"
            name="major_species"
            className="border w-full p-2"
            value={filters.major_species}
            onChange={handleFilterChange}
          />
        </label>

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>

      {/* Right Section for Data Display */}
      <div className="w-3/4 p-4">
        <h1 className="text-lg font-bold mb-4">Filtered Data</h1>

        {error && <p className="text-red-500">{error}</p>}

        {filteredData.length === 0 ? (
          <p>No data matches the filters.</p>
        ) : (
          <ul>
            {filteredData.map((item, index) => (
              <li key={index} className="mb-4 border-b pb-2">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {JSON.stringify(value)}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FetchDataPage;