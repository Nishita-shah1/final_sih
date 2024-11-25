import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import csvtojson from 'csvtojson';
import { MongoClient } from 'mongodb';
import dbConnect from '@/lib/dbConnect';

import UserModel from '@/model/User';


// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Utility to parse form data into a buffer
const parseFormData = (req: NextApiRequest): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      console.log('File buffer received successfully');
      resolve(Buffer.concat(chunks));
    });
    req.on('error', reject);
  });
};

// MongoDB connection utility
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

async function dbConnect() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Exported POST handler function
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res
        .status(405)
        .json({ success: false, error: 'Method not allowed' });
    }

    console.log('POST request received');
    
    // Parse uploaded file
    const fileBuffer = await parseFormData(req);
    console.log('File buffer size:', fileBuffer.length);

    const tempFilePath = './uploads/tempfile.csv';

    // Save file temporarily
    fs.writeFileSync(tempFilePath, fileBuffer);
    console.log('Temporary file saved at:', tempFilePath);

    // Convert CSV to JSON
    const jsonArray = await csvtojson().fromFile(tempFilePath);
    console.log('Converted JSON array:', jsonArray);

    // Prepare data for database insertion
    const dataToInsert = jsonArray.map((row) => ({
      fish_name: row['fish_name'],
      scientific_name: row['scientific_name'],
      date: new Date(row['date']),
      longitude: parseFloat(row['longitude']),
      latitude: parseFloat(row['latitude']),
      catchweight: parseFloat(row['catchweight']),
    }));
    console.log('Parsed data ready for insertion:', dataToInsert);

    // Connect to MongoDB and insert data
    const { client, db } = await dbConnect();
    const collection = db.collection(collectionName);
    await collection.insertMany(dataToInsert);
    console.log('Data successfully inserted into MongoDB');

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
    console.log('Temporary file removed');

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'File uploaded and data inserted into database',
    });
  } catch (error) {
    console.error('Error:', error);

    // Return error response
    return res.status(500).json({
      success: false,
      error: 'Error processing file or saving to database',
    });
  }
}
