const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Email API Server running (Universal SMTP Support)' });
});

// Test SMTP Connection
app.post('/api/test-smtp', async (req, res) => {
  const { host, port, secure, user, pass } = req.body;

  console.log(`📧 Testing SMTP: ${host}:${port} (secure: ${secure})`);

  if (!host || !user || !pass) {
    return res.json({ 
      success: false, 
      error: 'Missing host, username, or password' 
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: secure === true || secure === 'true',
      auth: {
        user,
        pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    await transporter.verify();
    
    console.log('✅ SMTP connection successful!');
    return res.json({ 
      success: true, 
      message: 'SMTP connection successful!' 
    });
  } catch (error) {
    console.log('❌ SMTP connection failed:', error.message);
    return res.json({ 
      success: false, 
      error: error.message || 'SMTP connection failed' 
    });
  }
});

// Send Email with Attachments (Universal SMTP)
app.post('/api/send-email', async (req, res) => {
  const { smtp, from, to, cc, bcc, replyTo, subject, html, attachments } = req.body;

  console.log(`📤 Sending to: ${to} | Attachments: ${attachments?.length || 0}`);

  if (!smtp || !smtp.host || !smtp.user || !smtp.pass) {
    return res.json({ 
      success: false, 
      error: 'Missing SMTP credentials (host, user, pass)' 
    });
  }

  if (!to || !subject || !html) {
    return res.json({ 
      success: false, 
      error: 'Missing to, subject, or html' 
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: parseInt(smtp.port || 587),
      secure: smtp.secure === true || smtp.secure === 'true',
      auth: {
        user: smtp.user,
        pass: smtp.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: from?.email ? `${from.name || 'Sender'} <${from.email}>` : smtp.user,
      to,
      subject,
      html: html || '<p>No content</p>'
    };

    if (cc) mailOptions.cc = cc;
    if (bcc) mailOptions.bcc = bcc;
    if (replyTo) mailOptions.replyTo = replyTo;

    // Handle attachments
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map(att => ({
        filename: att.filename,
        content: Buffer.from(att.content, 'base64')
      }));
      console.log('📎 Attachments:', attachments.map(a => a.filename).join(', '));
    }

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Sent! MessageID:', info.messageId);
    return res.json({ 
      success: true, 
      messageId: info.messageId,
      response: info.response 
    });
  } catch (error) {
    console.log('❌ Error:', error.message);
    return res.json({ 
      success: false, 
      error: error.message || 'Failed to send email' 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Email API running on port ${PORT}`);
  console.log(`📧 Universal SMTP support enabled`);
  console.log(`📎 Attachment support enabled`);
});
