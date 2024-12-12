import express, { Request, Response } from 'express';  // Import express and types
import multer from 'multer';  // Import multer for file uploads
import { parse } from 'fast-csv';  // Corrected import: fast-csv as named import
import cors from 'cors';  // Import CORS middleware for cross-origin requests
import fs from 'fs/promises';  // Import fs (file system) module for file handling
import path from 'path';  // Import path module for working with file paths
import mongoose from 'mongoose';  // Import mongoose for MongoDB connection
import dotenv from 'dotenv';  // Import dotenv for environment variable management

dotenv.config();  // Load environment variables from .env file

const app = express();  // Create an express app

// Middleware
app.use(cors());  // Enable CORS for handling requests from different origins
app.use(express.json());  // Parse incoming JSON requests

// Directory for storing uploaded files
const uploadsDir = path.join(__dirname, 'uploads');

// Ensure the uploads directory exists or create it if not
const ensureUploadsDir = async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });  // Create uploads folder if it doesn't exist
    console.log('Uploads directory ensured:', uploadsDir);  // Log success
  } catch (err) {
    console.error('Error creating uploads directory:', err);  // Log error if any
  }
};
ensureUploadsDir();  // Ensure the uploads directory exists

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: async (_, __, cb) => {
    try {
      await ensureUploadsDir();  // Ensure the upload directory exists
      cb(null, uploadsDir);  // Set the destination for the uploaded file
    } catch (err) {
      cb(err);  // Pass error to callback if directory creation fails
    }
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);  // Create a unique filename
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);  // Set the filename
  },
});

// Create the multer instance for handling uploads
const upload = multer({
  storage: storage,  // Use the storage configuration
  limits: { fileSize: 10 * 1024 * 1024 },  // Set file size limit to 10MB
  fileFilter: (_, file, cb) => {
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/csv'];  // Allowed file types
    allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only CSV files are allowed'));  // Validate file type
  },
});

// Define a mock schema for CSV file types (This can be modified as per your use case)
const SCHEMA_TYPES = [
  { category: 'Basic Types', types: ['String', 'Number', 'Boolean', 'Date'] },
  { category: 'Advanced Types', types: ['Mixed', 'ObjectId'] },
  { category: 'MongoDB Specific Types', types: ['Array', 'Binary', 'Decimal128', 'Double', 'Int32', 'Int64'] },
];

// Define the CSV parsing route
app.post('/parse-csv', upload.single('file'), async (req: Request, res: Response) => {
  // Check if the file is uploaded
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No file uploaded' });  // Return error if no file is uploaded
  }

  const filePath = path.join(uploadsDir, req.file.filename);  // Get the full path of the uploaded file

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');  // Read the CSV file content
    const headers: string[] = [];  // Initialize an array for CSV headers
    const sampleData: Record<string, any>[] = [];  // Initialize an array to store sample data

    // Parse the CSV content using fast-csv
    await new Promise<void>((resolve, reject) => {
      parse(fileContent, { headers: true })  // Parse CSV with headers enabled
        .on('headers', (headerRow) => headers.push(...headerRow))  // Capture the headers
        .on('data', (row) => sampleData.length < 5 && sampleData.push(row))  // Capture the first 5 rows of data
        .on('end', resolve)  // Resolve promise when parsing is done
        .on('error', reject);  // Reject promise if an error occurs
    });

    // Send the parsed headers, schema types, and sample data as the response
    res.json({
      status: 'success',
      headers,
      schemaTypes: SCHEMA_TYPES,
      sampleData,
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });  // Send error if CSV parsing fails
  }
});

// MongoDB connection setup using environment variables
mongoose.connect("mongodb+srv://nishitashah118:H5feFMZVDik2cJVY@cluster0.a4esr.mongodb.net/fishdata" as string, {
  useNewUrlParser: true,  // Use new URL parser
  useUnifiedTopology: true,  // Use unified topology
} as mongoose.ConnectOptions)
  .then(() => console.log('✅ MongoDB Connected'))  // Log success if connected to MongoDB
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));  // Log error if connection fails

// Start the server on port 5000 (or any other port)
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);  // Log server running message
});

export default app;  // Export the app for use in testing or further modularization
