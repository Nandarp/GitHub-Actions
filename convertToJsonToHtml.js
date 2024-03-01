const fs = require('fs');

function convertJsonToHtml(jsonFilePath, htmlFilePath) {
    try {
        // Read JSON data from file
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

        // Convert JSON to HTML format
        let htmlContent = '<html><head><title>APIdog Test Report</title></head><body>';
        htmlContent += '<h1>APIdog Test Report</h1>';
        htmlContent += '<pre>' + JSON.stringify(jsonData, null, 2) + '</pre>'; // Convert JSON to preformatted text
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
