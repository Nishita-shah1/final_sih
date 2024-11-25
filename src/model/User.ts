import mongoose, { Schema, Document } from "mongoose";

// Interface for individual message
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

// Schema for individual message
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

interface FishData {
  fish_name: string;
  scientific_name:string;
  date:Date;
  longitude: number;
  latitude: number;
  catchweight:number;
}
// Interface for uploaded file
interface UploadedFile {
  filename: string;
  data: FishData[];  // Use the FishData type to represent the rows
}
// Interface for user document
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessages: boolean;
  isVerified: boolean;
  messages: Message[];
  uploadedFiles?: UploadedFile[]; // Array of uploaded files (optional)
}

// Schema for user document
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify expiry code is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: false,
  },
  messages: [MessageSchema], // Reference the MessageSchema
  uploadedFiles: [
    {
      filename: {
        type: String,
        required: true,
      },
      data: { type: [String], required: true }, 
    },
  ],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
