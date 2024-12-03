// types/User.ts
import { User as NextAuthUser } from 'next-auth';

// Extend the next-auth User type to include your additional fields
export interface User extends NextAuthUser {
  _id: string; // Add the _id property to match the database user
  username: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  // Add any other custom properties you need
}
