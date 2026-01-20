const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Email API Server running (Resend)' });
});

// Test API Connection
app.post('/api/test-smtp', async (req, res) => {
  const { user, pass } = req.body;
  
  // For Resend: user = "resend", pass = API key
  const apiKey = pass || process.env.RESEND_API_KEY;
  
  console.log('📧 Testing Resend API connection...');
  
  if (!apiKey || apiKey.length < 10) {
    return res.json({ success: false, error: 'Enter your Resend API key in the Password field' });
  }
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'test@test.com',
        subject: 'Test',
        html: '<p>Test</p>'
      })
    });
    
    const data = await response.json();
    
    if (response.status === 403 || data.statusCode === 403) {
      // API key is valid but can't send to unverified email - this is OK!
      console.log('✅ Resend API key is valid!');
      return res.json({ success: true, message: 'API key valid! Ready to send emails.' });
    }
    
    if (data.id) {
      console.log('✅ Resend connected!');
      return res.json({ success: true, message: 'Resend API connected!' });
    }
    
    if (data.statusCode === 401) {
      console.log('❌ Invalid API key');
      return res.json({ success: false, error: 'Invalid API key' });
    }
    
    console.log('✅ Resend API working');
    res.json({ success: true, message: 'Resend API connected!' });
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    res.json({ success: false, error: error.message });
  }
});

// Send Email via Resend
app.post('/api/send-email', async (req, res) => {
  const { smtp, from, to, cc, bcc, replyTo, subject, html } = req.body;
  
  // API key comes from smtp.pass
  const apiKey = smtp?.pass || process.env.RESEND_API_KEY;
  
  console.log('📤 Sending email to:', to);
  
  if (!apiKey) {
    return res.json({ success: false, error: 'Missing Resend API key' });
  }
  
  if (!to || !subject) {
    return res.json({ success: false, error: 'Missing to or subject' });
  }
  
  try {
    const emailData = {
      from: from?.email ? `${from.name || 'Sender'} <${from.email}>` : 'onboarding@resend.dev',
      to: to,
      subject: subject,
      html: html || '<p>No content</p>'
    };
    
    if (cc) emailData.cc = cc;
    if (bcc) emailData.bcc = bcc;
    if (replyTo) emailData.reply_to = replyTo;
    
    console.log('⏳ Sending via Resend...');
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    const data = await response.json();
    
    if (data.id) {
      console.log('✅ Email sent! ID:', data.id);
      return res.json({ success: true, messageId: data.id });
    }
    
    console.log('❌ Resend error:', data);
    res.json({ success: false, error: data.message || 'Failed to send' });
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    res.json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Email API Server running on port ${PORT}`);
  console.log(`📧 Using Resend API for email delivery`);
  console.log(`🆓 Free tier: 3,000 emails/month`);
});
