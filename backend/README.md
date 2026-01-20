# Email Sender Backend

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

Server runs on http://localhost:3001

## API Endpoints

### POST /api/test-smtp
Test SMTP connection.

Request body:
```json
{
  "host": "smtp.gmail.com",
  "port": 587,
  "secure": false,
  "user": "your@email.com",
  "pass": "your-app-password"
}
```

### POST /api/send-email
Send an email.

Request body:
```json
{
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "user": "your@email.com",
    "pass": "your-app-password"
  },
  "from": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "to": "recipient@example.com",
  "subject": "Hello",
  "html": "<p>Email content here</p>"
}
```

## Gmail Setup
For Gmail, use an App Password:
1. Enable 2FA on your Google account
2. Go to Google Account > Security > App passwords
3. Generate a new app password for "Mail"
4. Use that password in the SMTP config

## Office 365 Setup
Use your regular email and password, or app password if 2FA is enabled.
Host: smtp.office365.com
Port: 587
