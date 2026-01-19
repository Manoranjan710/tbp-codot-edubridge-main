const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

async function debugCSVWithSkip() {
  const csvFilePath = path.resolve('../Export for CoE and Student Details as at 2022-3-8 11-01-52.csv');
  
  let rowCount = 0;
  
  fs.createReadStream(csvFilePath)
    .pipe(csv({
      skipLinesWithError: true,
      skipEmptyLines: true,
      skipHeader: false,
      // Skip first 3 lines by manually handling headers
      headers: false
    }))
    .on('headers', (headers) => {
      console.log('Headers detected:', headers);
    })
    .on('data', (row) => {
      rowCount++;
      
      if (rowCount <= 8) {
        console.log(`Row ${rowCount}:`);
        console.log('Raw row:', Object.keys(row).length > 5 ? 'Many columns' : row);
        if (Object.keys(row).length > 5) {
          console.log('First few values:', Object.values(row).slice(0, 5));
        }
        console.log('---');
      }
      
      if (rowCount >= 8) {
        process.exit(0);
      }
    })
    .on('error', (error) => {
      console.error('Error:', error);
    });
}

debugCSVWithSkip();