"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

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

interface TransactionsData {
  transactions: AgentTransaction[];
  totals: {
    totalAgents: number;
    totalApprovedStudents: number;
    totalCourseValue: number;
    totalCommissions: number;
  };
  commissionRate: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const getPerformanceBadgeColor = (approved: number, total: number) => {
  const rate = total > 0 ? (approved / total) * 100 : 0;
  if (rate >= 70) return 'green';
  if (rate >= 50) return 'yellow';
  return 'red';
};

const getPerformanceLabel = (approved: number, total: number) => {
  const rate = total > 0 ? (approved / total) * 100 : 0;
  return `${approved}/${total} (${rate.toFixed(1)}%)`;
};

export default function TransactionsTable() {
  const [data, setData] = useState<TransactionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || 'Failed to fetch transactions');
        }
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
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
          No transaction data available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">Total Agents</div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {data.totals.totalAgents}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium mb-2">Approved Students</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {data.totals.totalApprovedStudents}
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-2">Total Course Value</div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {formatCurrency(data.totals.totalCourseValue)}
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
          <div className="text-orange-600 dark:text-orange-400 text-sm font-medium mb-2">Total Commissions</div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {formatCurrency(data.totals.totalCommissions)}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              <TableCell className="font-semibold px-6 py-4 text-left">Agent Name</TableCell>
              <TableCell className="font-semibold px-6 py-4 text-left">Email</TableCell>
              <TableCell className="font-semibold px-6 py-4 text-left">Students</TableCell>
              <TableCell className="font-semibold px-6 py-4 text-left">Approval Rate</TableCell>
              <TableCell className="font-semibold px-6 py-4 text-left">Course Value</TableCell>
              <TableCell className="font-semibold px-6 py-4 text-left">Commission ({data.commissionRate}%)</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.transactions.map((transaction, index) => (
              <TableRow 
                key={transaction.agentId}
                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  index === data.transactions.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <TableCell className="font-medium px-6 py-4">
                  {transaction.agentName}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400 px-6 py-4">
                  {transaction.agentEmail}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="text-sm">
                    <div>Total: {transaction.totalStudents}</div>
                    <div className="text-green-600 dark:text-green-400">
                      Approved: {transaction.approvedStudents}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    color={getPerformanceBadgeColor(transaction.approvedStudents, transaction.totalStudents)}
                    variant="solid"
                  >
                    {getPerformanceLabel(transaction.approvedStudents, transaction.totalStudents)}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium px-6 py-4">
                  {formatCurrency(transaction.totalCourseValue)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(transaction.commission)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Commission Rate Note */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          * Commission calculated at {data.commissionRate}% of total course fees for students with approved visas (In Effect status)
        </p>
      </div>
    </div>
  );
}