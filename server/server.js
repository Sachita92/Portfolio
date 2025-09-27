require('dotenv').config();
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use(express.static(path.join(__dirname, '..')));

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

    // Try multiple Gmail configurations
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Alternative configuration if the above fails
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   host: 'smtp.gmail.com',
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

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
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    res.status(201).json({ success: true, message: 'Message sent successfully ✅' });

  } catch (error) {
    console.error('Error in /api/contact:', error);

    // Send detailed error info for debugging
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message', 
      error: error.message || error.toString(),
      code: error.code,
      command: error.command
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
      liveUrl: "https://yourdomain.com/ecommerce",
      githubUrl: "https://github.com/Sachita92/Ecommerce-website"
    },
    {
      id: 2,
      title: "Task Manager App",
      description: "A mobile application for managing daily tasks with reminder notifications.",
      category: "app",
      tags: ["React Native", "Firebase"],
      imageUrl: "/images/projects/taskmanager.jpg",
      liveUrl: "https://expo.dev/@yourusername/taskmanager",
      githubUrl: "https://github.com/yourusername/taskmanager"
    },
    {
      id: 3,
      title: "AI Customer Support Chatbot",
      description: "An intelligent chatbot that handles customer inquiries using NLP.",
      category: "ai",
      tags: ["Python", "NLP", "TensorFlow"],
      imageUrl: "/images/projects/aichatbot.jpg",
      liveUrl: "https://huggingface.co/spaces/yourusername/chatbot",
      githubUrl: "https://github.com/yourusername/ai-chatbot"
    }
  ];
  res.json(projects);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Email configured for: ${process.env.EMAIL_USER}`);
});