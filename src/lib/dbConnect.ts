import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: '../.env' }); // Load environment variables

type ConnectionObject = {
  isConnected?: number;
};

console.log(process.env.MONGODB_URL); // To check if it's loaded

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection unsuccessful", error);
    process.exit(1);
  }
}

dbConnect();

export default dbConnect;
