const { PrismaClient } = require('../src/generated/prisma');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importStudents() {
  try {
    // Delete existing students to avoid duplicates
    await prisma.student.deleteMany({});
    console.log('🗑️  Cleared existing student data');

    const csvFilePath = path.resolve('/Applications/Works/college_agent/Export for CoE and Student Details as at 2022-3-8 11-01-52.csv');
    
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found: ${csvFilePath}`);
    }

    const students = [];
    let rowCount = 0;

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv({
          skipLinesWithError: true,
          skipEmptyLines: true
        }))
        .on('data', (row) => {
          rowCount++;
          
          // Skip header rows (first 4 rows are headers/metadata)
          if (rowCount <= 3) {
            return;
          }

          // Map CSV columns to database fields
          const student = {
            providerCode: row['Provider Code'] || null,
            coeCode: row['COE Code'] || null,
            coeStatus: row['COE Status'] || null,
            coeType: row['COE Type'] || null,
            principalCoe: row['Principal CoE'] || null,
            immigrationPost: row['Immigration Post'] || null,
            providerStudentId: row['Provider Student ID'] || null,
            courtesyTitle: row['Courtesy Title'] || null,
            firstName: row['First Name'] || null,
            secondName: row['Second Name'] || null,
            familyName: row['Family Name'] || null,
            gender: row['Gender'] || null,
            dateOfBirth: row['Date Of Birth'] || null,
            countryOfBirth: row['Country Of Birth'] || null,
            nationality: row['Nationality'] || null,
            countryOfPassport: row['Country Of Passport'] || null,
            passportNumber: row['Passport Number'] || null,
            emailAddress: row['Email Address'] || null,
            mobile: row['Mobile'] || null,
            phone: row['Phone'] || null,
            studentAddressLine1: row['Student Address Line 1'] || null,
            studentAddressLine2: row['Student Address Line 2'] || null,
            studentAddressLine3: row['Student Address Line 3'] || null,
            studentAddressLine4: row['Student Address Line 4'] || null,
            studentAddressLocality: row['Student Address Locality'] || null,
            studentAddressState: row['Student Address State'] || null,
            studentAddressCountry: row['Student Address Country'] || null,
            studentAddressPostCode: row['Student Address Post Code'] || null,
            oshc: row['ProviderArrangedHealthCover (OSHC)'] || null,
            oshcStartDate: row['OSHC Start Date'] || null,
            oshcEndDate: row['OSHC End Date'] || null,
            oshcProvider: row['OSHC Provider'] || null,
            englishTestType: row['English Test Type'] || null,
            englishTestScore: row['English Test Score'] || null,
            englishTestDate: row['English Test Date'] || null,
            courseCode: row['Course Code'] || null,
            courseName: row['Course Name'] || null,
            courseSector: row['Course Sector'] || null,
            courseLevel: row['Course Level'] || null,
            durationInWeeks: row['Duration In Weeks'] || null,
            currentTotalCourseFee: row['Current Total Course Fee'] || null,
            proposedStartDate: row['Proposed Start Date'] || null,
            proposedEndDate: row['Proposed End Date'] || null,
            actualStartDate: row['Actual Start Date'] || null,
            actualEndDate: row['Actual End Date'] || null,
            totalCourseFee: row['Total Course Fee'] || null,
            prepaidCourseFee: row['Prepaid Course Fee'] || null,
            visaGranted: row['Visa Granted'] || null,
            visaGrantStatus: row['Visa Grant Status'] || null,
            visaGrantNumber: row['Visa Grant Number'] || null,
            coeCreatedDate: row['COE Created Date'] || null,
            createdBy: row['Created By'] || null,
            coeLastUpdated: row['COE Last Updated'] || null,
            locationName: row['Location Name'] || null,
            activeLocation: row['Active Location'] || null
          };

          students.push(student);
        })
        .on('end', async () => {
          try {
            console.log(`📄 Parsed ${students.length} student records from CSV`);
            
            // Use bulk insert with createMany for better performance
            const result = await prisma.student.createMany({
              data: students,
              skipDuplicates: true
            });

            console.log(`🎉 Successfully imported ${result.count} students!`);
            resolve(result.count);
          } catch (error) {
            console.error('❌ Error inserting students:', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('❌ Error reading CSV file:', error);
          reject(error);
        });
    });

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importStudents()
  .then((count) => {
    console.log(`🏁 Import completed! ${count} students added to database.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });