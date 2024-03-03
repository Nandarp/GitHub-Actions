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
                </tr>
            </thead>
            <tbody>
    `;

    jsonData.item.forEach(item => {
        item.item.forEach(subItem => {
            htmlContent += `
                <tr>
                    <td>${subItem.id}</td>
                    <td>${subItem.name}</td>
                    <td>${subItem.request.method}</td>
                    <td>${subItem.request.url.protocol}://${subItem.request.url.host.join('/')}${subItem.request.url.path.join('/')}</td>
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
        console.error('Error converting JSON to HTML:', error);
    }
}

// Example usage
const jsonFilePath = process.argv[2];
const htmlFilePath = process.argv[3];
convertJsonToHtml(jsonFilePath, htmlFilePath);
