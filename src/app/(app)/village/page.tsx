// 'use client';
// import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// type FilterState = {
//   village: string;
//   reportingDate: string;
//   species: string;
//   longitude: number,
//     latitude: number,
//     elasmobranchs: number,
//     eels: number,
//         cat_fish: number,
//         dorab: number,
//         oil_sardine: number,
//         lesser_sardines: number,
//         hilsa: number,
//         other_hilsa: number,
//         anchovies: number,
//         other_anchovies: number,
//         other_clupeids: number,
//         bombay_duck: number,
//         lizard_fish: number,
//         ghar_fish: number,
//         flying_fish: number,
//         nemipterids: number,
//         goat_fishes: number,
//         polynemids: number,
//         croakers: number,
//         ribbon_fish: number,
//         trevally_carangid: number,
//         queen_fish_carangid: number,
//         pompano_carangid: number,
//         other_carangids: number,
//         dolphin_fish_carangid: number,
//         rainbowrunner_carangid: number,
//         leiognathus: number,
//         pony_fish: number,
//         falsetrevally_lactariida: number,
//         pomfrets: number,
//         indian_mackerel: number,
//         seer_fish: number,
//         other_tuna: number,
//         barracuda: number,
//         mullet: number,
//         bregmaceros: number,
//         flat_fish: number,
//         penaeid_prawn: number,
//         non_penaeid_prawn: number,
//         lobsters: number,
//         crabs: number,
//         mantis_shrimp: number,
//         cephalopods: number,
//         miscellaneous: number
// };

// type DataRow = [string, string, string, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];

// const Page: React.FC = () => {
//   const [csvData, setCsvData] = useState<DataRow[]>([]);
//   const [filteredData, setFilteredData] = useState<DataRow[]>([]);
//   const [errorMessage, setErrorMessage] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [generalError, setGeneralError] = useState<string | null>(null);
//   const [username, setUsername] = useState<string>('user123');
//   const [filters, setFilters] = useState<FilterState>({
//         village: ' ',
//         reportingDate: ' ',
//         species: ' ',
//         longitude: 0,
//         latitude: 0,
//         elasmobranchs: 0,
//         eels: 0,
//         cat_fish: 0,
//         dorab: 0,
//         oil_sardine: 0,
//         lesser_sardines: 0,
//         hilsa: 0,
//         other_hilsa: 0,
//         anchovies: 0,
//         other_anchovies: 0,
//         other_clupeids: 0,
//         bombay_duck: 0,
//         lizard_fish: 0,
//         ghar_fish: 0,
//         flying_fish: 0,
//         nemipterids: 0,
//         goat_fishes: 0,
//         polynemids: 0,
//         croakers: 0,
//         ribbon_fish: 0,
//         trevally_carangid: 0,
//         queen_fish_carangid: 0,
//         pompano_carangid: 0,
//         other_carangids: 0,
//         dolphin_fish_carangid: 0,
//         rainbowrunner_carangid: 0,
//         leiognathus: 0,
//         pony_fish: 0,
//         falsetrevally_lactariida: 0,
//         pomfrets: 0,
//         indian_mackerel: 0,
//         seer_fish: 0,
//         other_tuna: 0,
//         barracuda: 0,
//         mullet: 0,
//         bregmaceros: 0,
//         flat_fish: 0,
//         penaeid_prawn: 0,
//         non_penaeid_prawn: 0,
//         lobsters: 0,
//         crabs: 0,
//         mantis_shrimp: 0,
//         cephalopods: 0,
//         miscellaneous: 0
//   });
//   const [showGraphs, setShowGraphs] = useState<boolean>(false);

//   useEffect(() => {
//     const savedData = localStorage.getItem(`csvData_${username}`);
//     if (savedData) {
//       try {
//         const parsedData = JSON.parse(savedData) as DataRow[];
//         setCsvData(parsedData);
//         setFilteredData(parsedData);
//       } catch {
//         setGeneralError('An unexpected error occurred while loading saved data.');
//       }
//     }
//   }, [username]);

//   useEffect(() => {
//     if (csvData.length > 0) {
//       localStorage.setItem(`csvData_${username}`, JSON.stringify(csvData));
//     }
//   }, [csvData, username]);

//   const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) {
//       setErrorMessage('Please select a file.');
//       return;
//     }
//     if (!file.name.endsWith('.csv')) {
//       setErrorMessage('Please upload a valid CSV file.');
//       return;
//     }

//     setIsLoading(true);
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const text = e.target?.result as string;
//         const rows = text
//           .split('\n')
//           .map((row) => row.split(',').map((cell) => cell.trim())) as DataRow[];
//         setCsvData(rows);
//         setFilteredData(rows);
//         setErrorMessage('');
//       } catch {
//         setGeneralError('Error parsing CSV data.');
//       }
//       setIsLoading(false);
//     };
//     reader.onerror = () => {
//       setIsLoading(false);
//       setGeneralError('Error reading the file.');
//     };
//     reader.readAsText(file);
//   };

//   const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: value,
//     }));
//   };

//   const filteredResults = useMemo(() => {
//     try {
//       return csvData.filter(([village,
//         reportingDate,
//         species,
//         longitude,
//           latitude,
//           elasmobranchs,
//           eels,
//               cat_fish,
//               dorab,
//               oil_sardine,
//               lesser_sardines,
//               hilsa,
//               other_hilsa,
//               anchovies,
//               other_anchovies,
//               other_clupeids,
//               bombay_duck,
//               lizard_fish,
//               ghar_fish,
//               flying_fish,
//               nemipterids,
//               goat_fishes,
//               polynemids,
//               croakers,
//               ribbon_fish,
//               trevally_carangid,
//               queen_fish_carangid,
//               pompano_carangid,
//               other_carangids,
//               dolphin_fish_carangid,
//               rainbowrunner_carangid,
//               leiognathus,
//               pony_fish,
//               falsetrevally_lactariida,
//               pomfrets,
//               indian_mackerel,
//               seer_fish,
//               other_tuna,
//               barracuda,
//               mullet,
//               bregmaceros,
//               flat_fish,
//               penaeid_prawn,
//               non_penaeid_prawn,
//               lobsters,
//               crabs,
//               mantis_shrimp,
//               cephalopods,
//               miscellaneous]) => {
//         const matchPfz = filters.pfz ? pfz.toLowerCase().includes(filters.pfz.toLowerCase()) : true;
//         const matchFishingDate = filters.fishingDate ? fishingDate.includes(filters.fishingDate) : true;
//         const matchLatitude = filters.latitude ? latitude.includes(filters.latitude) : true;
//         const matchLongitude = filters.longitude ? longitude.includes(filters.longitude) : true;
//         const matchDepth = filters.depth ? depth.includes(filters.depth) : true;
//         const matchSpecies = filters.species ? species.toLowerCase().includes(filters.species.toLowerCase()) : true;
//         const matchAmount = filters.amount ? amount.includes(filters.amount) : true;

//         return matchPfz && matchFishingDate && matchLatitude && matchLongitude && matchDepth && matchSpecies && matchAmount;
//       });
//     } catch {
//       setGeneralError('An error occurred while filtering data.');
//       return [];
//     }
//   }, [csvData, filters]);

//   useEffect(() => {
//     setFilteredData(filteredResults);
//   }, [filteredResults]);

//   const renderFilters = () => {
//     const filterFields: { name: keyof FilterState; placeholder: string; type?: string }[] = [
//       { name: 'pfz', placeholder: 'PFZ' },
//       { name: 'fishingDate', placeholder: 'Fishing Date', type: 'date' },
//       { name: 'latitude', placeholder: 'Latitude' },
//       { name: 'longitude', placeholder: 'Longitude' },
//       { name: 'depth', placeholder: 'Depth' },
//       { name: 'species', placeholder: 'Species' },
//       { name: 'amount', placeholder: 'Amount' },
//     ];

//     return filterFields.map(({ name, placeholder, type = 'text' }) => (
//       <input
//         key={name}
//         name={name}
//         type={type}
//         placeholder={placeholder}
//         onChange={handleFilterChange}
//         className="border p-2 mb-2 w-full rounded-md"
//       />
//     ));
//   };

//   const toggleGraphs = () => {
//     setShowGraphs(!showGraphs);
//   };

//   // Graph data preparation
//   const lineChartData = {
//     labels: filteredData.map((row) => row[1]), // Using fishingDate as the label
//     datasets: [
//       {
//         label: 'Amount of Fish Caught',
//         data: filteredData.map((row) => parseInt(row[6], 10)), // Using amount as data
//         fill: false,
//         backgroundColor: 'rgb(75, 192, 192)',
//         borderColor: 'rgba(75, 192, 192, 0.2)',
//         tension: 0.1,
//       },
//     ],
//   };

//   const pieChartData = {
//     labels: filteredData.map((row) => row[5]), // Using species as labels
//     datasets: [
//       {
//         label: 'Fish Species Distribution',
//         data: filteredData.reduce((acc, row) => {
//           const species = row[5];
//           const index = acc.findIndex((entry) => entry.label === species);
//           if (index !== -1) {
//             acc[index].value += parseInt(row[6], 10); // Accumulate amounts
//           } else {
//             acc.push({ label: species, value: parseInt(row[6], 10) });
//           }
//           return acc;
//         }, [] as { label: string; value: number }[]).map((entry) => entry.value),
//         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
//         hoverOffset: 4,
//       },
//     ],
//   };

//   const filteredResults = useMemo(() => {
//     return jsonData.filter((row) => {
//       const matchVillage = filters.village ? row.Village.toLowerCase().includes(filters.village.toLowerCase()) : true;
//       const matchReportingDate = filters.reportingDate ? row['Reporting Date'].includes(filters.reportingDate) : true;
//       const matchSpecies = filters.species ? Object.values(row).some((value) => value.toString().toLowerCase().includes(filters.species.toLowerCase())) : true;

//       return matchVillage && matchReportingDate && matchSpecies;
//     });
//   }, [jsonData, filters]);

//   useEffect(() => {
//     setFilteredData(filteredResults);
//   }, [filteredResults]);

//   const renderFilters = () => {
//     const filterFields: { name: keyof FilterState; placeholder: string; type?: string }[] = [
//       { name: 'village', placeholder: 'Village' },
//       { name: 'reportingDate', placeholder: 'Reporting Date', type: 'date' },
//       { name: 'species', placeholder: 'Species' },
//     ];

//     return filterFields.map((field) => (
//       <div key={field.name} className="filter">
//         <input
//           type={field.type || 'text'}
//           name={field.name}
//           value={filters[field.name]}
//           placeholder={field.placeholder}
//           onChange={handleFilterChange}
//         />
//       </div>
//     ));
//   };

//   return (
//     <div className="App">
//       {generalError && <div className="error-message">{generalError}</div>}
//       <input type="file" accept=".json" onChange={handleFileUpload} />
//       {isLoading && <div>Loading...</div>}
//       {errorMessage && <div>{errorMessage}</div>}

//       {renderFilters()}

//       {/* Graphs or tables go here */}
//     </div>
//   );
// };

// export default Page;
