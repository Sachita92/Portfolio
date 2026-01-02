const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
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
      console.log('Contact Form Submission:', { name, email, subject, message });
      return res.status(200).json({ 
        success: true, 
        message: 'Message received! (Email service not configured - message logged to console)' 
      });
    }

    // Create transporter
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

    // Email options
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

    return res.status(201).json({ success: true, message: 'Message sent successfully ✅' });

  } catch (error) {
    console.error('Error in /api/contact:', error);

    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send message', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

