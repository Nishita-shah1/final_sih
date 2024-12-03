'use client';

import React, { useState } from 'react';

// Sample Fish Data (replace with actual data from Google images)
const fishData = [
  { name: 'Salmon', image: 'https://via.placeholder.com/150', type: 'Freshwater' },
  { name: 'Trout', image: 'https://via.placeholder.com/150', type: 'Freshwater' },
  { name: 'Goldfish', image: 'https://via.placeholder.com/150', type: 'Freshwater' },
  { name: 'Tuna', image: 'https://via.placeholder.com/150', type: 'Saltwater' },
  { name: 'Shark', image: 'https://via.placeholder.com/150', type: 'Saltwater' },
  { name: 'Mahi-Mahi', image: 'https://via.placeholder.com/150', type: 'Saltwater' },
];

export default function Gallery() {
  const [filter, setFilter] = useState('All');

  // Filtered Fish Data based on the selected filter
  const filteredFish = filter === 'All' ? fishData : fishData.filter(fish => fish.type === filter);

  return (
    <div className="container mx-auto p-6">
      {/* Filter Options */}
      <div className="mb-6 flex justify-center space-x-6">
        <button
          onClick={() => setFilter('All')}
          className={`px-4 py-2 rounded ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('Freshwater')}
          className={`px-4 py-2 rounded ${filter === 'Freshwater' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Freshwater
        </button>
        <button
          onClick={() => setFilter('Saltwater')}
          className={`px-4 py-2 rounded ${filter === 'Saltwater' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Saltwater
        </button>
      </div>

      {/* Fish Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFish.map((fish, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={fish.image} alt={fish.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-center">{fish.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
