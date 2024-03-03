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
        const executionSummary = jsonData.item.map(testItem => {
            const testName = testItem.name;
            const requestMethod = testItem.request ? testItem.request.method : 'N/A';
            const requestUrl = testItem.request ? testItem.request.url.protocol + "://" + testItem.request.url.host.join("/") + "/" + testItem.request.url.path.join("/") : 'N/A';
            const responseCode = testItem.response && testItem.response.length > 0 ? testItem.response[0].code : 'N/A';
            return `<tr><td>${testName}</td><td>${requestMethod}</td><td>${requestUrl}</td><td>${responseCode}</td></tr>`;
        }).join('');

        // Generate overall execution summary
        const totalTestCases = jsonData.item.length;
        const passedTestCases = jsonData.item.filter(testItem => testItem.response && testItem.response.length > 0 && testItem.response[0].code === 200).length;
        const failedTestCases = totalTestCases - passedTestCases;

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
                    <th>Response Code</th>
                </tr>
                ${executionSummary}
            </table>
            <p>Overall Execution Summary:</p>
            <p>Total Test Cases: ${totalTestCases}</p>
            <p>Passed: ${passedTestCases}</p>
            <p>Failed: ${failedTestCases}</p>
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
        console.error('Error sending email:', erro
