import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB connection string
const url = 'mongodb+srv://nishitashah118:H5feFMZVDik2cJVY@cluster0.a4esr.mongodb.net/fishDatabase'; 
const client = new MongoClient(url);

export async function GET() {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('fishDatabase'); // Replace with your database name
    const collection = db.collection('fishData'); // Replace with your collection name

    // Fetch all documents
    const data = await collection.find({}).toArray();

    // Return the fetched data
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 });
  } finally {
    // Always close the MongoDB client
    await client.close();
  }
}
