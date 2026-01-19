import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all agents with their basic info
    const agents = await prisma.agent.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get performance metrics for each agent
    const agentPerformance = await Promise.all(
      agents.map(async (agent) => {
        // Convert agent.id to number since agentId in students is Int
        const agentIdNum = parseInt(agent.id);

        // Get total students for this agent
        const totalStudents = await prisma.student.count({
          where: { agentId: agentIdNum }
        });

        // Get students with approved COE status
        const approvedCOE = await prisma.student.count({
          where: { 
            agentId: agentIdNum,
            coeStatus: 'Studying' // Assuming 'Studying' means approved
          }
        });

        // Get students with visa granted
        const visaGranted = await prisma.student.count({
          where: { 
            agentId: agentIdNum,
            visaGranted: 'Yes'
          }
        });

        // Calculate percentages
        const coeApprovalRate = totalStudents > 0 ? ((approvedCOE / totalStudents) * 100).toFixed(1) : '0.0';
        const visaSuccessRate = totalStudents > 0 ? ((visaGranted / totalStudents) * 100).toFixed(1) : '0.0';

        return {
          id: agent.id,
          first_name: agent.first_name,
          last_name: agent.last_name,
          email: agent.email,
          country: agent.country,
          status: agent.status,
          totalStudents,
          approvedCOE,
          visaGranted,
          coeApprovalRate: parseFloat(coeApprovalRate),
          visaSuccessRate: parseFloat(visaSuccessRate),
          createdAt: agent.createdAt,
          updatedAt: agent.updatedAt
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      data: agentPerformance,
      count: agentPerformance.length
    });
  } catch (error) {
    console.error('Error fetching agent performance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agent performance data' },
      { status: 500 }
    );
  }
}