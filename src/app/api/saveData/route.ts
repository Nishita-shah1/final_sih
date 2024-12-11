import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Persistent MongoDB client
let client: MongoClient | null = null;

// MongoDB URI
const url = process.env.MONGODB_URI || 'mongodb+srv://nishitashah118:H5feFMZVDik2cJVY@cluster0.a4esr.mongodb.net/fishDatabase';

async function getMongoClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(url);
    await client.connect();
  }
  return client;
}

export async function POST(req: Request) {
  try {
    // Parse incoming request body
    const { data, username } = await req.json();

    // Validate data and username
    if (!username || !data || data.length === 0) {
      return NextResponse.json({ message: 'Username and data are required' }, { status: 400 });
    }

    // Get MongoDB client
    const mongoClient = await getMongoClient();
    const db = mongoClient.db('fishDatabase'); // Replace with your database name
    const collection = db.collection('fishData'); // Replace with your collection name

    // Insert the data along with the username and date
    const result = await collection.insertOne({
      username,
      data,
      date: new Date(),
    });

    // Check for success
    if (result.acknowledged) {
      return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
    } else {
      throw new Error('Failed to insert data into database');
    }
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ message: 'Failed to save data' }, { status: 500 });
  }
}
