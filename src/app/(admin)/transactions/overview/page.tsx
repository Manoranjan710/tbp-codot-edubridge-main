'use client';

import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";
import FinanceOverview from "@/components/finance/FinanceOverview";

interface MonthlySummary {
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

interface FinanceSummary {
  totalRevenue: number;
  totalCommissions: number;
  netIncome: number;
  totalStudents: number;
  averageRevenuePerStudent: number;
  commissionRate: number;
  profitMargin: number;
}

interface FinanceResponse {
  success: boolean;
  data: {
    summary: FinanceSummary;
    monthlyTrends: MonthlySummary[];
    revenueBreakdown: RevenueBreakdown[];
    topPerformingAgents: Array<{
      agentId: string;
      agentName: string;
      revenue: number;
      commission: number;
      students: number;
    }>;
  };
}

export default function FinanceOverviewPage() {
  const { user } = useAuth();
  const [financeData, setFinanceData] = useState<FinanceResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if user is an agent and fetch finance data
        if (user?.role === 'agent' && user?.id) {
          const financeResponse = await fetch(`/api/finance/overview?agentId=${user.id}`);
          const financeResult: FinanceResponse = await financeResponse.json();
          
          if (financeResult.success) {
            setFinanceData(financeResult.data);
          } else {
            console.error('Failed to fetch finance data');
            setError('Failed to fetch finance data');
          }
        }
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading finance data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Finance Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Financial analytics and revenue insights from college perspective
        </p>
      </div>

      {/* Financial Overview for Agents */}
      {(user?.role === 'agent' && financeData) && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Revenue Card */}
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:from-blue-900/20 dark:to-blue-800/20">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                ₹{financeData.summary.totalRevenue.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                {financeData.summary.totalStudents} students enrolled
              </p>
            </div>

            {/* Total Commissions Card */}
            <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-6 dark:from-green-900/20 dark:to-green-800/20">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Commissions</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                ₹{financeData.summary.totalCommissions.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                {financeData.summary.commissionRate}% rate
              </p>
            </div>

            {/* Net Income Card */}
            <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-6 dark:from-purple-900/20 dark:to-purple-800/20">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Income</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                ₹{financeData.summary.netIncome.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                {financeData.summary.profitMargin.toFixed(2)}% margin
              </p>
            </div>

            {/* Avg Revenue per Student Card */}
            <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-6 dark:from-orange-900/20 dark:to-orange-800/20">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Revenue/Student</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                ₹{financeData.summary.averageRevenuePerStudent.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">per enrollment</p>
            </div>
          </div>

          {/* Revenue Breakdown & Monthly Trends */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue Breakdown */}
            <ComponentCard
              title="Revenue Breakdown"
              desc="Distribution of revenue by category"
            >
              <div className="space-y-4">
                {financeData.revenueBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.category}
                      </p>
                      <div className="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        ₹{item.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.percentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ComponentCard>

            {/* Monthly Trends */}
            <ComponentCard
              title="Monthly Trends"
              desc="Revenue and enrollment by month"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                        Month
                      </th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">
                        Revenue
                      </th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">
                        Students
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {financeData.monthlyTrends
                      .filter(m => m.totalRevenue > 0 || m.studentEnrollments > 0)
                      .map((trend, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                            {trend.month}
                          </td>
                          <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">
                            ₹{trend.totalRevenue.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                            {trend.studentEnrollments}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </ComponentCard>
          </div>
        </>
      )}

      {user?.role === "admin" && (
        <FinanceOverview />
      )}
    </div>
  );
}