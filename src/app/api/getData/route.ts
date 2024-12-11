import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const url = 'mongodb+srv://nishitashah118:H5feFMZVDik2cJVY@cluster0.a4esr.mongodb.net/fishDatabase';
const client = new MongoClient(url);

export async function GET() {
  try {
    await client.connect();
    const db = client.db('fishDatabase');
    const collection = db.collection('fishData');

    const data = await collection.find({}).toArray();

    // Return data in the response
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ message: 'Error fetching data' }, { status: 500 });
  } finally {
    await client.close();
  }
}
