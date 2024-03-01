const fs = require('fs');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmailWithAttachment(senderEmail, receiverEmail, subject, htmlReportPath) {
    try {
        // Read the HTML report
        const htmlReportContent = fs.readFileSync(htmlReportPath, 'utf-8');

        // Encode the HTML report content as base64
        const base64Content = Buffer.from(htmlReportContent).toString('base64');

        // Create the email
        const msg = {
            to: receiverEmail,
            from: senderEmail,
            subject: subject,
            html: '<p>Please find the HTML report attached.</p>',
            attachments: [
                {
                    content: base64Content,
                    filename: 'apidog_report.html',
                    type: 'text/html',
                    disposition: 'attachment',
                },
            ],
        };

        // Send the email
        await sgMail.send(msg);
        console.log('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Example usage
const senderEmail = 'ivpnotifications@products.anthology.com';
const receiverEmail = 'nandakumarap@anthology.com';
const subject = 'APIdog Test Report';
const htmlReportPath = 'testArtifacts/apidog_report.html'; // Adjust the path as per your file structure

sendEmailWithAttachment(senderEmail, receiverEmail, subject, htmlReportPath);