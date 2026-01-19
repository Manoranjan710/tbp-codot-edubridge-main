import React from "react";

interface FinancialSummary {
  totalRevenue: number;
  totalCommissions: number;
  netIncome: number;
  totalStudents: number;
  averageRevenuePerStudent: number;
  commissionRate: number;
  profitMargin: number;
}

interface FinancialSummaryCardsProps {
  summary: FinancialSummary;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercentage = (percentage: number) => {
  return `${percentage.toFixed(1)}%`;
};

export default function FinancialSummaryCards({ summary }: FinancialSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Total Revenue */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(summary.totalRevenue)}
            </p>
          </div>
          <div className="bg-blue-400/30 rounded-full p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-blue-100 text-sm">
          <span>From {summary.totalStudents} students</span>
        </div>
      </div>

      {/* Net Income */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Net Income</p>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(summary.netIncome)}
            </p>
          </div>
          <div className="bg-green-400/30 rounded-full p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-green-100 text-sm">
          <span>Profit margin: {formatPercentage(summary.profitMargin)}</span>
        </div>
      </div>

      {/* Total Commissions */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Total Commissions</p>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(summary.totalCommissions)}
            </p>
          </div>
          <div className="bg-orange-400/30 rounded-full p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-orange-100 text-sm">
          <span>At {formatPercentage(summary.commissionRate)} rate</span>
        </div>
      </div>

      {/* Average Revenue per Student */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Avg Revenue/Student</p>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(summary.averageRevenuePerStudent)}
            </p>
          </div>
          <div className="bg-purple-400/30 rounded-full p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center text-purple-100 text-sm">
          <span>Total: {summary.totalStudents} students</span>
        </div>
      </div>
    </div>
  );
}