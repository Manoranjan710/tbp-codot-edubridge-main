import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";

interface LowPerformingAgent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  status: string;
  totalStudents: number;
  visaApplications: number;
  visaGranted: number;
  visaRejected: number;
  visaRejectionRate: number;
  visaSuccessRate: number;
  createdAt: string;
  updatedAt: string;
}

interface LowPerformingAgentsTableProps {
  agents: LowPerformingAgent[];
  onBlockAgent: (agentId: string, action: 'block' | 'unblock') => Promise<void>;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'error';
    case 'pending':
      return 'warning';
    case 'blocked':
      return 'error';
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

const getRiskLevel = (rejectionRate: number) => {
  if (rejectionRate >= 80) {
    return { level: 'CRITICAL', color: 'bg-red-600', textColor: 'text-white' };
  } else if (rejectionRate >= 70) {
    return { level: 'HIGH', color: 'bg-red-500', textColor: 'text-white' };
  } else if (rejectionRate >= 60) {
    return { level: 'MEDIUM', color: 'bg-orange-500', textColor: 'text-white' };
  } else {
    return { level: 'LOW', color: 'bg-yellow-500', textColor: 'text-white' };
  }
};

export default function LowPerformingAgentsTable({ agents, onBlockAgent }: LowPerformingAgentsTableProps) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleAction = async (agentId: string, action: 'block' | 'unblock') => {
    setProcessingIds(prev => new Set(prev).add(agentId));
    try {
      await onBlockAgent(agentId, action);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentId);
        return newSet;
      });
    }
  };

  if (!agents || agents.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-lg font-medium text-green-600 dark:text-green-400">Great news! No low-performing agents found</p>
            <p className="text-sm mt-2">All agents are maintaining visa rejection rates below 80%.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1500px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-red-50 dark:bg-red-900/10">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Risk Level
                </TableCell>
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
                  Visa Applications
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Rejections
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Rejection Rate
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {agents.map((agent, index) => {
                const riskLevel = getRiskLevel(agent.visaRejectionRate);
                const isBlocked = agent.status.toLowerCase() === 'blocked';
                const isProcessing = processingIds.has(agent.id);
                
                return (
                  <TableRow 
                    key={agent.id} 
                    className="hover:bg-red-50 dark:hover:bg-red-900/10 border-l-4 border-red-500"
                  >
                    <TableCell className="px-5 py-4 text-start">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${riskLevel.color} ${riskLevel.textColor}`}>
                        {riskLevel.level}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {agent.first_name.charAt(0)}{agent.last_name.charAt(0)}
                          </div>
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">!</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {agent.first_name} {agent.last_name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            ID: {agent.id} {isBlocked && <span className="text-red-500 font-medium">• BLOCKED</span>}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <a 
                        href={`mailto:${agent.email}`}
                        className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
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
                        {agent.visaApplications}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        applications
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                        {agent.visaRejected}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        rejected
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {agent.visaRejectionRate}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Success: {agent.visaSuccessRate}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div 
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${agent.visaRejectionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex flex-col gap-2">
                        {!isBlocked ? (
                          <Button
                            size="sm"
                            color="error"
                            onClick={() => handleAction(agent.id, 'block')}
                            disabled={isProcessing}
                            className="min-w-[80px]"
                          >
                            {isProcessing ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>...</span>
                              </div>
                            ) : (
                              '🚫 Block'
                            )}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            color="success"
                            onClick={() => handleAction(agent.id, 'unblock')}
                            disabled={isProcessing}
                            className="min-w-[80px]"
                          >
                            {isProcessing ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>...</span>
                              </div>
                            ) : (
                              '✅ Unblock'
                            )}
                          </Button>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Since: {formatDate(agent.createdAt)}
                        </div>
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