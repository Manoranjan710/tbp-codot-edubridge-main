import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface MonthlyFinancials {
  month: string;
  totalRevenue: number;
  totalCommissions: number;
  netIncome: number;
  studentEnrollments: number;
}

interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

interface FinanceOverview {
  summary: {
    totalRevenue: number;
    totalCommissions: number;
    netIncome: number;
    totalStudents: number;
    averageRevenuePerStudent: number;
    commissionRate: number;
    profitMargin: number;
  };
  monthlyTrends: MonthlyFinancials[];
  revenueBreakdown: RevenueBreakdown[];
  topPerformingAgents: {
    agentName: string;
    revenue: number;
    commission: number;
    students: number;
  }[];
}

export async function GET() {
  try {
    const now = new Date();
    const commissionRate = 15; // 15% commission rate

    // Get all students with approved visas and their course fees
    const approvedStudents = await prisma.student.findMany({
      where: {
        visaGrantStatus: 'In Effect'
      },
      select: {
        agentId: true,
        totalCourseFee: true,
        createdAt: true,
        firstName: true,
        familyName: true
      }
    });

    // Calculate total revenue and commissions
    let totalRevenue = 0;
    approvedStudents.forEach(student => {
      if (student.totalCourseFee) {
        const feeString = student.totalCourseFee.replace(/[^\d.-]/g, '');
        const fee = parseFloat(feeString) || 0;
        totalRevenue += fee;
      }
    });

    const totalCommissions = (totalRevenue * commissionRate) / 100;
    const netIncome = totalRevenue - totalCommissions;
    const totalStudents = approvedStudents.length;
    const averageRevenuePerStudent = totalStudents > 0 ? totalRevenue / totalStudents : 0;
    const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

    // Generate monthly trends for the last 12 months
    const monthlyTrends: MonthlyFinancials[] = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthStudents = approvedStudents.filter(student => {
        const studentDate = new Date(student.createdAt);
        return studentDate >= date && studentDate < nextMonth;
      });

      let monthRevenue = 0;
      monthStudents.forEach(student => {
        if (student.totalCourseFee) {
          const feeString = student.totalCourseFee.replace(/[^\d.-]/g, '');
          const fee = parseFloat(feeString) || 0;
          monthRevenue += fee;
        }
      });

      const monthCommissions = (monthRevenue * commissionRate) / 100;
      const monthNetIncome = monthRevenue - monthCommissions;

      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        totalRevenue: monthRevenue,
        totalCommissions: monthCommissions,
        netIncome: monthNetIncome,
        studentEnrollments: monthStudents.length
      });
    }

    // Revenue breakdown by categories
    const revenueBreakdown: RevenueBreakdown[] = [
      {
        category: 'Course Fees',
        amount: totalRevenue,
        percentage: 85
      },
      {
        category: 'Application Fees',
        amount: totalStudents * 500, // Assume $500 application fee per student
        percentage: 8
      },
      {
        category: 'Administrative Fees',
        amount: totalStudents * 200, // Assume $200 admin fee per student
        percentage: 4
      },
      {
        category: 'Other Services',
        amount: totalStudents * 150, // Assume $150 other services per student
        percentage: 3
      }
    ];

    // Recalculate total revenue including all fees
    const totalAllRevenue = revenueBreakdown.reduce((sum, item) => sum + item.amount, 0);
    
    // Update percentages based on actual amounts
    revenueBreakdown.forEach(item => {
      item.percentage = totalAllRevenue > 0 ? (item.amount / totalAllRevenue) * 100 : 0;
    });

    // Get top performing agents by revenue
    const agents = await prisma.agent.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true
      }
    });

    const topPerformingAgents = [];
    
    for (const agent of agents) {
      const agentIdNum = parseInt(agent.id);
      const agentStudents = approvedStudents.filter(
        student => student.agentId === agentIdNum
      );

      let agentRevenue = 0;
      agentStudents.forEach(student => {
        if (student.totalCourseFee) {
          const feeString = student.totalCourseFee.replace(/[^\d.-]/g, '');
          const fee = parseFloat(feeString) || 0;
          agentRevenue += fee;
        }
      });

      const agentCommission = (agentRevenue * commissionRate) / 100;

      if (agentRevenue > 0) {
        topPerformingAgents.push({
          agentName: `${agent.first_name} ${agent.last_name}`,
          revenue: agentRevenue,
          commission: agentCommission,
          students: agentStudents.length
        });
      }
    }

    // Sort by revenue and take top 5
    topPerformingAgents.sort((a, b) => b.revenue - a.revenue);
    const top5Agents = topPerformingAgents.slice(0, 5);

    const financeOverview: FinanceOverview = {
      summary: {
        totalRevenue: totalAllRevenue,
        totalCommissions,
        netIncome: totalAllRevenue - totalCommissions,
        totalStudents,
        averageRevenuePerStudent: totalStudents > 0 ? totalAllRevenue / totalStudents : 0,
        commissionRate,
        profitMargin: totalAllRevenue > 0 ? ((totalAllRevenue - totalCommissions) / totalAllRevenue) * 100 : 0
      },
      monthlyTrends,
      revenueBreakdown,
      topPerformingAgents: top5Agents
    };

    return NextResponse.json({
      success: true,
      data: financeOverview
    });

  } catch (error) {
    console.error('Error fetching finance overview:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch finance overview' },
      { status: 500 }
    );
  }
}