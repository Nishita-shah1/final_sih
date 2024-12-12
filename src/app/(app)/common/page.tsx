/* eslint-disable */

"use client";
import React, { useState, ChangeEvent, useMemo } from 'react';

type FileData = { [key: string]: string }; // This will hold the parsed data from each file

const Page: React.FC = () => {
  const [fileData1, setFileData1] = useState<FileData[]>([]); // Store data from File 1
  const [fileData2, setFileData2] = useState<FileData[]>([]); // Store data from File 2
  const [fileData3, setFileData3] = useState<FileData[]>([]); // Store data from File 3
  const [allColumns, setAllColumns] = useState<string[]>([]); // Store all columns
  const [mergedData, setMergedData] = useState<FileData[]>([]); // Store merged data
  const [filters, setFilters] = useState<{ [key: string]: string }>({}); // Store column filters
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

        // Extract header and data rows
        const header = rows[0];
        const data = rows.slice(1).map((row) => {
          const rowData: FileData = {};
          row.forEach((value, index) => {
            rowData[header[index]] = value;
          });
          return rowData;
        });

        setData(data);
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

  // Merge the data based on all unique columns
  const mergeData = useMemo(() => {
    // Collect all unique columns from the three files
    const allCols = Array.from(
      new Set([
        ...Object.keys(fileData1[0] || {}),
        ...Object.keys(fileData2[0] || {}),
        ...Object.keys(fileData3[0] || {}),
      ])
    );
    setAllColumns(allCols);

    // Merge data from all three files based on the columns
    const merged = [
      ...fileData1,
      ...fileData2,
      ...fileData3,
    ].map((row) => {
      const mergedRow: FileData = {};
      allCols.forEach((col) => {
        mergedRow[col] = row[col] ?? '0'; // Fill missing data with "0"
      });
      return mergedRow;
    });

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

  // Render the table to show the merged data
  const renderTable = () => {
    if (!mergedData.length) {
      return <div>No data available to display.</div>;
    }

    return (
      <table className="border-collapse table-auto w-full">
        <thead>
          <tr>
            {allColumns.map((header) => (
              <th key={header} className="border p-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mergedData.map((row, index) => (
            <tr key={index}>
              {allColumns.map((header) => (
                <td key={header} className="border p-2">{row[header]}</td>
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
          <h3>All Columns Merged Data:</h3>
          {renderTable()}
        </div>
      )}
    </div>
  );
};

export default Page;