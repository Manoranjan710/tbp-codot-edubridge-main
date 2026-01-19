import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all agents with their basic info
    const agents = await prisma.agent.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get low-performing agents (visa rejection rate >= 80%)
    const lowPerformingAgents = await Promise.all(
      agents.map(async (agent) => {
        // Convert agent.id to number since agentId in students is Int
        const agentIdNum = parseInt(agent.id);

        // Get total students for this agent
        const totalStudents = await prisma.student.count({
          where: { agentId: agentIdNum }
        });

        if (totalStudents === 0) {
          // Skip agents with no students
          return null;
        }

        // Get students with visa granted
        const visaGranted = await prisma.student.count({
          where: { 
            agentId: agentIdNum,
            visaGranted: 'Yes'
          }
        });

        // Get students with visa explicitly rejected (assuming 'No' means rejected)
        const visaRejected = await prisma.student.count({
          where: { 
            agentId: agentIdNum,
            visaGranted: 'No'
          }
        });

        // Calculate visa rejection rate
        const visaApplications = visaGranted + visaRejected; // Total students who applied for visa
        const visaRejectionRate = visaApplications > 0 ? ((visaRejected / visaApplications) * 100) : 0;

        // Only return agents with rejection rate >= 80% and at least 2 visa applications for statistical significance
        if (visaRejectionRate >= 80 && visaApplications >= 2) {
          return {
            id: agent.id,
            first_name: agent.first_name,
            last_name: agent.last_name,
            email: agent.email,
            country: agent.country,
            status: agent.status,
            totalStudents,
            visaApplications,
            visaGranted,
            visaRejected,
            visaRejectionRate: parseFloat(visaRejectionRate.toFixed(1)),
            visaSuccessRate: parseFloat(((visaGranted / visaApplications) * 100).toFixed(1)),
            createdAt: agent.createdAt,
            updatedAt: agent.updatedAt
          };
        }
        return null;
      })
    );

    // Filter out null values and sort by rejection rate (highest first)
    const filteredAgents = lowPerformingAgents
      .filter(agent => agent !== null)
      .sort((a, b) => b!.visaRejectionRate - a!.visaRejectionRate);

    return NextResponse.json({ 
      success: true, 
      data: filteredAgents,
      count: filteredAgents.length,
      criteria: 'Visa rejection rate >= 80% with minimum 2 visa applications'
    });
  } catch (error) {
    console.error('Error fetching low-performing agents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch low-performing agents data' },
      { status: 500 }
    );
  }
}

// Block agent endpoint
export async function PATCH(request: NextRequest) {
  try {
    const { id, action } = await request.json();
    
    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: 'Agent ID and action are required' },
        { status: 400 }
      );
    }

    let newStatus: string;
    switch (action) {
      case 'block':
        newStatus = 'blocked';
        break;
      case 'unblock':
        newStatus = 'active';
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use "block" or "unblock"' },
          { status: 400 }
        );
    }
    
    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: { status: newStatus }
    });
    
    return NextResponse.json({
      success: true,
      data: updatedAgent,
      message: `Agent ${action}ed successfully`
    });
  } catch (error) {
    console.error('Error updating agent status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update agent status' },
      { status: 500 }
    );
  }
}