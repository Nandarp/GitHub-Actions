const fs = require('fs');

function convertJsonToHtml(jsonFilePath, htmlFilePath) {
    try {
        // Read JSON data from file
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

        // Convert JSON to HTML format
        let htmlContent = '<html><head><title>APIdog Test Report</title></head><body>';
        htmlContent += '<h1>APIdog Test Report</h1>';
        htmlContent += '<table border="1">';
        htmlContent += '<tr><th>ID</th><th>Name</th><th>Request Method</th><th>Request URL</th></tr>';
        jsonData.item.forEach(item => {
            item.item.forEach(subItem => {
                htmlContent += `<tr><td>${subItem.id}</td><td>${subItem.name}</td><td>${subItem.request.method}</td><td>${subItem.request.url.protocol}://${subItem.request.url.host.join('/')}${subItem.request.url.path.join('/')}</td></tr>`;
            });
        });
        htmlContent += '</table>';
        htmlContent += '</body></html>';

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
