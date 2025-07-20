const { chromium } = require('playwright');

const urls = [
  'https://example.com/seed27',
  'https://example.com/seed28',
  'https://example.com/seed29',
  'https://example.com/seed30',
  'https://example.com/seed31',
  'https://example.com/seed32',
  'https://example.com/seed33',
  'https://example.com/seed34',
  'https://example.com/seed35',
  'https://example.com/seed36',
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let totalSum = 0;

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'networkidle' });
    // Extract numbers from all tables on page
    const pageSum = await page.$$eval('table', tables => {
      let sum = 0;
      tables.forEach(table => {
        // Get all text from table cells
        const cells = Array.from(table.querySelectorAll('td, th'));
        cells.forEach(cell => {
          // Extract numbers from cell text
          const matches = cell.textContent.match(/-?\d+(\.\d+)?/g);
          if (matches) {
            matches.forEach(num => sum += parseFloat(num));
          }
        });
      });
      return sum;
    });
    totalSum += pageSum;
  }

  console.log(`Total sum across all pages: ${totalSum}`);
  await browser.close();
})();
