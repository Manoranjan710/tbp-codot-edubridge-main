"use client";

import React, { useState, useEffect } from "react";
import RevenueChart from "./RevenueChart";
import RevenueBreakdownChart from "./RevenueBreakdownChart";
import FinancialSummaryCards from "./FinancialSummaryCards";
import TopAgentsTable from "./TopAgentsTable";

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

interface TopAgent {
  agentName: string;
  revenue: number;
  commission: number;
  students: number;
}

interface FinanceData {
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
  topPerformingAgents: TopAgent[];
}

export default function FinanceOverview() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const response = await fetch('/api/finance/overview');
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || 'Failed to fetch finance data');
        }
      } catch (err) {
        setError('Failed to fetch finance data');
        console.error('Error fetching finance data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 dark:text-red-400">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">
          No finance data available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <FinancialSummaryCards summary={data.summary} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Revenue Trends
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Revenue vs Commission over the last 12 months
            </p>
          </div>
          <div className="p-6">
            <RevenueChart monthlyTrends={data.monthlyTrends} />
          </div>
        </div>

        {/* Revenue Breakdown Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Breakdown
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Revenue distribution by category
            </p>
          </div>
          <div className="p-6">
            <RevenueBreakdownChart revenueBreakdown={data.revenueBreakdown} />
          </div>
        </div>
      </div>

      {/* Top Performing Agents */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Performing Agents
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Agents generating the highest revenue for the college
          </p>
        </div>
        <TopAgentsTable agents={data.topPerformingAgents} />
      </div>
    </div>
  );
}