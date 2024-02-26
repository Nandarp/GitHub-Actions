const fs = require('fs');
const prettier = require('prettier');

// Read raw HTML data
const rawData = fs.readFileSync('testArtifacts\apidog_report.html', 'utf8');

// Format HTML using prettier
const formattedHtml = prettier.format(rawData, {
  parser: 'html',
  printWidth: 120, // Adjust print width as needed
});

// Write formatted HTML to a new file
fs.writeFileSync('pretty.html', formattedHtml);

console.log('HTML formatting complete!');
