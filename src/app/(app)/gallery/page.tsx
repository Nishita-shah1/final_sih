//gallery  page
'use client';

import React, { useState } from 'react';

// Sample Fish Data (replace with actual data from your database)
const fishData = [
  { name: 'Salmon', image: 'https://t3.ftcdn.net/jpg/00/56/24/26/360_F_56242669_ZAzbHYnWEWr8YEle6Za4vExbHAmaioF7.jpg', type: 'Freshwater', scientificName: 'Salmo salar' },
  { name: 'Trout', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Salmo_trutta.jpg/640px-Salmo_trutta.jpg', type: 'Freshwater', scientificName: 'Carassius auratus' },
  { name: 'Catfish', image: 'https://www.seafoodwatch.org/globalassets/sfw/images/super-green-list/06---catfish/image20240725125740.png', type: 'Freshwater', scientificName: 'Ictalurus punctatus' },
  { name: 'Guppies', image: 'https://www.thesprucepets.com/thmb/_yqn-8PfrWQkDEtekhdU3oinBg8=/6479x0/filters:no_upscale():strip_icc()/guppy-fish-species-profile-5078901-hero-9095fa292246421b820d32d4731c991b.jpg', type: 'Freshwater', scientificName: 'Poecilia reticulata' },
  { name: 'Angelfish', image: 'https://www.cloningaquapets.com/cdn/shop/files/Angel_Fish_Platinum_white_2.png?v=1728742694&width=640', type: 'Freshwater', scientificName: 'Pterophyllum scalare' },
  { name: 'Striped Bass', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRElguX6JxBPg9zDRTGYHjFDrUFMnMi8dpOUARynd9fyiStoLh2KIcr20x5TjPumQojTFrtN-e79dFXCNWitDs0E6376d75cZ_R6MZD7bA', type: 'Saltwater', scientificName: 'Morone saxatilis' },
  { name: 'Redfish', image: 'https://www.anglersjournal.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTY1MzU2ODM2Mjg1ODUxMDQx/prm-redfish.jpg', type: 'Saltwater', scientificName: 'Sciaenops ocellatus' },
  { name: 'Bluefish', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfEufRrhSnqgSg4ATXG6hDC-E5FlpYUzZ6xg&s', type: 'Saltwater', scientificName: 'Pomatomus saltatrix' },
  { name: 'Yellow Tang', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3gnmAxKO1vVpCOKGs4GeACYzE6_xrBwthdQ&s', type: 'Saltwater', scientificName: 'Zebrasoma flavescens' },
  { name: 'King Salmon', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPNS48jdEEnrzOz86_Eu47yOkiYQ2TBSohqQ&s', type: 'Saltwater', scientificName: 'Oncorhynchus tshawytscha' },
];

export default function Gallery() {
  const [filters, setFilters] = useState({
    fishName: '',
    type: '',
    scientificName: '',
  });

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Filtered Fish Data based on filters
  const filteredFish = fishData.filter((fish) => {
    const matchFishName = filters.fishName ? fish.name.toLowerCase().includes(filters.fishName.toLowerCase()) : true;
    const matchScientificName = filters.scientificName ? fish.scientificName.toLowerCase().includes(filters.scientificName.toLowerCase()) : true;
    const matchType = filters.type ? fish.type === filters.type : true;
    return matchFishName && matchScientificName && matchType;
  });

  return (
    <div className="container mx-auto p-6">
      {/* Filters */}
      <div className="mb-6 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fish Name</label>
            <input
              type="text"
              name="fishName"
              value={filters.fishName}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Scientific Name</label>
            <input
              type="text"
              name="scientificName"
              value={filters.scientificName}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All</option>
              <option value="Freshwater">Freshwater</option>
              <option value="Saltwater">Saltwater</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => setFilters({ fishName: '', scientificName: '', type: '' })}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Filters
        </button>
      </div>

      {/* Fish Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFish.map((fish, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={fish.image} alt={fish.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-center">{fish.name}</h3>
              <p className="text-gray-500 text-center italic">{fish.scientificName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}