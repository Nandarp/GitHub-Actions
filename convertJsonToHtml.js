const fs = require('fs');
 
// Read JSON report file
const jsonReportPath = process.env.GITHUB_WORKSPACE + '/apidog_report.json';
const reportData = JSON.parse(jsonReport);
 
// Generate HTML content
let htmlContent = `
<html>
<head>
<title>APIdog Test Report</title>
</head>
<body>
<h1>APIdog Test Report</h1>
<ul>
`;
 
reportData.tests.forEach(test => {
    htmlContent += `
<li>
<strong>${test.name}</strong>: ${test.status}
</li>
    `;
});
 
htmlContent += `
</ul>
</body>
</html>
`;
 
// Write HTML report file
fs.writeFileSync('testArtifacts/apidog_report.html', htmlContent);
 
console.log('HTML report generated successfully.');
