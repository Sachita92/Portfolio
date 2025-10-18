require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing Gmail credentials...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Present' : 'Missing');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Gmail Auth Failed:', error.message);
  } else {
    console.log('✅ Gmail Auth Successful');
  }
});