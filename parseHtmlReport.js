const fs = require('fs');
const { JSDOM } = require('jsdom');

function parseHtmlReport(htmlFile) {
    const htmlContent = fs.readFileSync(htmlFile, 'utf-8');
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    // Extract relevant information from the HTML report
    // Modify this part according to the structure of your APIdog HTML report
    const requests = [];
    const rows = document.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
            const request = {
                name: cells[0].textContent.trim(),
                method: cells[1].textContent.trim(),
                url: cells[2].textContent.trim()
                // You can extract more information as needed
            };
            requests.push(request);
        }
    });

    return requests;
}

function main() {
    const htmlReportFile = `${process.env.GITHUB_WORKSPACE}/apidog-reports/apidog-report-2024-03-05-14-03-12-654-0.html`;
    const requests = parseHtmlReport(htmlReportFile);

    // Convert requests to Newman-compatible format (JSON)
    const newmanCollection = {
        info: { name: 'APIdog Collection' },
        item: requests.map(req => ({
            name: req.name,
            request: { method: req.method, url: req.url }
        }))
    };

    // Write the Newman-compatible collection to a JSON file
    const outputFile = `${process.env.GITHUB_WORKSPACE}/converted_collection.json`;
    fs.writeFileSync(outputFile, JSON.stringify(newmanCollection, null, 4));
}

main();
