const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test SMTP Connection
app.post('/api/test-smtp', async (req, res) => {
  const { host, port, secure, user, pass } = req.body;
  
  try {
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: secure || port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });
    
    await transporter.verify();
    res.json({ success: true, message: 'SMTP connection successful' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Send Single Email
app.post('/api/send-email', async (req, res) => {
  const { smtp, from, to, cc, bcc, replyTo, subject, html } = req.body;
  
  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: parseInt(smtp.port),
      secure: smtp.secure || smtp.port === 465,
      auth: { user: smtp.user, pass: smtp.pass },
      tls: { rejectUnauthorized: false }
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
    
    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email API Server running on port ${PORT}`);
  console.log(`Test endpoint: POST http://localhost:${PORT}/api/test-smtp`);
  console.log(`Send endpoint: POST http://localhost:${PORT}/api/send-email`);
});
