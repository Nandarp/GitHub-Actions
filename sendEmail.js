const fs = require('fs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const htmlReport = fs.readFileSync('testArtifacts/apidog_report.html', 'utf-8');
const msg = {
  to: 'nandakumararp@anthology.com', // Change this to the recipient's email address
  from: 'ivpnotifications@products.anthology.com', // Change this to your verified sender email in SendGrid
  subject: 'APIdog Test Report',
  text: 'APIdog test report is attached.',
  attachments: [
    {
      content: htmlReport,
      filename: 'apidog_report.html',
      type: 'text/html',
      disposition: 'attachment',
    },
  ],
};
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent successfully');
  })
  .catch((error) => {
    console.error('Error occurred while sending email:', error);
  });
