"use client";

import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentApplications from "@/components/ecommerce/RecentApplications";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { useAuth } from "@/context/AuthContext";
import type { MetricsData, StudentData, DashboardData } from "@/types/dashboard";

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
            setDashboardData({ studentData: result });
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

      <div className="col-span-12">
        <StatisticsChart 
          data={dashboardData} 
          loading={loading}
          isAgent={user?.role === 'agent'}
        />
      </div>

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