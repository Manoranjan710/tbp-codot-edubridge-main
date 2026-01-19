const { PrismaClient } = require('../src/generated/prisma');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function import400StudentsFromDebug() {
  try {
    // Don't clear existing data - just add to it
    console.log('🚀 Starting import of 400 students...');

    const csvFilePath = path.resolve('../Export for CoE and Student Details as at 2022-3-8 11-01-52.csv');
    
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found: ${csvFilePath}`);
    }

    const students = [];
    let rowCount = 0;
    let validHeaders = null;

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv({
          skipLinesWithError: true,
          skipEmptyLines: true,
          skipHeader: false,
          headers: false
        }))
        .on('data', (row) => {
          rowCount++;
          
          // Find the actual header row (should be around row 1)
          if (rowCount === 1) {
            const rowValues = Object.values(row);
            if (rowValues.includes('Provider Code') || rowValues.includes('COE Code')) {
              validHeaders = rowValues;
              console.log('Found valid headers at row', rowCount);
              console.log('Headers:', validHeaders.slice(0, 10).join(', '), '...');
              return;
            }
          }
          
          // Skip until we have headers
          if (!validHeaders) {
            return;
          }
          
          // We want the last 400 records, so let's collect all data rows first
          const rowValues = Object.values(row);
          if (rowValues.length >= validHeaders.length && rowValues[0] && rowValues[0] !== 'Provider Code') {
            students.push({
              rowNumber: rowCount,
              values: rowValues
            });
          }
        })
        .on('end', async () => {
          try {
            console.log(`📄 Total data rows found: ${students.length}`);
            
            // Get the last 400 records
            const last400 = students.slice(-400);
            console.log(`🎯 Processing last ${last400.length} records...`);
            
            let inserted = 0;
            
            for (const studentRow of last400) {
              // Generate random agentId between 1-12
              const randomAgentId = Math.floor(Math.random() * 12) + 1;
              
              // Map values to student object
              const student = {
                agentId: randomAgentId
              };
              
              validHeaders.forEach((header, index) => {
                const value = studentRow.values[index] || null;
                const emptyValue = (value === '' || value === undefined) ? null : value;
                
                switch (header?.trim()) {
                  case 'Provider Code':
                    student.providerCode = emptyValue;
                    break;
                  case 'COE Code':
                    student.coeCode = emptyValue;
                    break;
                  case 'COE Status':
                    student.coeStatus = emptyValue;
                    break;
                  case 'COE Type':
                    student.coeType = emptyValue;
                    break;
                  case 'Principal CoE':
                    student.principalCoe = emptyValue;
                    break;
                  case 'Immigration Post':
                    student.immigrationPost = emptyValue;
                    break;
                  case 'Provider Student ID':
                    student.providerStudentId = emptyValue;
                    break;
                  case 'Courtesy Title':
                    student.courtesyTitle = emptyValue;
                    break;
                  case 'First Name':
                    student.firstName = emptyValue;
                    break;
                  case 'Second Name':
                    student.secondName = emptyValue;
                    break;
                  case 'Family Name':
                    student.familyName = emptyValue;
                    break;
                  case 'Gender':
                    student.gender = emptyValue;
                    break;
                  case 'Date Of Birth':
                    student.dateOfBirth = emptyValue;
                    break;
                  case 'Country Of Birth':
                    student.countryOfBirth = emptyValue;
                    break;
                  case 'Nationality':
                    student.nationality = emptyValue;
                    break;
                  case 'Country Of Passport':
                    student.countryOfPassport = emptyValue;
                    break;
                  case 'Passport Number':
                    student.passportNumber = emptyValue;
                    break;
                  case 'Email Address':
                    student.emailAddress = emptyValue;
                    break;
                  case 'Mobile':
                    student.mobile = emptyValue;
                    break;
                  case 'Phone':
                    student.phone = emptyValue;
                    break;
                  case 'Student Address Line 1':
                    student.studentAddressLine1 = emptyValue;
                    break;
                  case 'Student Address Line 2':
                    student.studentAddressLine2 = emptyValue;
                    break;
                  case 'Student Address Line 3':
                    student.studentAddressLine3 = emptyValue;
                    break;
                  case 'Student Address Line 4':
                    student.studentAddressLine4 = emptyValue;
                    break;
                  case 'Student Address Locality':
                    student.studentAddressLocality = emptyValue;
                    break;
                  case 'Student Address State':
                    student.studentAddressState = emptyValue;
                    break;
                  case 'Student Address Country':
                    student.studentAddressCountry = emptyValue;
                    break;
                  case 'Student Address Post Code':
                    student.studentAddressPostCode = emptyValue;
                    break;
                  case 'ProviderArrangedHealthCover (OSHC)':
                    student.oshc = emptyValue;
                    break;
                  case 'OSHC Start Date':
                    student.oshcStartDate = emptyValue;
                    break;
                  case 'OSHC End Date':
                    student.oshcEndDate = emptyValue;
                    break;
                  case 'OSHC Provider':
                    student.oshcProvider = emptyValue;
                    break;
                  case 'English Test Type':
                    student.englishTestType = emptyValue;
                    break;
                  case 'English Test Score':
                    student.englishTestScore = emptyValue;
                    break;
                  case 'English Test Date':
                    student.englishTestDate = emptyValue;
                    break;
                  case 'Course Code':
                    student.courseCode = emptyValue;
                    break;
                  case 'Course Name':
                    student.courseName = emptyValue;
                    break;
                  case 'Course Sector':
                    student.courseSector = emptyValue;
                    break;
                  case 'Course Level':
                    student.courseLevel = emptyValue;
                    break;
                  case 'Duration In Weeks':
                    student.durationInWeeks = emptyValue;
                    break;
                  case 'Current Total Course Fee':
                    student.currentTotalCourseFee = emptyValue;
                    break;
                  case 'Proposed Start Date':
                    student.proposedStartDate = emptyValue;
                    break;
                  case 'Proposed End Date':
                    student.proposedEndDate = emptyValue;
                    break;
                  case 'Actual Start Date':
                    student.actualStartDate = emptyValue;
                    break;
                  case 'Actual End Date':
                    student.actualEndDate = emptyValue;
                    break;
                  case 'Total Course Fee':
                    student.totalCourseFee = emptyValue;
                    break;
                  case 'Prepaid Course Fee':
                    student.prepaidCourseFee = emptyValue;
                    break;
                  case 'Visa Granted':
                    student.visaGranted = emptyValue;
                    break;
                  case 'Visa Grant Status':
                    student.visaGrantStatus = emptyValue;
                    break;
                  case 'Visa Grant Number':
                    student.visaGrantNumber = emptyValue;
                    break;
                  case 'COE Created Date':
                    student.coeCreatedDate = emptyValue;
                    break;
                  case 'Created By':
                    student.createdBy = emptyValue;
                    break;
                  case 'COE Last Updated':
                    student.coeLastUpdated = emptyValue;
                    break;
                  case 'Location Name':
                    student.locationName = emptyValue;
                    break;
                  case 'Active Location':
                    student.activeLocation = emptyValue;
                    break;
                }
              });
              
              // Insert student
              await prisma.student.create({
                data: student
              });
              inserted++;
              
              if (inserted % 25 === 0) {
                console.log(`✅ Inserted ${inserted}/${last400.length} students...`);
              }
            }

            console.log(`🎉 Successfully imported ${inserted} students with random agent IDs!`);
            resolve(inserted);
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
import400StudentsFromDebug()
  .then((count) => {
    console.log(`🏁 Import completed! ${count} students added to database.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });