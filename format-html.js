const fs = require('fs').promises;
const prettier = require('prettier');

async function formatHtml() {
  try {
    // Read raw HTML data
    const rawData = await fs.readFile('testArtifacts/apidog_report.html', 'utf8');

    // Format HTML using prettier
    const formattedHtml = prettier.format(rawData, {
      parser: 'html',
      printWidth: 120, // Adjust print width as needed
    });

    // Write formatted HTML to a new file
    await fs.writeFile('pretty.html', formattedHtml);

    console.log('HTML formatting complete!');
  } catch (error) {
    console.error('Error formatting HTML:', error);
    process.exit(1); // Exit with error status
  }
}

formatHtml();
