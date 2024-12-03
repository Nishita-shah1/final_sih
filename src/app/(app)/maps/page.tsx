import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet'; // Import Leaflet's Map type
import L from 'leaflet';
import Papa from 'papaparse';

// Default icon fix for Leaflet
import 'leaflet/dist/leaflet.css';

// Configure default icon
const DefaultIcon = new L.Icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
L.Marker.prototype.options.icon = DefaultIcon;

interface DataRow {
  name: string;
  latitude: string;
  longitude: string;
  type: string;
}

export default function MapsWithFileUpload() {
  const [fileData, setFileData] = useState<DataRow[]>([]); // Stores uploaded data
  const [filter, setFilter] = useState('All'); // Current filter selection
  const [filteredData, setFilteredData] = useState<DataRow[]>([]); // Data displayed on the map

  // Type the ref for MapContainer explicitly as a LeafletMap
  const mapRef = useRef<LeafletMap | null>(null); // Store the map instance, handling the null case

  // Handle file upload and parse
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const parsedData = result.data.filter(
          (row: DataRow) => row.latitude && row.longitude && row.name && row.type
        ) as DataRow[]; // Filter valid rows
        setFileData(parsedData);
        setFilteredData(parsedData); // Initialize map with all data
      },
      error: (error) => console.error('Error parsing file:', error),
    });
  };

  // Apply selected filter
  const applyFilter = () => {
    const updatedData =
      filter === 'All' ? fileData : fileData.filter((row) => row.type === filter);
    setFilteredData(updatedData);
  };

  useEffect(() => {
    if (mapRef.current) {
      // Ensure that the map is only initialized once
      mapRef.current.invalidateSize();
    }
  }, [filteredData]);

  return (
    <div className="container mx-auto p-6">
      {/* Upload Section */}
      <div className="mb-6">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full p-2 border rounded mb-4"
        />
        <p className="text-gray-500">Upload a CSV file with columns: name, latitude, longitude, and type.</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 flex justify-center space-x-4">
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

      {/* Submit Button */}
      <div className="mb-4 text-center">
        <button
          onClick={applyFilter}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Submit
        </button>
      </div>

      {/* Map Section */}
      <MapContainer
        ref={mapRef}
        center={[20.5937, 78.9629]} // Default center (India)
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Render Markers from Filtered Data */}
        {filteredData.map((row, index) => (
          <Marker
            key={index}
            position={[parseFloat(row.latitude), parseFloat(row.longitude)]}
          >
            <Popup>
              <strong>{row.name}</strong>
              <br />
              Type: {row.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
