const fs = require('fs');

function convertJsonToHtml(jsonFilePath, htmlFilePath) {
    try {
        // Read the JSON report file
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

        // Create HTML content
        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    /* Add your CSS styles here */
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>APIdog Test Report</h1>
                <h2>Execution Summary</h2>
                <p>Total Test Cases: ${jsonData.item.length}</p>
                <p>Passed: ${jsonData.item.filter(testItem => testItem.response && testItem.response.length > 0 && testItem.response[0].code === 200).length}</p>
                <p>Failed: ${jsonData.item.filter(testItem => !testItem.response || testItem.response.length === 0 || testItem.response[0].code !== 200).length}</p>
                <h2>Test Details</h2>
                <table>
                    <tr>
                        <th>Test Case Name</th>
                        <th>Request Method</th>
                        <th>Request URL</th>
                        <th>Response Code</th>
                    </tr>
        `;

        // Add test details to HTML content
        jsonData.item.forEach(testItem => {
            const testName = testItem.name;
            const requestMethod = testItem.request ? testItem.request.method : 'N/A';
            const requestUrl = testItem.request ? testItem.request.url.protocol + "://" + testItem.request.url.host.join("/") + "/" + testItem.request.url.path.join("/") : 'N/A';
            const responseCode = testItem.response && testItem.response.length > 0 ? testItem.response[0].code : 'N/A';

            htmlContent += `
                <tr>
                    <td>${testName}</td>
                    <td>${requestMethod}</td>
                    <td>${requestUrl}</td>
                    <td>${responseCode}</td>
                </tr>
            `;
        });

        // Close HTML content
        htmlContent += `
                </table>
            </body>
            </html>
        `;

        // Write HTML content to file
        fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');

        console.log('JSON report converted to HTML successfully.');
    } catch (error) {
        console.error('Error converting JSON to HTML:', error);
    }
}

// Example usage
const jsonFilePath = 'testArtifacts/apidog_report.json';
const htmlFilePath = 'testArtifacts/apidog_report.html';

convertJsonToHtml(jsonFilePath, htmlFilePath);
