const sgMail = require('@sendgrid/mail');
const fs = require('fs');
 
// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 
// Read the file and encode its content to base64
const attachmentContent = fs.readFileSync('path/to/example.txt', { encoding: 'base64' });
 
// Define the email message
const msg = {
  to: 'recipient@example.com',
  from: 'sender@example.com',
  subject: 'Email with Attachment',
  text: 'See attached file',
  attachments: [
    {
      content: attachmentContent,
      filename: 'example.txt',
      type: 'text/plain',
      disposition: 'attachment',
    },
  ],
};
 
// Send the email
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch((error) => {
    console.error(error.toString());
  });