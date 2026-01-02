// Load .env file from server folder
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Debug: Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found at:', envPath);
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 .env file content (first 100 chars):', envContent.substring(0, 100));
} else {
  console.log('❌ .env file NOT found at:', envPath);
  console.log('💡 Please create a .env file in the server folder with:');
  console.log('   EMAIL_USER=your-email@gmail.com');
  console.log('   EMAIL_PASS=your-app-password');
}

console.log('EMAIL_USER:', process.env.EMAIL_USER || 'undefined');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Redirect HTTP to HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Contact form route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
        process.env.EMAIL_USER === 'your-email@gmail.com' || 
        process.env.EMAIL_PASS === 'your-app-password') {
      console.log('⚠️ Email credentials not configured. Form submission logged but not sent.');
      // Return success but log that email wasn't sent
      console.log('Contact Form Submission:', { name, email, subject, message });
      return res.status(200).json({ 
        success: true, 
        message: 'Message received! (Email service not configured - message logged to console)' 
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('Attempting to verify SMTP connection...');
    await transporter.verify();
    console.log('SMTP verified ✅');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        <hr>
        <p><em>Sent from sachitasigdel.com.np</em></p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    res.status(201).json({ success: true, message: 'Message sent successfully ✅' });

  } catch (error) {
    console.error('Error in /api/contact:', error);

    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Projects route
app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A fully responsive e-commerce website with product management and payment integration.",
      category: "web",
      tags: ["HTML/CSS", "JavaScript", "PHP"],
      imageUrl: "/images/projects/ecommerce.jpg",
      liveUrl: "https://sachitasigdel.com.np/ecommerce",
      githubUrl: "https://github.com/Sachita92/Ecommerce-website"
    },
    {
      id: 2,
      title: "PredictDuel",
      description: "A social prediction market platform built on Solana blockchain, enabling users to create and participate in prediction markets with real-time data synchronization and on-chain transactions.",
      category: "web",
      tags: ["Solana", "React", "Next.js", "TypeScript", "Web3"],
      imageUrl: "/images/projects/predictduel.jpg",
      liveUrl: "https://predictduel-vxdh.vercel.app/",
      githubUrl: "https://github.com/Sachita92/predictduel"
    },
    {
      id: 3,
      title: "AI Customer Support Chatbot",
      description: "An intelligent chatbot that handles customer inquiries using NLP.",
      category: "ai",
      tags: ["Python", "NLP"],
      imageUrl: "/images/projects/aichatbot.jpg",
      liveUrl: "https://huggingface.co/spaces/sachita/chatbot",
      githubUrl: "https://github.com/Sachita98/ai-chatbot"
    }
  ];
  res.json(projects);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
// For production with reverse proxy (nginx), just listen on PORT
// The reverse proxy handles SSL termination
app.listen(PORT, '0.0.0.0', () => {
  const env = process.env.NODE_ENV || 'development';
  console.log(`🚀 Server running on port ${PORT} (${env})`);
  console.log(`📧 Email configured for: ${process.env.EMAIL_USER || 'NOT SET'}`);
  console.log(`🌐 Server ready to accept requests`);
});

