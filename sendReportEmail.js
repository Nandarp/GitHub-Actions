const fs = require('fs');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmailWithAttachment(senderEmail, receiverEmail, subject, htmlReportPath) {
    try {
        // Read the HTML report
        const htmlReportContent = fs.readFileSync(htmlReportPath, 'utf-8');

        // Calculate overall execution summary
        const totalTestCases = htmlReportContent.match(/<tr/g).length - 1; // Subtract 1 for the header row
        const passedTestCases = (htmlReportContent.match(/<td>Passed<\/td>/g) || []).length;
        const failedTestCases = (htmlReportContent.match(/<td>Failed<\/td>/g) || []).length;
        const pendingTestCases = (htmlReportContent.match(/<td>Pending<\/td>/g) || []).length;

        // Generate overall execution summary
        const summary = `
            <p>Total Test Cases: ${totalTestCases}</p>
            <p>Passed: ${passedTestCases}</p>
            <p>Failed: ${failedTestCases}</p>
            <p>Pending: ${pendingTestCases}</p>
        `;

        // Encode the HTML report content as base64
        const base64Content = Buffer.from(htmlReportContent).toString('base64');

        // Create the email body with the HTML report attached
        const emailBody = `
            <p>Hi team,</p>
            <p>Please find report for the latest APIdog test execution attached.</p>
            ${summary}
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
