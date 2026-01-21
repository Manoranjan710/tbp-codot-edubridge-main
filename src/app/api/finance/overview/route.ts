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
    agentId: string;
    agentName: string;
    revenue: number;
    commission: number;
    students: number;
  }[];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId'); // STRING (CUID)

    const commissionRate = 15;
    const now = new Date();

    /* ----------------------------------
       1️⃣ Fetch approved students
    ---------------------------------- */
    const approvedStudents = await prisma.student.findMany({
      where: {
        visaGrantStatus: 'In Effect',
        ...(agentId ? { agentId } : {})
      },
      select: {
        agentId: true,
        totalCourseFee: true,
        createdAt: true
      }
    });

    /* ----------------------------------
       2️⃣ Revenue calculations
    ---------------------------------- */
    const calculateRevenue = (students: typeof approvedStudents) =>
      students.reduce((sum, s) => {
        if (!s.totalCourseFee) return sum;
        const fee = parseFloat(s.totalCourseFee.replace(/[^\d.-]/g, '')) || 0;
        return sum + fee;
      }, 0);

    const totalRevenue = calculateRevenue(approvedStudents);
    const totalCommissions = (totalRevenue * commissionRate) / 100;
    const netIncome = totalRevenue - totalCommissions;
    const totalStudents = approvedStudents.length;

    /* ----------------------------------
       3️⃣ Monthly trends (last 12 months)
    ---------------------------------- */
    const monthlyTrends: MonthlyFinancials[] = [];

    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthStudents = approvedStudents.filter(s => {
        const d = new Date(s.createdAt);
        return d >= start && d < end;
      });

      const monthRevenue = calculateRevenue(monthStudents);
      const monthCommission = (monthRevenue * commissionRate) / 100;

      monthlyTrends.push({
        month: start.toLocaleString('en-US', { month: 'short' }),
        totalRevenue: monthRevenue,
        totalCommissions: monthCommission,
        netIncome: monthRevenue - monthCommission,
        studentEnrollments: monthStudents.length
      });
    }

    /* ----------------------------------
       4️⃣ Revenue breakdown
    ---------------------------------- */
    const revenueBreakdown: RevenueBreakdown[] = [
      { category: 'Course Fees', amount: totalRevenue, percentage: 0 },
      { category: 'Application Fees', amount: totalStudents * 500, percentage: 0 },
      { category: 'Administrative Fees', amount: totalStudents * 200, percentage: 0 },
      { category: 'Other Services', amount: totalStudents * 150, percentage: 0 }
    ];

    const totalAllRevenue = revenueBreakdown.reduce((s, r) => s + r.amount, 0);

    revenueBreakdown.forEach(r => {
      r.percentage = totalAllRevenue ? (r.amount / totalAllRevenue) * 100 : 0;
    });

    /* ----------------------------------
       5️⃣ Top performing agents
       (single agent if agentId passed)
    ---------------------------------- */
    const agents = await prisma.agent.findMany({
      where: agentId ? { id: agentId } : undefined,
      select: {
        id: true,
        first_name: true,
        last_name: true
      }
    });

    const topPerformingAgents = agents.map(agent => {
      const agentStudents = approvedStudents.filter(
        s => s.agentId === agent.id
      );

      const revenue = calculateRevenue(agentStudents);
      const commission = (revenue * commissionRate) / 100;

      return {
        agentId: agent.id,
        agentName: `${agent.first_name} ${agent.last_name}`,
        revenue,
        commission,
        students: agentStudents.length
      };
    }).filter(a => a.revenue > 0);

    topPerformingAgents.sort((a, b) => b.revenue - a.revenue);

    /* ----------------------------------
       6️⃣ Final response
    ---------------------------------- */
    const financeOverview: FinanceOverview = {
      summary: {
        totalRevenue: totalAllRevenue,
        totalCommissions,
        netIncome: totalAllRevenue - totalCommissions,
        totalStudents,
        averageRevenuePerStudent: totalStudents ? totalAllRevenue / totalStudents : 0,
        commissionRate,
        profitMargin: totalAllRevenue
          ? ((totalAllRevenue - totalCommissions) / totalAllRevenue) * 100
          : 0
      },
      monthlyTrends,
      revenueBreakdown,
      topPerformingAgents: agentId
        ? topPerformingAgents
        : topPerformingAgents.slice(0, 5)
    };

    return NextResponse.json({ success: true, data: financeOverview });

  } catch (error) {
    console.error('Finance overview error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch finance overview' },
      { status: 500 }
    );
  }
}
