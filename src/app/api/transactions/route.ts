import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface AgentTransaction {
  agentId: number;
  agentName: string;
  agentEmail: string;
  totalStudents: number;
  approvedStudents: number;
  totalCourseValue: number;
  commission: number;
  commissionRate: number;
}

export async function GET() {
  try {
    // Get all agents
    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        status: true
      }
    });

    // Get all approved visa students with their course fees and agent info
    const approvedStudents = await prisma.student.findMany({
      where: {
        agentId: { not: null },
        visaGrantStatus: 'In Effect'
      },
      select: {
        agentId: true,
        totalCourseFee: true,
        firstName: true,
        familyName: true,
        courseName: true
      }
    });

    // Calculate commission for each agent
    const agentTransactions: AgentTransaction[] = [];
    const commissionRate = 15; // 15% commission rate

    for (const agent of agents) {
      // Convert agent.id (string) to number for comparison
      const agentIdNum = parseInt(agent.id);
      
      // Get students for this agent
      const agentStudents = approvedStudents.filter(
        student => student.agentId === agentIdNum
      );

      // Calculate total course value (only for approved visa students)
      let totalCourseValue = 0;
      
      agentStudents.forEach(student => {
        if (student.totalCourseFee) {
          // Remove any currency symbols and convert to number
          const feeString = student.totalCourseFee.replace(/[^\d.-]/g, '');
          const fee = parseFloat(feeString) || 0;
          totalCourseValue += fee;
        }
      });

      // Calculate commission (15% of total course value)
      const commission = (totalCourseValue * commissionRate) / 100;

      // Get total students for this agent (including non-approved)
      const totalStudents = await prisma.student.count({
        where: { agentId: agentIdNum }
      });

      agentTransactions.push({
        agentId: agentIdNum,
        agentName: `${agent.first_name} ${agent.last_name}`,
        agentEmail: agent.email,
        totalStudents,
        approvedStudents: agentStudents.length,
        totalCourseValue,
        commission,
        commissionRate
      });
    }

    // Sort by commission amount (highest first)
    agentTransactions.sort((a, b) => b.commission - a.commission);

    // Calculate totals
    const totals = {
      totalAgents: agentTransactions.length,
      totalApprovedStudents: agentTransactions.reduce((sum, agent) => sum + agent.approvedStudents, 0),
      totalCourseValue: agentTransactions.reduce((sum, agent) => sum + agent.totalCourseValue, 0),
      totalCommissions: agentTransactions.reduce((sum, agent) => sum + agent.commission, 0)
    };

    return NextResponse.json({
      success: true,
      data: {
        transactions: agentTransactions,
        totals,
        commissionRate
      }
    });

  } catch (error) {
    console.error('Error fetching agent transactions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch agent transactions' },
      { status: 500 }
    );
  }
}