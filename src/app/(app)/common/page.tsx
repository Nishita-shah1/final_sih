/* eslint-disable */
"use client";
import React, { useState, ChangeEvent, useMemo } from 'react';

type FileData = string[]; // Each row will be an array of strings representing cell values

const Page: React.FC = () => {
  const [fileData1, setFileData1] = useState<FileData[]>([]); // Store data from File 1
  const [fileData2, setFileData2] = useState<FileData[]>([]); // Store data from File 2
  const [fileData3, setFileData3] = useState<FileData[]>([]); // Store data from File 3
  const [mergedData, setMergedData] = useState<FileData[]>([]); // Store merged data
  const [errorMessage, setErrorMessage] = useState<string>(''); // Store error message
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [showTable, setShowTable] = useState<boolean>(false); // Track when to display table

  // Handle file upload for File 1
  const handleFileUpload1 = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event, setFileData1);
  };

  // Handle file upload for File 2
  const handleFileUpload2 = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event, setFileData2);
  };

  // Handle file upload for File 3
  const handleFileUpload3 = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event, setFileData3);
  };

  // Common function to parse CSV data and extract rows
  const handleFileUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setData: React.Dispatch<React.SetStateAction<FileData[]>>
  ) => {
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
        const rows = text.split('\n').map((row) => row.split(',').map((cell) => cell.trim()));

        setData(rows);
        setErrorMessage('');
      } catch {
        setErrorMessage('Error parsing CSV data.');
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setErrorMessage('Error reading the file.');
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  // Merge the data from all files horizontally
  const mergeData = useMemo(() => {
    // Concatenate data horizontally (side-by-side)
    const maxLength = Math.max(fileData1.length, fileData2.length, fileData3.length);
    const merged = [];

    for (let i = 0; i < maxLength; i++) {
      const row1 = fileData1[i] || [];
      const row2 = fileData2[i] || [];
      const row3 = fileData3[i] || [];

      // Combine all the rows side by side
      merged.push([...row1, ...row2, ...row3]);
    }

    setMergedData(merged);
  }, [fileData1, fileData2, fileData3]);

  // Handle submit action
  const handleSubmit = () => {
    if (fileData1.length || fileData2.length || fileData3.length) {
      setShowTable(true);
    } else {
      setErrorMessage('Please upload at least one file before submitting.');
    }
  };

  // Render the table to show the merged data horizontally
  const renderTable = () => {
    if (!mergedData.length) {
      return <div>No data available to display.</div>;
    }

    return (
      <table className="border-collapse table-auto w-full">
        <thead>
          <tr>
            {/* Dynamically create headers based on the files uploaded */}
            {fileData1[0] && fileData1[0].map((_, index) => (
              <th key={`file1-column-${index}`} className="border p-2">File 1 Column {index + 1}</th>
            ))}
            {fileData2[0] && fileData2[0].map((_, index) => (
              <th key={`file2-column-${index}`} className="border p-2">File 2 Column {index + 1}</th>
            ))}
            {fileData3[0] && fileData3[0].map((_, index) => (
              <th key={`file3-column-${index}`} className="border p-2">File 3 Column {index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mergedData.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border p-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <div>
        <h3>Upload File 1:</h3>
        <input type="file" onChange={handleFileUpload1} />
      </div>
      <div>
        <h3>Upload File 2:</h3>
        <input type="file" onChange={handleFileUpload2} />
      </div>
      <div>
        <h3>Upload File 3:</h3>
        <input type="file" onChange={handleFileUpload3} />
      </div>

      {isLoading && <div>Loading...</div>}
      {errorMessage && <div>{errorMessage}</div>}

      <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white p-2 rounded">
        Submit
      </button>

      {showTable && (
        <div>
          <h3>All Data Merged Horizontally:</h3>
          {renderTable()}
        </div>
      )}
    </div>
  );
};

export default Page;
