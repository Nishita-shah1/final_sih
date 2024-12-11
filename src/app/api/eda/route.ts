import express, { Request, Response, NextFunction } from 'express';
import multer, { StorageEngine, FileFilterCallback } from 'multer';
import * as fastCsv from 'fast-csv';
import cors from 'cors';
import mongoose, { Schema, Model, Document } from 'mongoose';
import * as fs from 'fs/promises';
import * as path from 'path';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5173'],
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Uploads directory setup
const uploadsDir = path.join(__dirname, 'uploads');
const ensureUploadsDir = async (): Promise<void> => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    console.log('Uploads directory ensured:', uploadsDir);
  } catch (err) {
    console.error('Error creating uploads directory:', err);
  }
};
ensureUploadsDir();

// Interfaces
interface SchemaType {
  category: string;
  types: string[];
}

interface HeaderTypes {
  [key: string]: string;
}

interface CsvRow {
  [key: string]: string | number | boolean | Date;
}

// Predefined schema types with descriptive categories
const SCHEMA_TYPES: SchemaType[] = [
  { category: 'Basic Types', types: ['String', 'Number', 'Boolean', 'Date'] },
  { category: 'Advanced Types', types: ['Mixed', 'ObjectId'] },
  { 
    category: 'MongoDB Specific Types', 
    types: [
      'Array', 'Binary', 'Decimal128', 'Double', 
      'Int32', 'Int64', 'Object', 'BSONRegExp'
    ]
  }
];

// Multer storage configuration
const storage: StorageEngine = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await ensureUploadsDir();
      cb(null, uploadsDir);
    } catch (err) {
      cb(err as Error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});

// Upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb: FileFilterCallback) => {
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/csv'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// First route to parse CSV and get headers
app.post('/parse-csv', 
  upload.single('file'), 
  async (req: Request, res: Response, next: NextFunction) => {
    // Type assertion for file
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }

    const filePath = path.join(uploadsDir, file.filename);

    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const headers: string[] = [];
      
      await new Promise<void>((resolve, reject) => {
        fastCsv
          .parseString(fileContent, { headers: true, trim: true })
          .on('headers', (processedHeaders: string[]) => {
            headers.push(...processedHeaders);
            resolve();
          })
          .on('error', reject);
      });

      if (!headers.length) {
        return res.status(400).json({
          status: 'error',
          message: 'No headers found in the CSV file'
        });
      }

      // Fetch first few rows for type inference
      const firstRows: CsvRow[] = [];
      await new Promise<void>((resolve, reject) => {
        fastCsv
          .parseString(fileContent, { headers: true, trim: true })
          .on('data', (row: CsvRow) => {
            if (firstRows.length < 5) {
              firstRows.push(row);
            } else {
              resolve();
            }
          })
          .on('end', resolve)
          .on('error', reject);
      });

      res.json({
        status: 'success',
        headers: headers,
        schemaTypes: SCHEMA_TYPES,
        filename: file.filename,
        sampleData: firstRows
      });
    } catch (err: any) {
      next(err); // Use next for error handling
    }
  }
);

// Route to save data with specified schema
app.post('/save-schema', async (req: Request, res: Response, next: NextFunction) => {
  const { filename, headerTypes }: { filename: string, headerTypes: HeaderTypes } = req.body;
  const filePath = path.join(uploadsDir, filename);

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const csvData: CsvRow[] = [];

    // Parse CSV
    await new Promise<void>((resolve, reject) => {
      fastCsv
        .parseString(fileContent, { headers: true, trim: true })
        .on('data', (row: CsvRow) => csvData.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    // Create dynamic schema based on user selections
    const schemaFields: { [key: string]: any } = {};
    Object.entries(headerTypes).forEach(([header, type]) => {
      switch (type) {
        case 'Number':
          schemaFields[header] = { 
            type: Number, 
            set: (v: any) => {
              if (v === '' || v === null || v === undefined) return null;
              const parsed = Number(v);
              return isNaN(parsed) ? null : parsed;
            }
          };
          break;
        case 'Date':
          schemaFields[header] = { 
            type: Date, 
            set: (v: any) => {
              if (!v) return null;
              const date = new Date(v);
              return isNaN(date.getTime()) ? null : date;
            }
          };
          break;
        case 'Boolean':
          schemaFields[header] = { 
            type: Boolean, 
            set: (v: any) => {
              if (typeof v === 'boolean') return v;
              if (typeof v === 'string') {
                return ['true', '1', 'yes', 'y'].includes(v.toLowerCase());
              }
              return false;
            }
          };
          break;
        case 'Mixed':
          schemaFields[header] = Schema.Types.Mixed;
          break;
        case 'ObjectId':
          schemaFields[header] = Schema.Types.ObjectId;
          break;
        case 'Array':
          schemaFields[header] = [Schema.Types.Mixed];
          break;
        case 'Binary':
          schemaFields[header] = Schema.Types.Buffer;
          break;
        case 'Decimal128':
          schemaFields[header] = Schema.Types.Decimal128;
          break;
        case 'Double':
          schemaFields[header] = { 
            type: Number,
            set: (v: any) => Number(v)
          };
          break;
        case 'Int32':
          schemaFields[header] = { 
            type: Number,
            set: (v: any) => Math.floor(Number(v))
          };
          break;
        case 'Object':
          schemaFields[header] = Schema.Types.Mixed;
          break;
        default:
          // Explicitly handle String type
          schemaFields[header] = { 
            type: String, 
            trim: true,
            set: (v: any) => v !== null && v !== undefined ? String(v).trim() : null
          };
      }
    });

    // Create dynamic model
    const collectionName = csv_import_${Date.now()};
    const DynamicSchema = new Schema(schemaFields, {
      strict: false,
      timestamps: true
    });

    // Type-safe dynamic model
    interface DynamicDocument extends Document {
      [key: string]: any;
    }
    const DynamicModel: Model<DynamicDocument> = mongoose.model<DynamicDocument>(collectionName, DynamicSchema);

    // Save documents
    const savedDocuments = await DynamicModel.insertMany(csvData);

    res.json({
      status: 'success',
      message: 'CSV uploaded and data stored in MongoDB',
      collectionName,
      totalRecords: savedDocuments.length,
    });
  } catch (err: any) {
    next(err); // Improved error handling
  }
});

// MongoDB Connection
mongoose.connect('mongodb+srv://payalsahuofficial01:S3dLQ4h26uB5lJeN@cluster0.esl6o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('✅ MongoDB Connection Successful'))
.catch((err) => {
  console.error('❌ MongoDB Connection Failed:', err);
  process.exit(1);
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred',
    details: err.message
  });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(🚀 Server running on http://localhost:${PORT});
});

export default app;