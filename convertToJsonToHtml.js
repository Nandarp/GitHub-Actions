const fs = require('fs');

function generateHtmlReport(jsonData) {
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Test Cases Report</title>
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                padding: 8px;
                border: 1px solid #ddd;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <h1>API Test Cases Report</h1>
        <table>
            <thead>
                <tr>
                    <th>Test Case Name</th>
                    <th>Status</th>
                    <th>Error Message</th>
                </tr>
            </thead>
            <tbody>
    `;

    jsonData.forEach(testCase => {
        htmlContent += `
            <tr>
                <td>${testCase.name}</td>
                <td>${testCase.status}</td>
                <td>${testCase.errorMessage || '-'}</td>
            </tr>
        `;
    });

    htmlContent += `
            </tbody>
        </table>
    </body>
    </html>
    `;

    return htmlContent;
}

function convertJsonToHtml(jsonFilePath, htmlFilePath) {
    try {
        // Read JSON data from file
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

        // Generate HTML report
        const htmlContent = generateHtmlReport(jsonData);

        // Write HTML content to file
        fs.writeFileSync(htmlFilePath, htmlContent);

        console.log('JSON converted to HTML successfully.');
    } catch (error) {
        console.error('Error converting JSON to HTML:', error.message);
    }
}

// Parse command-line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
    console.error('Usage: node convertJsonToHtml.js <input.json> <output.html>');
    process.exit(1);
}

// Extract file paths from command-line arguments
const jsonFilePath = args[0];
const htmlFilePath = args[1];

// Convert JSON to HTML
convertJsonToHtml(jsonFilePath, htmlFilePath);
