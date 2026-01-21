'use client';

import React, { useEffect, useState } from 'react';
import AgentPerformanceTable from '@/components/tables/AgentPerformanceTable';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';

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

interface ApiResponse {
  success: boolean;
  data: AgentPerformance[];
  count: number;
  error?: string;
}

const AgentPerformancePage = () => {
  const [agents, setAgents] = useState<AgentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgentPerformance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/agents/performance');
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setAgents(result.data);
      } else {
        setError(result.error || 'Failed to fetch agent performance data');
      }
    } catch (err) {
      setError('Error fetching agent performance data');
      console.error('Error fetching agent performance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentPerformance();
  }, []);

  // Calculate summary stats
  const totalAgents = agents.length;
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalStudents = agents.reduce((sum, agent) => sum + agent.totalStudents, 0);
  const averageCOERate = totalAgents > 0 
    ? (agents.reduce((sum, agent) => sum + agent.coeApprovalRate, 0) / totalAgents).toFixed(1)
    : '0.0';
  const averageVisaRate = totalAgents > 0
    ? (agents.reduce((sum, agent) => sum + agent.visaSuccessRate, 0) / totalAgents).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <>
        <PageBreadCrumb
          pageTitle="Agent Performance"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading agent performance data...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageBreadCrumb
          pageTitle="Agent Performance"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                  <button
                    onClick={fetchAgentPerformance}
                    className="mt-2 text-sm text-red-800 dark:text-red-400 underline hover:no-underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadCrumb
        pageTitle="Agent Performance"
      />
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent Performance</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Track agent success rates and performance metrics
            </p>
          </div>
          <button
            onClick={fetchAgentPerformance}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Refresh Data
          </button>
        </div>

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-6">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Agents
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {totalAgents}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Active Agents
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {activeAgents}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">👨‍🎓</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Students
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {totalStudents}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📄</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Avg COE Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {averageCOERate}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🛂</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Avg Visa Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {averageVisaRate}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ComponentCard
        title="Agent Performance Metrics"
        desc="Detailed performance statistics for all agents including COE approval and visa success rates"
      >
        <AgentPerformanceTable agents={agents} />
      </ComponentCard>
    </>
  );
};

export default AgentPerformancePage;