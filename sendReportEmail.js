const fs = require('fs');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmailWithAttachment(senderEmail, receiverEmail, subject, htmlReportPath) {
    try {
        // Read the HTML report
        const htmlReportContent = fs.readFileSync(htmlReportPath, 'utf-8');

        // Encode the HTML report content as base64
        const base64Content = Buffer.from(htmlReportContent).toString('base64');

        // Generate a unique filename for the report
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const reportFilename = `apidog_report_${timestamp}.html`;

        // Save the report with the unique filename in the testArtifacts folder
        const reportPath = `testArtifacts/${reportFilename}`;
        fs.writeFileSync(reportPath, htmlReportContent, 'utf-8');

        // Create the email body with the HTML report attached
        const emailBody = `
            <p>Hi team,</p>
            <p>Please find report for the latest APIdog test execution attached.</p>
            <p>Regards,<br>GitHub Actions</p>
        `;

        // Create the email
        const msg = {
            to: receiverEmail,
            from: senderEmail,
            subject: subject,
            html: emailBody,
            attachments: [
                {
                    content: base64Content,
                    filename: reportFilename,
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
