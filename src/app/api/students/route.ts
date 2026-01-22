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
      whereClause.agentId = agentId;
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

    // Create a mapping from agent ID to agent name
    const agentMap: { [key: string]: string } = {};
    agents.forEach((agent) => {
      agentMap[agent.id] = `${agent.first_name} ${agent.last_name}`;
    });

    // Add agent information to students
    const studentsWithAgents = students.map(student => ({
      ...student,
      agentName: student.agentId ? agentMap[student.agentId] || null : null,
      agentFullId: student.agentId
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