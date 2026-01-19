import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = parseInt(params.id);
    if (isNaN(studentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const { coeCode, coeStatus, coeCreatedDate } = await request.json();

    // COE code is only required when approving (not for rejection)
    if (!coeCode && coeStatus !== 'Rejected') {
      return NextResponse.json(
        { success: false, error: 'COE code is required for approval' },
        { status: 400 }
      );
    }

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!existingStudent) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      coeStatus: coeStatus || 'Studying',
      coeCreatedDate: coeCreatedDate || new Date().toISOString(),
      updatedAt: new Date()
    };

    // Only update COE code if provided (for approvals)
    if (coeCode) {
      updateData.coeCode = coeCode.trim();
    }

    // Update the student with COE information
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: updatedStudent,
      message: 'COE information updated successfully'
    });
  } catch (error) {
    console.error('Error updating COE information:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update COE information' },
      { status: 500 }
    );
  }
}