import nodemailer from 'nodemailer';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Create transporter using Gmail SMTP or another email service
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or another email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address (use environment variable for security)
        pass: process.env.EMAIL_PASSWORD, // Your app password (use environment variable for security)
      },
    });

    // Email content
    const mailOptions = {
      from: '"AquaNidhi" <nishitashah118@gmail.com>', // Sender address
      to: email, // Recipient email
      subject: 'AquaNidhi Verification Code', // Subject line
      html: `
        <div>
          <h1>Hello, ${username}!</h1>
          <p>Your verification code is: <strong>${verifyCode}</strong></p>
          <p>Thank you for using AquaNidhi!</p>
        </div>
      `, // HTML content of the email
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
