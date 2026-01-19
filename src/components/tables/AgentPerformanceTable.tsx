import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

interface AgentPerformance {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  status: string;
  totalStudents: number;
  approvedCOE: number;
  visaGranted: number;
  coeApprovalRate: number;
  visaSuccessRate: number;
  createdAt: string;
  updatedAt: string;
}

interface AgentPerformanceTableProps {
  agents: AgentPerformance[];
}

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'light';
  }
};

const getCountryFlag = (country: string) => {
  const countryFlags: { [key: string]: string } = {
    'Australia': '🇦🇺',
    'Canada': '🇨🇦',
    'USA': '🇺🇸',
    'India': '🇮🇳',
    'Brazil': '🇧🇷',
    'UK': '🇬🇧',
    'United Kingdom': '🇬🇧',
  };
  return countryFlags[country] || '🌐';
};

const getPerformanceColor = (rate: number) => {
  if (rate >= 80) return 'text-green-600 dark:text-green-400';
  if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (rate >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
};

const getPerformanceGrade = (rate: number) => {
  if (rate >= 90) return { grade: 'A+', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
  if (rate >= 80) return { grade: 'A', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
  if (rate >= 70) return { grade: 'B', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
  if (rate >= 60) return { grade: 'C', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
  if (rate >= 50) return { grade: 'D', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' };
  return { grade: 'F', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
};

export default function AgentPerformanceTable({ agents }: AgentPerformanceTableProps) {
  if (!agents || agents.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg font-medium">No performance data available</p>
            <p className="text-sm mt-2">Performance metrics will appear here once agents have students assigned.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1400px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Agent
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Country
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Total Students
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  COE Approved
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Visa Granted
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  COE Success Rate
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Visa Success Rate
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {agents
                .sort((a, b) => (b.coeApprovalRate + b.visaSuccessRate) - (a.coeApprovalRate + a.visaSuccessRate)) // Sort by combined performance
                .map((agent, index) => {
                  const coeGrade = getPerformanceGrade(agent.coeApprovalRate);
                  const visaGrade = getPerformanceGrade(agent.visaSuccessRate);
                  
                  return (
                    <TableRow key={agent.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                              index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                              'bg-gradient-to-r from-blue-500 to-purple-600'
                            }`}>
                              {agent.first_name.charAt(0)}{agent.last_name.charAt(0)}
                            </div>
                            {index < 3 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-xs">
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {agent.first_name} {agent.last_name}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              ID: {agent.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <a 
                          href={`mailto:${agent.email}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {agent.email}
                        </a>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCountryFlag(agent.country)}</span>
                          <span>{agent.country}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={getStatusBadgeColor(agent.status)}
                        >
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {agent.totalStudents}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          students
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {agent.approvedCOE}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          of {agent.totalStudents}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {agent.visaGranted}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          of {agent.totalStudents}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`text-lg font-bold ${getPerformanceColor(agent.coeApprovalRate)}`}>
                            {agent.coeApprovalRate.toFixed(1)}%
                          </div>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${coeGrade.color}`}>
                            {coeGrade.grade}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`text-lg font-bold ${getPerformanceColor(agent.visaSuccessRate)}`}>
                            {agent.visaSuccessRate.toFixed(1)}%
                          </div>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${visaGrade.color}`}>
                            {visaGrade.grade}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}