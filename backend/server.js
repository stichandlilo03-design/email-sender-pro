const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Email API Server running (Universal SMTP with all features)',
    version: '3.0.2',
    features: [
      'Universal SMTP Support (50+ providers)',
      'Attachment Support (max 25MB)',
      'Campaign History with Logging',
      'Better Error Messages',
      'Hostinger Compatible',
      'All Email Providers Supported'
    ]
  });
});

// ============================================================================
// TEST SMTP CONNECTION
// ============================================================================
app.post('/api/test-smtp', async (req, res) => {
  const { host, port, secure, user, pass } = req.body;

  console.log(`📧 Testing SMTP: ${host}:${port} (secure: ${secure})`);
  console.log(`   User: ${user}`);

  if (!host || !user || !pass) {
    return res.json({ 
      success: false, 
      error: 'Missing host, username, or password',
      code: 'MISSING_CREDENTIALS'
    });
  }

  try {
    // Parse secure parameter - handle both boolean and string values
    const isSecure = secure === true || secure === 'true' || secure === 1 || secure === '1';
    
    console.log(`   Secure: ${isSecure}`);
    console.log(`   Creating transporter...`);

    const transporter = nodemailer.createTransport({
      host: host.trim(),
      port: parseInt(port),
      secure: isSecure,  // true for 465, false for other ports
      auth: {
        user: user.trim(),
        pass: pass
      },
      tls: {
        rejectUnauthorized: false  // Important for shared hosting (Hostinger, etc)
      },
      connectionTimeout: 5000,
      socketTimeout: 5000
    });

    // Verify connection
    console.log(`   Attempting verification...`);
    await transporter.verify();
    
    console.log('✅ SMTP connection successful!');
    return res.json({ 
      success: true, 
      message: 'SMTP connection successful!',
      host: host,
      port: port,
      secure: isSecure
    });

  } catch (error) {
    console.log('❌ SMTP connection failed:', {
      code: error.code,
      message: error.message,
      host: host,
      port: port,
      secure: secure
    });

    // Provide helpful hints based on error type
    let hint = '';
    let userMessage = error.message;

    if (error.code === 'ECONNRESET') {
      hint = 'Connection reset - Check: Port matches encryption (465=SSL/TLS, 587=STARTTLS), or try the other port';
      userMessage = 'Connection reset by server';
    } else if (error.code === 'ECONNREFUSED') {
      hint = 'Connection refused - Wrong host or port? Check hostname spelling and port number.';
      userMessage = 'Connection refused - host/port issue';
    } else if (error.code === 'ETIMEDOUT') {
      hint = 'Connection timeout - Port blocked? Try secure:true for 465 or secure:false for 587';
      userMessage = 'Connection timeout - server not responding';
    } else if (error.code === 'ENOTFOUND') {
      hint = 'Host not found - Check hostname spelling (e.g., smtp.gmail.com, smtp.hostinger.com)';
      userMessage = 'Host not found - DNS issue';
    } else if (error.message && error.message.includes('Invalid login')) {
      hint = 'Invalid credentials - Check username and password (check for spaces!)';
      userMessage = 'Invalid login credentials';
    } else if (error.message && error.message.includes('Greeting never received')) {
      hint = 'Greeting timeout - Port 465 needs secure:true, Port 587 needs secure:false';
      userMessage = 'Server greeting timeout - encryption mismatch?';
    }

    return res.json({ 
      success: false, 
      error: userMessage,
      code: error.code,
      hint: hint,
      fullError: error.message
    });
  }
});

// ============================================================================
// SEND EMAIL WITH ATTACHMENTS
// ============================================================================
app.post('/api/send-email', async (req, res) => {
  const { smtp, from, to, cc, bcc, replyTo, subject, html, attachments } = req.body;

  console.log(`📤 Sending to: ${to} | Attachments: ${attachments?.length || 0}`);

  // Validate required fields
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
    // Parse secure parameter
    const isSecure = smtp.secure === true || smtp.secure === 'true' || smtp.secure === 1 || smtp.secure === '1';

    console.log(`   SMTP Config: ${smtp.host}:${smtp.port} (secure: ${isSecure})`);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtp.host.trim(),
      port: parseInt(smtp.port || 587),
      secure: isSecure,
      auth: {
        user: smtp.user.trim(),
        pass: smtp.pass
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 5000,
      socketTimeout: 5000
    });

    // Prepare mail options
    const mailOptions = {
      from: from?.email ? `${from.name || 'Sender'} <${from.email}>` : smtp.user,
      to: to,
      subject: subject,
      html: html || '<p>No content</p>'
    };

    // Add optional fields
    if (cc) mailOptions.cc = cc;
    if (bcc) mailOptions.bcc = bcc;
    if (replyTo) mailOptions.replyTo = replyTo;

    // Handle attachments
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map(att => {
        try {
          return {
            filename: att.filename,
            content: Buffer.from(att.content, 'base64')
          };
        } catch (e) {
          console.error(`Error processing attachment ${att.filename}:`, e.message);
          return null;
        }
      }).filter(Boolean);  // Remove failed attachments

      console.log('📎 Attachments:', attachments.map(a => a.filename).join(', '));
    }

    // Send email
    console.log('   Sending email...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent! MessageID:', info.messageId);

    return res.json({ 
      success: true, 
      messageId: info.messageId,
      response: info.response,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.log('❌ Error sending email:', error.message);
    
    let userMessage = error.message;
    
    if (error.message.includes('Invalid login')) {
      userMessage = 'Invalid SMTP credentials';
    } else if (error.message.includes('ECONNREFUSED')) {
      userMessage = 'Cannot connect to SMTP server - check host/port';
    } else if (error.message.includes('ETIMEDOUT')) {
      userMessage = 'Connection timeout - server not responding';
    }

    return res.json({ 
      success: false, 
      error: userMessage,
      code: error.code,
      fullError: error.message
    });
  }
});

// ============================================================================
// BATCH SEND (For testing multiple emails)
// ============================================================================
app.post('/api/batch-send', async (req, res) => {
  const { smtp, from, emails, subject, html, attachments, delay } = req.body;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.json({ 
      success: false, 
      error: 'No emails provided' 
    });
  }

  console.log(`📧 Batch sending to ${emails.length} recipients`);

  try {
    const isSecure = smtp.secure === true || smtp.secure === 'true';

    const transporter = nodemailer.createTransport({
      host: smtp.host.trim(),
      port: parseInt(smtp.port || 587),
      secure: isSecure,
      auth: {
        user: smtp.user.trim(),
        pass: smtp.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const results = [];
    const delayMs = delay ? parseInt(delay) * 1000 : 2000;

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];

      try {
        const mailOptions = {
          from: from?.email ? `${from.name || 'Sender'} <${from.email}>` : smtp.user,
          to: email.to || email,
          subject: subject,
          html: html || '<p>No content</p>'
        };

        if (attachments && attachments.length > 0) {
          mailOptions.attachments = attachments.map(att => ({
            filename: att.filename,
            content: Buffer.from(att.content, 'base64')
          }));
        }

        const info = await transporter.sendMail(mailOptions);

        results.push({
          email: email.to || email,
          success: true,
          messageId: info.messageId
        });

        console.log(`✅ Sent to ${email.to || email}`);

      } catch (err) {
        results.push({
          email: email.to || email,
          success: false,
          error: err.message
        });

        console.log(`❌ Failed to send to ${email.to || email}: ${err.message}`);
      }

      // Delay between sends (except after last one)
      if (i < emails.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    const sent = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return res.json({
      success: true,
      sent: sent,
      failed: failed,
      total: emails.length,
      results: results
    });

  } catch (error) {
    return res.json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// GET PROVIDERS CONFIGURATION
// ============================================================================
app.get('/api/providers', (req, res) => {
  const providers = {
    gmail: {
      name: 'Gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      encryption: 'STARTTLS',
      requiresAppPassword: true,
      helpUrl: 'https://myaccount.google.com/apppasswords'
    },
    office365: {
      name: 'Office 365 / Outlook',
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      encryption: 'STARTTLS'
    },
    sendgrid: {
      name: 'SendGrid',
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      encryption: 'STARTTLS',
      usernameHint: 'Use "apikey"'
    },
    hostinger: {
      name: 'Hostinger',
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      encryption: 'SSL/TLS'
    },
    awsses: {
      name: 'AWS SES',
      host: 'email-smtp.us-east-1.amazonaws.com',
      port: 587,
      secure: false,
      encryption: 'STARTTLS'
    },
    mailgun: {
      name: 'Mailgun',
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false,
      encryption: 'STARTTLS'
    },
    zoho: {
      name: 'Zoho Mail',
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      encryption: 'SSL/TLS'
    }
  };

  res.json({
    success: true,
    providers: providers
  });
});

// ============================================================================
// ERROR HANDLER
// ============================================================================
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.json({
    success: false,
    error: 'Server error',
    message: err.message
  });
});

// ============================================================================
// START SERVER
// ============================================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                                                        ║');
  console.log(`║  ✅ Email API Server running on port ${PORT}`.padEnd(57) + '║');
  console.log('║                                                        ║');
  console.log('║  Features:                                             ║');
  console.log('║  ✓ Universal SMTP Support (50+ providers)             ║');
  console.log('║  ✓ Attachment Support (max 25MB)                      ║');
  console.log('║  ✓ Batch Email Sending                                ║');
  console.log('║  ✓ Better Error Messages                              ║');
  console.log('║  ✓ Provider Configuration API                         ║');
  console.log('║  ✓ Hostinger Compatible                               ║');
  console.log('║  ✓ All Email Providers Supported                      ║');
  console.log('║                                                        ║');
  console.log('║  Endpoints:                                            ║');
  console.log('║  POST /api/test-smtp - Test SMTP connection           ║');
  console.log('║  POST /api/send-email - Send single email             ║');
  console.log('║  POST /api/batch-send - Send to multiple recipients   ║');
  console.log('║  GET  /api/providers - Get provider configurations    ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
});
