// Filters.tsx

import React, { ChangeEvent } from 'react';

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

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: () => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, onClearFilters }) => {
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

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Filters</h2>
      {filterFields.map(({ name, placeholder, type = 'text' }) => (
        <input
          key={name}
          name={name}
          type={type}
          value={filters[name]}
          placeholder={placeholder}
          onChange={onFilterChange}
          className="border p-2 mb-2 w-full rounded-md"
        />
      ))}
      <button onClick={onClearFilters} className="mt-4 text-sm text-blue-500">
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;
