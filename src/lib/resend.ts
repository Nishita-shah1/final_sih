import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config(); 
type ConnectionObject = {
  isConnected?: number;
};




export const resend = new Resend("re_5tq3PbHB_3z3yxJrV8dbMx1Fo8Hx17BZf");

