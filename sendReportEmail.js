const fs = require('fs');
const { resolve } = require('path');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmailWithAttachment(senderEmail, receiverEmail, subject, htmlReportPath) {
    try {
        // Read the HTML report
        const htmlReportContent = fs.readFileSync(htmlReportPath, 'utf-8');

        // Create the email
        const msg = {
            to: receiverEmail,
            from: senderEmail,
            subject: subject,
            html: htmlReportContent,
            attachments: [
                {
                    content: htmlReportContent,
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
const htmlReportPath = process.argv[2]; // Path to the HTML report passed as command-line argument

sendEmailWithAttachment(senderEmail, receiverEmail, subject, htmlReportPath);
