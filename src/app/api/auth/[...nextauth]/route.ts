import NextAuth from 'next-auth';
import { authOptions } from './options';


const handler = NextAuth({
  ...authOptions,
  secret: process.env.SECRET, 
});

export { handler as GET, handler as POST };
