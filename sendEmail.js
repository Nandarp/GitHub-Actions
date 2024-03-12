const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');
 
// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 
// Construct the path to the directory where artifacts are stored
const artifactsDirectory = path.join(process.env.GITHUB_WORKSPACE, 'apidog-reports');
 
// Read the contents of the directory
const files = fs.readdirSync(artifactsDirectory);
 
// Find the file with the name starting with "apidog-report-"
const reportFile = files.find(file => file.startsWith('apidog-report-'));
 
if (reportFile) {
    // Construct the path to the JSON report file
    const jsonReportPath = path.join(artifactsDirectory, reportFile);
 
    // Construct the command to run Newman
    const newmanCommand = `newman run ${jsonReportPath} --reporters cli,htmlextra --reporter-htmlextra-export newman-report.html`;
    // Run Newman command
    const { execSync } = require('child_process');
    try {
        execSync(newmanCommand, { stdio: 'inherit' });
        console.log('Newman HTML report generated successfully.');
 
        // Construct the path to the HTML report generated by Newman
        const newmanReportPath = path.join(process.env.GITHUB_WORKSPACE, 'newman-report.html');
 
        // Read the HTML report
        const htmlReport = fs.readFileSync(newmanReportPath, 'utf-8');
 
        // Encode the HTML report content as base64
        const base64Content = Buffer.from(htmlReport).toString('base64');
 
        // Construct the email message
        const msg = {
            to: 'nandakumarap@anthology.com', // Change this to the recipient's email address
            from: 'ivpnotifications@products.anthology.com', // Change this to your verified sender email in SendGrid
            subject: 'APIdog Test Report',
            text: 'APIdog test report is attached.',
            attachments: [
                {
                    content: base64Content, // Encode content as base64
                    filename: 'newman_report.html',
                    type: 'text/html',
                    disposition: 'attachment',
                },
            ],
        };
 
        // Send email
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent successfully');
            })
            .catch((error) => {
                console.error('Error occurred while sending email:', error.response?.body || error.message);
            });
    } catch (error) {
        console.error('Error generating Newman HTML report:', error);
    }
} else {
    console.error('No report file found.');
}
