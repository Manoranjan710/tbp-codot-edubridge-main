const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

async function debugCSV() {
  const csvFilePath = path.resolve('../Export for CoE and Student Details as at 2022-3-8 11-01-52.csv');
  
  let rowCount = 0;
  
  fs.createReadStream(csvFilePath)
    .pipe(csv({
      skipLinesWithError: true,
      skipEmptyLines: true
    }))
    .on('data', (row) => {
      rowCount++;
      
      if (rowCount <= 5) {
        console.log(`Row ${rowCount}:`);
        console.log('Keys:', Object.keys(row));
        console.log('First Name:', row['First Name']);
        console.log('Family Name:', row['Family Name']);
        console.log('Provider Code:', row['Provider Code']);
        console.log('COE Code:', row['COE Code']);
        console.log('Email Address:', row['Email Address']);
        console.log('---');
      }
      
      if (rowCount >= 5) {
        process.exit(0);
      }
    })
    .on('error', (error) => {
      console.error('Error:', error);
    });
}

debugCSV();