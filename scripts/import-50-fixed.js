const { PrismaClient } = require('../src/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function import400StudentsFixed() {
  try {
    // Delete existing students to avoid duplicates
    await prisma.student.deleteMany({});
    console.log('🗑️  Cleared existing student data');

    const csvFilePath = path.resolve('../Export for CoE and Student Details as at 2022-3-8 11-01-52.csv');
    
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found: ${csvFilePath}`);
    }

    // Read the file and split by lines
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
    const lines = fileContent.split('\n');
    
    // Headers are on line 4 (index 3)
    const headerLine = lines[3];
    const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));
    
    console.log('Found headers:', headers.slice(0, 10).join(', '), '...');
    
    const students = [];
    
    // Process last 400 records from the bottom of the file
    const startIndex = Math.max(4, lines.length - 400);
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV line (handle quotes and commas)
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/"/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/"/g, ''));
      
      // Create student object
      const student = {
        // Add random agent ID from 1-10
        agentId: Math.floor(Math.random() * 12) + 1
      };
      headers.forEach((header, index) => {
        const value = values[index] || null;
        const emptyValue = value === '' ? null : value;
        
        switch (header) {
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
      
      students.push(student);
    }

    console.log(`📄 Parsed ${students.length} student records from CSV`);
    
    // Insert students one by one
    let inserted = 0;
    
    for (const student of students) {
      await prisma.student.create({
        data: student
      });
      inserted++;
      
      if (inserted % 10 === 0) {
        console.log(`✅ Inserted ${inserted}/${students.length} students...`);
      }
    }

    console.log(`🎉 Successfully imported ${inserted} students!`);
    return inserted;

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
import400StudentsFixed()
  .then((count) => {
    console.log(`🏁 Import completed! ${count} students added to database.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });