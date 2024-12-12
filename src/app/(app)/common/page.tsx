/* eslint-disable */
"use client";
import React, { useState, ChangeEvent } from "react";
import SpeciesSelector from "./SpeciesSelector"; // Adjust path if necessary
import { MultiValue } from "react-select";


type FileData = string[][];


interface SpeciesOption {
  value: string;
  label: string;
}


const Page: React.FC = () => {
  const [fileData, setFileData] = useState<FileData[]>([[], [], []]); // Data from 3 files
  const [mergedData, setMergedData] = useState<FileData>([]); // Merged data
  const [filteredData, setFilteredData] = useState<FileData>([]); // Filtered data
  const [selectedSpecies, setSelectedSpecies] = useState<MultiValue<SpeciesOption>>([]); // Selected species
  const [errorMessage, setErrorMessage] = useState<string>(""); // Error messages
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [showTable, setShowTable] = useState<boolean>(false); // Show table toggle


  // Handle file upload for a specific index
  const handleFileUpload = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setErrorMessage(`Please select a file for File ${index + 1}`);
      return;
    }
    if (!file.name.endsWith(".csv")) {
      setErrorMessage(`Please upload a valid CSV file for File ${index + 1}`);
      return;
    }


    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text
          .split("\n")
          .filter((row) => row.trim() !== "") // Filter out empty rows
          .map((row) => row.split(",").map((cell) => cell.trim()));


        setFileData((prevData) => {
          const newData = [...prevData];
          newData[index] = rows;
          return newData;
        });
        setErrorMessage("");
      } catch {
        setErrorMessage(`Error parsing CSV data for File ${index + 1}`);
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setErrorMessage(`Error reading File ${index + 1}`);
      setIsLoading(false);
    };
    reader.readAsText(file);
  };


  // Merge data from all files
  const handleMergeData = () => {
    const maxLength = Math.max(...fileData.map((data) => data.length));
    const merged = [];


    for (let i = 0; i < maxLength; i++) {
      const row = fileData.reduce((acc, data) => {
        return [...acc, ...(data[i] || [])];
      }, []);
      merged.push(row);
    }


    setMergedData(merged);
    setFilteredData(merged); // Initialize filtered data
    setShowTable(true);
  };


  // Filter merged data based on selected species
  const applyFilter = () => {
    if (!selectedSpecies.length) {
      setFilteredData(mergedData); // Reset filter if no species selected
      return;
    }


    const speciesValues = selectedSpecies.map((species) => species.value.toLowerCase());
    const filtered = mergedData.filter((row) =>
      row.some((cell) => speciesValues.some((value) => cell.toLowerCase().includes(value)))
    );


    setFilteredData(filtered);
  };


  // Update filtered data whenever the selected species change
  React.useEffect(() => {
    applyFilter();
  }, [selectedSpecies]);


  // Download filtered data as CSV
  const downloadCSV = () => {
    const csvContent = filteredData
      .map((row) => row.map((cell) => "${cell}").join(","))
      .join("\n");


    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);


    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filtered_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Render the filtered data table
  const renderTable = () => {
    if (!filteredData.length) {
      return <div>No data available to display.</div>;
    }


    return (
      <table className="border-collapse table-auto w-full text-left">
        <thead>
          <tr>
            {filteredData[0]?.map((_, colIndex) => (
              <th key={colIndex} className="border p-2 font-bold">Column {colIndex + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border p-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };


  return (
    <div className="p-4 flex">
      {/* Sidebar */}
      <div className="w-1/4">
        <SpeciesSelector
          selectedSpecies={selectedSpecies}
          setSelectedSpecies={setSelectedSpecies}
        />
      </div>


      {/* Main content */}
      <div className="w-3/4 pl-4">
        <h1 className="text-xl font-bold mb-4">CSV File Merger</h1>


        {[0, 1, 2].map((index) => (
          <div key={index} className="mb-4">
            <h3>Upload File {index + 1}:</h3>
            <input type="file" accept=".csv" onChange={handleFileUpload(index)} />
          </div>
        ))}


        {isLoading && <div>Loading...</div>}
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}


        <button
          onClick={handleMergeData}
          className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Merge Files
        </button>


        {showTable && (
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">Filtered Data:</h3>
            {renderTable()}


            <button
              onClick={downloadCSV}
              className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Download Filtered Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default Page;





