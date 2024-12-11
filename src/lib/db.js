import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://nishitashah118:H5feFMZVDik2cJVY@cluster0.a4esr.mongodb.net/fishdata"; // Use environment variable for secure connection
let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to the .env file');
}

if (process.env.NODE_ENV === 'development') {
  // For hot reload in dev mode, use a global variable
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // For production, connect normally
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
