import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const coeStatus = searchParams.get('coeStatus');
    const visaGrantStatus = searchParams.get('visaGrantStatus');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    const whereClause: any = {};
    
    if (agentId) {
      whereClause.agentId = parseInt(agentId);
    }
    
    if (coeStatus) {
      whereClause.coeStatus = coeStatus;
    }
    
    if (visaGrantStatus) {
      whereClause.visaGrantStatus = visaGrantStatus;
    }
    
    const students = await prisma.student.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      select: {
        id: true,
        agentId: true,
        providerCode: true,
        coeCode: true,
        coeStatus: true,
        coeType: true,
        firstName: true,
        familyName: true,
        gender: true,
        dateOfBirth: true,
        countryOfBirth: true,
        nationality: true,
        passportNumber: true,
        emailAddress: true,
        mobile: true,
        courseCode: true,
        coeCreatedDate: true,
        visaGranted: true,
        visaGrantStatus: true,
        visaGrantNumber: true,
        courseName: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Get all agents to create a lookup map
    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true
      }
    });

    // Create a mapping from numeric index to agent names
    // Since agentId in students is 1-12, we'll map them to the first 12 agents
    const agentMap: { [key: number]: { name: string; id: string } } = {};
    agents.slice(0, 12).forEach((agent, index) => {
      agentMap[index + 1] = {
        name: `${agent.first_name} ${agent.last_name}`,
        id: agent.id
      };
    });

    // Add agent information to students
    const studentsWithAgents = students.map(student => ({
      ...student,
      agentName: student.agentId ? agentMap[student.agentId]?.name || `Agent ${student.agentId}` : null,
      agentFullId: student.agentId ? agentMap[student.agentId]?.id || null : null
    }));
    
    const totalCount = await prisma.student.count({ where: whereClause });
    
    return NextResponse.json({ 
      success: true, 
      data: studentsWithAgents,
      totalCount,
      showing: studentsWithAgents.length,
      agentId: agentId,
      coeStatus: coeStatus,
      visaGrantStatus: visaGrantStatus
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}