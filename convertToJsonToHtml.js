const fs = require('fs');

function generateHtmlReport(jsonData) {
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>APIdog Test Report</title>
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
        <h1>APIdog Test Report</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Request Method</th>
                    <th>Request URL</th>
                    <th>Request Headers</th>
                    <th>Response Status Code</th>
                    <th>Response Headers</th>
                    <th>Response Body</th>
                </tr>
            </thead>
            <tbody>
    `;

    jsonData.item.forEach(item => {
        item.item.forEach(subItem => {
            const responseBody = subItem.response && subItem.response.body ? JSON.stringify(subItem.response.body) : '';
            const requestHeaders = subItem.request && subItem.request.header ? JSON.stringify(subItem.request.header) : '';
            const responseHeaders = subItem.response && subItem.response.header ? JSON.stringify(subItem.response.header) : '';
            htmlContent += `
                <tr>
                    <td>${subItem.id}</td>
                    <td>${subItem.name}</td>
                    <td>${subItem.request.method}</td>
                    <td>${subItem.request.url.protocol}://${subItem.request.url.host.join('/')}${subItem.request.url.path.join('/')}</td>
                    <td>${requestHeaders}</td>
                    <td>${subItem.response.code || ''}</td>
                    <td>${responseHeaders}</td>
                    <td>${responseBody}</td>
                </tr>
            `;
        });
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
    console.error('Usage: node convertToJsonToHtml.js <input.json> <output.html>');
    process.exit(1);
}

// Extract file paths from command-line arguments
const jsonFilePath = args[0];
const htmlFilePath = args[1];

// Convert JSON to HTML
convertJsonToHtml(jsonFilePath, htmlFilePath);
