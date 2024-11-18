import { Resend } from 'resend';

const resend = new Resend("re_5tq3PbHB_3z3yxJrV8dbMx1Fo8Hx17BZf");

async function sendEmail() {
  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'nishita182005@gmail.com',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendEmail();
