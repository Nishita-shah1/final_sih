import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 
type ConnectionObject = {
  isConnected?: number;
};


const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    const db = await mongoose.connect("mongodb+srv://nishitashah118:H5feFMZVDik2cJVY@cluster0.a4esr.mongodb.net/test");
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection unsuccessful", error);
    process.exit(1);
  }
}



export default dbConnect;
