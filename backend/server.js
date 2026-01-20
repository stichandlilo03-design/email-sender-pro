const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Email API Server is running' });
});

// Test SMTP Connection
app.post('/api/test-smtp', async (req, res) => {
  const { host, port, secure, user, pass } = req.body;
  
  console.log('📧 Testing SMTP:', { host, port, secure, user: user ? '***' : 'missing' });
  
  if (!host || !user || !pass) {
    console.log('❌ Missing credentials');
    return res.json({ success: false, error: 'Missing host, user, or password' });
  }
  
  try {
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port) || 587,
      secure: secure || parseInt(port) === 465,
      auth: { user, pass },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
      tls: { 
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      debug: true,
      logger: true
    });
    
    console.log('⏳ Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP Connected successfully!');
    res.json({ success: true, message: 'SMTP connection successful' });
  } catch (error) {
    console.log('❌ SMTP Error:', error.message);
    res.json({ success: false, error: error.message });
  }
});

// Send Single Email
app.post('/api/send-email', async (req, res) => {
  const { smtp, from, to, cc, bcc, replyTo, subject, html } = req.body;
  
  console.log('📤 Sending email to:', to);
  
  if (!smtp || !from || !to || !subject) {
    console.log('❌ Missing required fields');
    return res.json({ success: false, error: 'Missing required fields' });
  }
  
  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: parseInt(smtp.port) || 587,
      secure: smtp.secure || parseInt(smtp.port) === 465,
      auth: { user: smtp.user, pass: smtp.pass },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
      tls: { 
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      }
    });
    
    const mailOptions = {
      from: `"${from.name}" <${from.email}>`,
      to,
      subject,
      html
    };
    
    if (cc) mailOptions.cc = cc;
    if (bcc) mailOptions.bcc = bcc;
    if (replyTo) mailOptions.replyTo = replyTo;
    
    console.log('⏳ Sending...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.log('❌ Send Error:', error.message);
    res.json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Email API Server running on port ${PORT}`);
  console.log(`📧 Test SMTP: POST /api/test-smtp`);
  console.log(`📤 Send Email: POST /api/send-email`);
  console.log(`💚 Health: GET /`);
});
