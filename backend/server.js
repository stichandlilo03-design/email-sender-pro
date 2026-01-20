const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Email API Server running (with Attachments)' });
});

// Test API Connection
app.post('/api/test-smtp', async (req, res) => {
  const { user, pass } = req.body;
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
      console.log('✅ Resend API key is valid!');
      return res.json({ success: true, message: 'API key valid!' });
    }
    
    if (data.id) {
      console.log('✅ Resend connected!');
      return res.json({ success: true, message: 'Resend API connected!' });
    }
    
    if (data.statusCode === 401) {
      return res.json({ success: false, error: 'Invalid API key' });
    }
    
    res.json({ success: true, message: 'Resend API connected!' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Send Email with Attachments
app.post('/api/send-email', async (req, res) => {
  const { smtp, from, to, cc, bcc, replyTo, subject, html, attachments } = req.body;
  
  const apiKey = smtp?.pass || process.env.RESEND_API_KEY;
  
  console.log('📤 Sending to:', to, '| Attachments:', attachments?.length || 0);
  
  if (!apiKey) return res.json({ success: false, error: 'Missing API key' });
  if (!to || !subject) return res.json({ success: false, error: 'Missing to/subject' });
  
  try {
    const emailData = {
      from: from?.email ? `${from.name || 'Sender'} <${from.email}>` : 'onboarding@resend.dev',
      to,
      subject,
      html: html || '<p>No content</p>'
    };
    
    if (cc) emailData.cc = cc;
    if (bcc) emailData.bcc = bcc;
    if (replyTo) emailData.reply_to = replyTo;
    
    // Add attachments
    if (attachments?.length > 0) {
      emailData.attachments = attachments.map(att => ({
        filename: att.filename,
        content: att.content
      }));
      console.log('📎 Attachments:', attachments.map(a => a.filename).join(', '));
    }
    
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
      console.log('✅ Sent! ID:', data.id);
      return res.json({ success: true, messageId: data.id });
    }
    
    console.log('❌ Error:', data);
    res.json({ success: false, error: data.message || 'Failed' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Email API running on port ${PORT}`);
  console.log(`📎 Attachment support enabled`);
});
