import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

interface MonthlyStats {
  month: string;
  applications: number;
  approvals: number;
}

interface AgentPerformanceData {
  month: string;
  totalAgents: number;
  lowPerformingAgents: number;
}

interface DashboardMetrics {
  overview: {
    totalStudents: number;
    totalAgents: number;
    coeApproved: number;
    visaApproved: number;
    pendingApplications: number;
    lowPerformingAgents: number;
    studentGrowth: number;
    agentGrowth: number;
  };
  monthlyApplications: MonthlyStats[];
  monthlyAgentPerformance: AgentPerformanceData[];
  visaStatistics: {
    approved: number;
    inEffect: number;
    cancelled: number;
    refused: number;
    pending: number;
  };
  coeStatistics: {
    studying: number;
    approved: number;
    cancelled: number;
    finished: number;
  };
  demographics: {
    country: string;
    students: number;
    percentage: number;
  }[];
  agentPerformance: {
    totalApplications: number;
    approvalRate: number;
    currentMonth: number;
    target: number;
  };
}

export async function GET() {
  try {
    // Get total counts
    const [totalStudents, totalAgents] = await Promise.all([
      prisma.student.count(),
      prisma.agent.count()
    ]);

    // Get COE and Visa statistics
    const [coeStats, visaStats] = await Promise.all([
      prisma.student.groupBy({
        by: ['coeStatus'],
        _count: {
          id: true
        }
      }),
      prisma.student.groupBy({
        by: ['visaGrantStatus'],
        _count: {
          id: true
        },
        where: {
          visaGrantStatus: {
            not: null
          }
        }
      })
    ]);

    // Calculate specific metrics
    const coeApproved = coeStats.find(s => s.coeStatus?.toLowerCase().includes('studying'))?._count.id || 0;
    const visaApproved = visaStats.find(s => s.visaGrantStatus?.toLowerCase().includes('in effect'))?._count.id || 0;
    const pendingApplications = coeStats.find(s => s.coeStatus?.toLowerCase().includes('pending'))?._count.id || 0;

    // Get monthly application trends (last 12 months)
    const now = new Date();
    const monthlyData: MonthlyStats[] = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const [applications, approvals] = await Promise.all([
        prisma.student.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextMonth
            }
          }
        }),
        prisma.student.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextMonth
            },
            OR: [
              { coeStatus: 'Studying' },
              { visaGrantStatus: 'In Effect' }
            ]
          }
        })
      ]);

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        applications,
        approvals
      });
    }

    // Get demographics by country
    const demographicsData = await prisma.student.groupBy({
      by: ['countryOfBirth'],
      _count: {
        id: true
      },
      where: {
        countryOfBirth: {
          not: null
        }
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    });

    const demographics = demographicsData.map(item => ({
      country: item.countryOfBirth || 'Unknown',
      students: item._count.id,
      percentage: Math.round((item._count.id / totalStudents) * 100)
    }));

    // Calculate growth metrics (comparing this month vs last month)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [thisMonthStudents, lastMonthStudents] = await Promise.all([
      prisma.student.count({
        where: {
          createdAt: {
            gte: thisMonth
          }
        }
      }),
      prisma.student.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: thisMonth
          }
        }
      })
    ]);

    const studentGrowth = lastMonthStudents > 0 
      ? Math.round(((thisMonthStudents - lastMonthStudents) / lastMonthStudents) * 100)
      : thisMonthStudents > 0 ? 100 : 0;

    // Calculate agent performance metrics
    const totalApplicationsThisMonth = thisMonthStudents;
    const totalApprovalsThisMonth = await prisma.student.count({
      where: {
        createdAt: {
          gte: thisMonth
        },
        OR: [
          { coeStatus: 'Studying' },
          { visaGrantStatus: 'In Effect' }
        ]
      }
    });

    const approvalRate = totalApplicationsThisMonth > 0 
      ? Math.round((totalApprovalsThisMonth / totalApplicationsThisMonth) * 100)
      : 0;

    // Calculate real agent performance (last 12 months)
    const monthlyAgentPerformance: AgentPerformanceData[] = [];
    let currentLowPerformingAgents = 0;
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      // Get agent performance for this month
      const agentStats = await prisma.student.groupBy({
        by: ['agentId'],
        _count: {
          id: true
        },
        where: {
          agentId: { not: null },
          createdAt: {
            gte: date,
            lt: nextMonth
          }
        }
      });

      const agentApprovals = await prisma.student.groupBy({
        by: ['agentId'],
        _count: {
          id: true
        },
        where: {
          agentId: { not: null },
          createdAt: {
            gte: date,
            lt: nextMonth
          },
          visaGrantStatus: 'In Effect'
        }
      });

      // Calculate which agents are low performing (< 50% approval rate)
      const lowPerformingCount = agentStats.filter(agent => {
        const totalStudents = agent._count.id;
        const approvedStudents = agentApprovals.find(a => a.agentId === agent.agentId)?._count.id || 0;
        const agentApprovalRate = totalStudents > 0 ? (approvedStudents / totalStudents) * 100 : 0;
        return agentApprovalRate < 50; // Consider < 50% approval rate as low performing
      }).length;

      const activeAgentsThisMonth = agentStats.length;
      
      monthlyAgentPerformance.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        totalAgents: activeAgentsThisMonth,
        lowPerformingAgents: lowPerformingCount
      });

      // Use current month data for overview
      if (i === 0) {
        currentLowPerformingAgents = lowPerformingCount;
      }
    }

    const metrics: DashboardMetrics = {
      overview: {
        totalStudents,
        totalAgents,
        coeApproved,
        visaApproved,
        pendingApplications,
        lowPerformingAgents: currentLowPerformingAgents,
        studentGrowth,
        agentGrowth: 5 // Placeholder
      },
      monthlyApplications: monthlyData,
      monthlyAgentPerformance,
      visaStatistics: {
        approved: visaStats.find(s => s.visaGrantStatus?.toLowerCase().includes('approved'))?._count.id || 0,
        inEffect: visaStats.find(s => s.visaGrantStatus?.toLowerCase().includes('in effect'))?._count.id || 0,
        cancelled: visaStats.find(s => s.visaGrantStatus?.toLowerCase().includes('cancelled'))?._count.id || 0,
        refused: visaStats.find(s => s.visaGrantStatus?.toLowerCase().includes('refused'))?._count.id || 0,
        pending: visaStats.find(s => s.visaGrantStatus?.toLowerCase().includes('pending'))?._count.id || 0,
      },
      coeStatistics: {
        studying: coeStats.find(s => s.coeStatus?.toLowerCase().includes('studying'))?._count.id || 0,
        approved: coeStats.find(s => s.coeStatus?.toLowerCase().includes('approved'))?._count.id || 0,
        cancelled: coeStats.find(s => s.coeStatus?.toLowerCase().includes('cancelled'))?._count.id || 0,
        finished: coeStats.find(s => s.coeStatus?.toLowerCase().includes('finished'))?._count.id || 0,
      },
      demographics,
      agentPerformance: {
        totalApplications: totalApplicationsThisMonth,
        approvalRate,
        currentMonth: totalApprovalsThisMonth,
        target: Math.ceil(totalApplicationsThisMonth * 0.85) // Target 85% approval rate
      }
    };

    return NextResponse.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}