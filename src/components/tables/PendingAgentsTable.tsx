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

interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  country: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PendingAgentsTableProps {
  agents: Agent[];
  onApprove: (agentId: string) => Promise<void>;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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

export default function PendingAgentsTable({ agents, onApprove }: PendingAgentsTableProps) {
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set());

  const handleApprove = async (agentId: string) => {
    setApprovingIds(prev => new Set(prev).add(agentId));
    try {
      await onApprove(agentId);
    } finally {
      setApprovingIds(prev => {
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
            <div className="mx-auto h-16 w-16 text-6xl mb-4">✅</div>
            <p className="text-lg font-medium">No pending agents</p>
            <p className="text-sm mt-2">All agent applications have been reviewed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1200px]">
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
                  Address
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
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Applied
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
              {agents.map((agent) => (
                <TableRow key={agent.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {agent.first_name.charAt(0)}{agent.last_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {agent.first_name} {agent.last_name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          ID: {agent.id.slice(0, 8)}...
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
                    <span className="max-w-[200px] truncate block" title={agent.address}>
                      {agent.address}
                    </span>
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
                      color="warning"
                    >
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div>
                      <span className="block">{formatDate(agent.createdAt)}</span>
                      <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                        {new Date(agent.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        color="success"
                        onClick={() => handleApprove(agent.id)}
                        disabled={approvingIds.has(agent.id)}
                        className="min-w-[80px]"
                      >
                        {approvingIds.has(agent.id) ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>...</span>
                          </div>
                        ) : (
                          'Approve'
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        color="error"
                        onClick={() => {
                          // TODO: Implement reject functionality if needed
                          alert('Reject functionality not implemented yet');
                        }}
                        className="min-w-[80px]"
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}