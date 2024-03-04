const fs = require('fs');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmailWithAttachment(senderEmail, receiverEmail, subject, htmlReportPath) {
    try {
        // Read the HTML report
        const htmlReportContent = fs.readFileSync(htmlReportPath, 'utf-8');

        // Read the JSON report
        const jsonReportContent = fs.readFileSync('testArtifacts/apidog_report.json', 'utf-8');
        const jsonData = JSON.parse(jsonReportContent);

        // Extract detailed execution summary from the JSON report
        const executionDetails = jsonData.item.map(testItem => {
            const testName = testItem.name;
            const requestMethod = testItem.request ? testItem.request.method : 'N/A';
            const requestUrl = testItem.request ? testItem.request.url.protocol + "://" + testItem.request.url.host.join("/") + "/" + testItem.request.url.path.join("/") : 'N/A';
            const requestHeaders = testItem.request && testItem.request.header ? JSON.stringify(testItem.request.header) : 'N/A';
            const requestBody = testItem.request && testItem.request.body ? JSON.stringify(testItem.request.body) : 'N/A';
            const responseCode = testItem.response && testItem.response.length > 0 ? testItem.response[0].code : 'N/A';
            const responseHeaders = testItem.response && testItem.response.length > 0 && testItem.response[0].header ? JSON.stringify(testItem.response[0].header) : 'N/A';
            const responseBody = testItem.response && testItem.response.length > 0 && testItem.response[0].body ? JSON.stringify(testItem.response[0].body) : 'N/A';

            return `
                <tr>
                    <td>${testName}</td>
                    <td>${requestMethod}</td>
                    <td>${requestUrl}</td>
                    <td>${requestHeaders}</td>
                    <td>${requestBody}</td>
                    <td>${responseCode}</td>
                    <td>${responseHeaders}</td>
                    <td>${responseBody}</td>
                </tr>
            `;
        }).join('');

        // Create the email body with the HTML report attached
        const emailBody = `
            <p>Hi team,</p>
            <p>Please find report for the latest APIdog test execution attached.</p>
            <p>Detailed Execution Summary:</p>
            <table>
                <tr>
                    <th>Test Case Name</th>
                    <th>Request Method</th>
                    <th>Request URL</th>
                    <th>Request Headers</th>
                    <th>Request Body</th>
                    <th>Response Code</th>
                    <th>Response Headers</th>
                    <th>Response Body</th>
                </tr>
                ${executionDetails}
            </table>
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
                    content: Buffer.from(htmlReportContent).toString('base64'),
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
