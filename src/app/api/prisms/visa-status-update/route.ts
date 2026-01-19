import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface CSVRow {
  passportNumber: string;
  visaGranted: string;
  visaGrantStatus: string;
  visaGrantNumber: string;
}

interface UpdatedStudent {
  id: number;
  passportNumber: string;
  firstName: string | null;
  familyName: string | null;
  previousVisaGranted: string | null;
  previousVisaStatus: string | null;
  previousVisaNumber: string | null;
  newVisaGranted: string;
  newVisaStatus: string;
  newVisaNumber: string;
  agentName: string | null;
  courseCode: string | null;
  courseName: string | null;
}

interface ProcessError {
  row: number;
  passport: string;
  error: string;
}

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

const parseCSV = (csvContent: string): CSVRow[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  // Skip header row
  const dataLines = lines.slice(1);
  
  return dataLines.map((line, index) => {
    const values = parseCSVLine(line);
    return {
      passportNumber: values[16] || '', // Column 17 (0-indexed = 16)
      visaGranted: values[65] || '',    // Column 66 (0-indexed = 65)
      visaGrantStatus: values[66] || '', // Column 67 (0-indexed = 66)
      visaGrantNumber: values[67] || ''  // Column 68 (0-indexed = 67)
    };
  }).filter(row => row.passportNumber); // Filter out empty rows
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (file.type !== 'text/csv') {
      return NextResponse.json(
        { success: false, message: 'File must be a CSV' },
        { status: 400 }
      );
    }

    // Read and parse CSV content
    const csvContent = await file.text();
    const csvRows = parseCSV(csvContent);

    if (csvRows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid data rows found in CSV' },
        { status: 400 }
      );
    }

    // Get all agents for mapping
    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true
      }
    });

    const agentMap: { [key: number]: string } = {};
    agents.slice(0, 12).forEach((agent, index) => {
      agentMap[index + 1] = `${agent.first_name} ${agent.last_name}`;
    });

    const updatedStudents: UpdatedStudent[] = [];
    const errors: ProcessError[] = [];
    let totalProcessed = 0;

    // Process each CSV row
    for (let i = 0; i < csvRows.length; i++) {
      const row = csvRows[i];
      totalProcessed++;

      try {
        // Find student by passport number
        const student = await prisma.student.findFirst({
          where: {
            passportNumber: row.passportNumber
          },
          select: {
            id: true,
            passportNumber: true,
            firstName: true,
            familyName: true,
            agentId: true,
            courseCode: true,
            courseName: true,
            visaGranted: true,
            visaGrantStatus: true,
            visaGrantNumber: true
          }
        });

        if (!student) {
          errors.push({
            row: i + 2, // +2 because we skip header and start from 0
            passport: row.passportNumber,
            error: 'Student not found with this passport number'
          });
          continue;
        }

        // Validate required fields
        if (!row.visaGranted || !row.visaGrantStatus) {
          errors.push({
            row: i + 2,
            passport: row.passportNumber,
            error: 'Missing required visa fields (visaGranted or visaGrantStatus)'
          });
          continue;
        }

        // Store previous values
        const previousVisaGranted = student.visaGranted;
        const previousVisaStatus = student.visaGrantStatus;
        const previousVisaNumber = student.visaGrantNumber;

        // Update student visa information
        await prisma.student.update({
          where: { id: student.id },
          data: {
            visaGranted: row.visaGranted,
            visaGrantStatus: row.visaGrantStatus,
            visaGrantNumber: row.visaGrantNumber || null,
            updatedAt: new Date()
          }
        });

        // Add to updated students list
        updatedStudents.push({
          id: student.id,
          passportNumber: student.passportNumber!,
          firstName: student.firstName,
          familyName: student.familyName,
          previousVisaGranted,
          previousVisaStatus,
          previousVisaNumber,
          newVisaGranted: row.visaGranted,
          newVisaStatus: row.visaGrantStatus,
          newVisaNumber: row.visaGrantNumber,
          agentName: student.agentId ? agentMap[student.agentId] || `Agent ${student.agentId}` : null,
          courseCode: student.courseCode,
          courseName: student.courseName
        });

      } catch (error) {
        console.error(`Error processing row ${i + 2}:`, error);
        errors.push({
          row: i + 2,
          passport: row.passportNumber,
          error: 'Database error occurred while updating student'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${totalProcessed} records`,
      updatedStudents,
      totalProcessed,
      totalUpdated: updatedStudents.length,
      errors
    });

  } catch (error) {
    console.error('Error processing visa status update:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process visa status updates' },
      { status: 500 }
    );
  }
}