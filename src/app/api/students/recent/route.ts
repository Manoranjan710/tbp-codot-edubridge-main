import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface RecentApplication {
  id: number;
  firstName: string;
  familyName: string;
  courseCode: string;
  courseName: string;
  coeStatus: string;
  visaGrantStatus: string;
  countryOfBirth: string;
  agentId: number;
  agentName: string;
  createdAt: string;
}

export async function GET() {
  try {
    // Get all agents for mapping
    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true
      }
    });

    const agentMap: { [key: number]: string } = {};
    agents.forEach((agent, index) => {
      agentMap[index + 1] = `${agent.first_name} ${agent.last_name}`;
    });

    // Get recent 10 student applications
    const recentStudents = await prisma.student.findMany({
      select: {
        id: true,
        firstName: true,
        familyName: true,
        courseCode: true,
        courseName: true,
        coeStatus: true,
        visaGrantStatus: true,
        countryOfBirth: true,
        agentId: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    const applications: RecentApplication[] = recentStudents.map(student => ({
      id: student.id,
      firstName: student.firstName || 'N/A',
      familyName: student.familyName || '',
      courseCode: student.courseCode || 'N/A',
      courseName: student.courseName || 'N/A',
      coeStatus: student.coeStatus || 'Pending',
      visaGrantStatus: student.visaGrantStatus || 'Pending',
      countryOfBirth: student.countryOfBirth || 'Unknown',
      agentId: student.agentId || 0,
      agentName: student.agentId ? agentMap[student.agentId] || `Agent ${student.agentId}` : 'Unassigned',
      createdAt: student.createdAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching recent applications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch recent applications' },
      { status: 500 }
    );
  }
}