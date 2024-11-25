import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';  // Corrected import
import fs from 'fs';
import csv from 'csv-parser';
import * as XLSX from 'xlsx';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

// Define the data structure
interface FishData {
  fish_name: string;
  scientific_name: string;
  date: Date;
  longitude: number;
  latitude: number;
  catchweight: number;
}

// Disable Next.js body parser for formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  // Use the raw native `req` from the Next.js request
  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(400).json({ success: false, error: 'Form parse error' });
    }

    const file = files.file ? files.file[0] : null;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file found in the request.' });
    }

    const fileType = file.mimetype;

    // Validate file type (CSV or Excel)
    if (!fileType || (!fileType.startsWith('text/csv') && !fileType.includes('spreadsheetml'))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type. Only CSV and Excel files are allowed.',
      });
    }

    const rows: FishData[] = [];

    try {
      if (fileType.startsWith('text/csv')) {
        // Parse CSV file
        fs.createReadStream(file.filepath)
          .pipe(csv())
          .on('data', (row) => {
            rows.push({
              fish_name: row['fish_name'],
              scientific_name: row['scientific_name'],
              date: new Date(row['date']),
              longitude: parseFloat(row['longitude']),
              latitude: parseFloat(row['latitude']),
              catchweight: parseFloat(row['catchweight']),
            });
          })
          .on('end', async () => {
            await handleDatabaseSave(fields, rows, res);
          })
          .on('error', (error) => {
            console.error('Error parsing CSV file:', error);
            res.status(400).json({ success: false, error: 'Error parsing CSV file.' });
          });
      } else if (fileType.includes('spreadsheetml')) {
        // Parse Excel file
        const workbook = XLSX.readFile(file.filepath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<FishData>(sheet);

        jsonData.forEach((row) => {
          rows.push({
            fish_name: row.fish_name,
            scientific_name: row.scientific_name,
            date: new Date(row.date),
            longitude: parseFloat(row.longitude as any),
            latitude: parseFloat(row.latitude as any),
            catchweight: parseFloat(row.catchweight as any),
          });
        });

        await handleDatabaseSave(fields, rows, res);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(400).json({ success: false, error: 'File processing error' });
    }
  });
}

// Save data to the database
async function handleDatabaseSave(
  fields: formidable.Fields,
  rows: FishData[],
  res: NextApiResponse
) {
  try {
    await dbConnect();

    const user = await UserModel.findById(fields.userId);
    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    if (!user.uploadedFiles) {
      user.uploadedFiles = [];
    }

    user.uploadedFiles.push({
      filename: fields.fileName?.[0] ?? 'Unknown',
      data: rows,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'File uploaded and processed successfully!',
    });
  } catch (error) {
    console.error('Database save error:', error);
    res.status(500).json({ success: false, error: 'Database save error' });
  }
}
