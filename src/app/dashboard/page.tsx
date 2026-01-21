"use client";

import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import ApprovalTrendChart from "@/components/ecommerce/ApprovalTrendChart";
import RecentApplications from "@/components/ecommerce/RecentApplications";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { useAuth } from "@/context/AuthContext";
import type { MetricsData, StudentData, DashboardData } from "@/types/dashboard";

// Helper function to calculate metrics for agent
const calculateAgentMetrics = (studentData: any) => {
  if (!studentData?.data || studentData.data.length === 0) {
    return {
      totalApplications: 0,
      approvalRate: 0,
      currentMonth: 0,
      monthlyApplications: [],
      demographics: [],
    };
  }

  const students = studentData.data;
  
  // Calculate approval rate
  const approved = students.filter((s: any) => s.coeStatus === 'Approved' || s.coeStatus === 'Studying').length;
  const approvalRate = students.length > 0 ? Math.round((approved / students.length) * 100) : 0;
  
  // Get current month approvals
  const now = new Date();
  const currentMonthApprovals = students.filter((s: any) => {
    const createdDate = new Date(s.createdAt);
    return createdDate.getMonth() === now.getMonth() && 
           createdDate.getFullYear() === now.getFullYear() &&
           (s.coeStatus === 'Approved' || s.coeStatus === 'Studying');
  }).length;

  // Calculate monthly applications (last 12 months)
  const monthlyData: { [key: string]: { applications: number; approvals: number } } = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = months[date.getMonth()];
    monthlyData[monthKey] = { applications: 0, approvals: 0 };
  }

  students.forEach((s: any) => {
    const createdDate = new Date(s.createdAt);
    const monthKey = months[createdDate.getMonth()];
    if (monthlyData[monthKey]) {
      monthlyData[monthKey].applications++;
      if (s.coeStatus === 'Approved' || s.coeStatus === 'Studying') {
        monthlyData[monthKey].approvals++;
      }
    }
  });

  const monthlyApplications = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    applications: data.applications,
    approvals: data.approvals
  }));

  // Calculate student demographics by country
  const demographicsMap: { [key: string]: number } = {};
  students.forEach((s: any) => {
    const country = s.nationality || 'Unknown';
    demographicsMap[country] = (demographicsMap[country] || 0) + 1;
  });

  const demographics = Object.entries(demographicsMap)
    .map(([country, count]) => ({
      country,
      students: count,
      percentage: Math.round((count / students.length) * 100)
    }))
    .sort((a, b) => b.students - a.students)
    .slice(0, 5); // Top 5 countries

  return {
    totalApplications: students.length,
    approvalRate,
    currentMonth: currentMonthApprovals,
    monthlyApplications,
    demographics,
  };
};

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Check if user is an agent
        if (user?.role === 'agent' && user?.id) {
          // Fetch agent's students
          const response = await fetch(`/api/agents/${user.id}/students`);
          const result = await response.json();
          if (result.success) {
            // Calculate filtered metrics for agent
            const agentMetrics = calculateAgentMetrics(result);
            setDashboardData({ 
              studentData: result,
              metrics: {
                monthlyApplications: agentMetrics.monthlyApplications,
                demographics: agentMetrics.demographics,
                agentPerformance: {
                  totalApplications: agentMetrics.totalApplications,
                  approvalRate: agentMetrics.approvalRate,
                  currentMonth: agentMetrics.currentMonth,
                  target: Math.ceil(agentMetrics.totalApplications * 0.7) // Target is 70% of total
                }
              }
            });
          }
        } else if (user?.role === 'admin') {
          // Fetch admin metrics
          const response = await fetch('/api/dashboard/metrics');
          const result = await response.json();
          if (result.success) {
            setDashboardData({ metrics: result.data });
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics 
          data={dashboardData} 
          loading={loading}
          isAgent={user?.role === 'agent'}
        />

        <MonthlySalesChart 
          data={dashboardData} 
          loading={loading}
          isAgent={user?.role === 'agent'}
        />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget 
          data={dashboardData} 
          loading={loading}
          isAgent={user?.role === 'agent'}
        />
      </div>

      {/* Only show Agent Performance Statistics for admin role */}
      {user?.role !== 'agent' && (
        <div className="col-span-12">
          <StatisticsChart 
            data={dashboardData} 
            loading={loading}
            isAgent={user?.role === 'agent'}
          />
        </div>
      )}

      {/* Show Application Approval Trend for agent role */}
      {user?.role === 'agent' && (
        <div className="col-span-12">
          <ApprovalTrendChart 
            data={dashboardData} 
            loading={loading}
          />
        </div>
      )}

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard 
          data={dashboardData} 
          loading={loading}
          isAgent={user?.role === 'agent'}
        />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentApplications 
          data={dashboardData} 
          loading={loading}
          isAgent={user?.role === 'agent'}
        />
      </div>
    </div>
  );
}