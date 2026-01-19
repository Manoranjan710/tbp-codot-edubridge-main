import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get sample passport numbers from database
    const students = await prisma.student.findMany({
      where: {
        passportNumber: {
          not: null
        }
      },
      select: {
        id: true,
        passportNumber: true,
        firstName: true,
        familyName: true
      },
      take: 20,
      orderBy: {
        id: 'asc'
      }
    });

    // Get total count of students with passport numbers
    const totalCount = await prisma.student.count({
      where: {
        passportNumber: {
          not: null
        }
      }
    });

    return NextResponse.json({
      success: true,
      totalStudentsWithPassport: totalCount,
      sampleStudents: students
    });

  } catch (error) {
    console.error('Error checking passport numbers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check passport numbers' },
      { status: 500 }
    );
  }
}