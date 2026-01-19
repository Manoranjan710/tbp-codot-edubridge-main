import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

interface TopAgent {
  agentName: string;
  revenue: number;
  commission: number;
  students: number;
}

interface TopAgentsTableProps {
  agents: TopAgent[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getPerformanceBadge = (revenue: number, maxRevenue: number) => {
  const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
  
  if (percentage >= 80) {
    return { color: 'green' as const, label: 'Excellent' };
  } else if (percentage >= 60) {
    return { color: 'blue' as const, label: 'Very Good' };
  } else if (percentage >= 40) {
    return { color: 'yellow' as const, label: 'Good' };
  } else {
    return { color: 'gray' as const, label: 'Average' };
  }
};

export default function TopAgentsTable({ agents }: TopAgentsTableProps) {
  const maxRevenue = Math.max(...agents.map(agent => agent.revenue));

  if (agents.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No agent data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow className="border-b border-gray-200 dark:border-gray-700">
            <TableCell className="font-semibold px-6 py-4 text-left">Rank</TableCell>
            <TableCell className="font-semibold px-6 py-4 text-left">Agent Name</TableCell>
            <TableCell className="font-semibold px-6 py-4 text-left">Revenue Generated</TableCell>
            <TableCell className="font-semibold px-6 py-4 text-left">Commission Paid</TableCell>
            <TableCell className="font-semibold px-6 py-4 text-left">Students</TableCell>
            <TableCell className="font-semibold px-6 py-4 text-left">Performance</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent, index) => {
            const badge = getPerformanceBadge(agent.revenue, maxRevenue);
            return (
              <TableRow 
                key={agent.agentName}
                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  index === agents.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                      ${index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-600' : 'bg-blue-500'}
                    `}>
                      {index + 1}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium px-6 py-4">
                  {agent.agentName}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(agent.revenue)}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="text-orange-600 dark:text-orange-400">
                    {formatCurrency(agent.commission)}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="text-center">
                    <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                      {agent.students}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge color={badge.color} variant="solid">
                    {badge.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}