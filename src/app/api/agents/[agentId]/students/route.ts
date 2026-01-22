import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: {
    agentId: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { agentId } = params;

    if (!agentId) {
      return NextResponse.json(
        { success: false, message: 'Agent ID is required' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const coeStatus = searchParams.get('coeStatus');
    const visaGrantStatus = searchParams.get('visaGrantStatus');

    const whereClause: any = {
      agentId: agentId
    };

    if (coeStatus) {
      whereClause.coeStatus = coeStatus;
    }

    if (visaGrantStatus) {
      whereClause.visaGrantStatus = visaGrantStatus;
    }

    // Fetch all students under the agent
    const students = await prisma.student.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (students.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: 'No students found for this agent',
          data: [],
          count: 0
        },
        { status: 200 }
      );
    }

    // Fetch agent information to get the agent name
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: {
        first_name: true,
        last_name: true
      }
    });

    const agentName = agent ? `${agent.first_name} ${agent.last_name}` : null;

    // Add agent name to each student
    const studentsWithAgentName = students.map(student => ({
      ...student,
      agentName: agentName
    }));

    return NextResponse.json(
      {
        success: true,
        message: 'Students fetched successfully',
        count: studentsWithAgentName.length,
        data: studentsWithAgentName
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch students error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      },
      { status: 500 }
    );
  }
}
