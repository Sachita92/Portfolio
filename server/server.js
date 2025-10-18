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
      title: "Task Manager App",
      description: "A mobile application for managing daily tasks with reminder notifications.",
      category: "app",
      tags: ["React Native", "Firebase"],
      imageUrl: "/images/projects/taskmanager.jpg",
      liveUrl: "https://expo.dev/@sachita/taskmanager",
      githubUrl: "https://github.com/Sachita98/taskmanager"
    },
    {
      id: 3,
      title: "AI Customer Support Chatbot",
      description: "An intelligent chatbot that handles customer inquiries using NLP.",
      category: "ai",
      tags: ["Python", "NLP", "TensorFlow"],
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

// Start servers
if (process.env.NODE_ENV === 'production') {
  // Production: HTTPS server
  try {
    const options = {
      key: fs.readFileSync('/etc/ssl/private/sachitasigdel.com.np.key'),
      cert: fs.readFileSync('/etc/ssl/certs/sachitasigdel.com.np.pem')
    };

    https.createServer(options, app).listen(HTTPS_PORT, '0.0.0.0', () => {
      console.log(`🚀 HTTPS Server running on port ${HTTPS_PORT}`);
      console.log(`Email configured for: ${process.env.EMAIL_USER}`);
    });

    // Also start HTTP server for redirects
    http.createServer((req, res) => {
      res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
      res.end();
    }).listen(80, '0.0.0.0', () => {
      console.log('🔄 HTTP redirect server running on port 80');
    });

  } catch (error) {
    console.error('❌ Failed to start HTTPS server:', error.message);
    console.log('🔄 Falling back to HTTP server...');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 HTTP Server running on port ${PORT}`);
      console.log(`Email configured for: ${process.env.EMAIL_USER}`);
    });
  }
} else {
  // Development: HTTP server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀Server running on port ${PORT}`);
    console.log(`Email configured for: ${process.env.EMAIL_USER}`);
  });
}
