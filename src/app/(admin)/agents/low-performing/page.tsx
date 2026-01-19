'use client';

import React, { useEffect, useState } from 'react';
import LowPerformingAgentsTable from '@/components/tables/LowPerformingAgentsTable';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';

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

interface ApiResponse {
  success: boolean;
  data: LowPerformingAgent[];
  count: number;
  criteria: string;
  error?: string;
}

const LowPerformingAgentsPage = () => {
  const [agents, setAgents] = useState<LowPerformingAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLowPerformingAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/agents/low-performing');
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setAgents(result.data);
      } else {
        setError(result.error || 'Failed to fetch low-performing agents data');
      }
    } catch (err) {
      setError('Error fetching low-performing agents data');
      console.error('Error fetching low-performing agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowPerformingAgents();
  }, []);

  const handleBlockAgent = async (agentId: string, action: 'block' | 'unblock') => {
    try {
      const response = await fetch('/api/agents/low-performing', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: agentId,
          action: action
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the agents list
        await fetchLowPerformingAgents();
      } else {
        setError(result.error || `Failed to ${action} agent`);
      }
    } catch (err) {
      setError(`Error ${action}ing agent`);
      console.error(`Error ${action}ing agent:`, err);
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadCrumb
          title="Low Performing Agents"
          breadcrumbs={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Agents', href: '/agents' },
            { name: 'Low Performing', href: '/agents/low-performing' },
          ]}
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing agent performance...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageBreadCrumb
          title="Low Performing Agents"
          breadcrumbs={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Agents', href: '/agents' },
            { name: 'Low Performing', href: '/agents/low-performing' },
          ]}
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
                    onClick={() => {
                      setError(null);
                      fetchLowPerformingAgents();
                    }}
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

  const averageRejectionRate = agents.length > 0
    ? (agents.reduce((sum, agent) => sum + agent.visaRejectionRate, 0) / agents.length).toFixed(1)
    : '0.0';

  const totalStudentsAffected = agents.reduce((sum, agent) => sum + agent.totalStudents, 0);
  const totalVisaRejections = agents.reduce((sum, agent) => sum + agent.visaRejected, 0);

  return (
    <>
      <PageBreadCrumb
        title="Low Performing Agents"
        breadcrumbs={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Agents', href: '/agents' },
          { name: 'Low Performing', href: '/agents/low-performing' },
        ]}
      />
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Low Performing Agents</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Agents with visa rejection rates ≥ 80% (minimum 2 applications required)
            </p>
          </div>
          <button
            onClick={fetchLowPerformingAgents}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Refresh Analysis
          </button>
        </div>

        {/* Alert Summary */}
        {agents.length > 0 && (
          <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="text-red-400 text-xl">⚠️</div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                  Performance Alert
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>
                    <strong>{agents.length}</strong> agents are underperforming with high visa rejection rates.
                    This affects <strong>{totalStudentsAffected}</strong> students with <strong>{totalVisaRejections}</strong> visa rejections.
                    Average rejection rate: <strong>{averageRejectionRate}%</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border-l-4 border-red-500">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🚨</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Low Performing Agents
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {agents.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border-l-4 border-orange-500">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">👨‍🎓</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Students Affected
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {totalStudentsAffected}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border-l-4 border-red-600">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">❌</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Visa Rejections
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {totalVisaRejections}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border-l-4 border-yellow-500">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📊</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Avg Rejection Rate
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {averageRejectionRate}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ComponentCard
        title="Critical Performance Review"
        desc="Agents requiring immediate attention due to high visa rejection rates"
      >
        <LowPerformingAgentsTable 
          agents={agents} 
          onBlockAgent={handleBlockAgent}
        />
      </ComponentCard>
    </>
  );
};

export default LowPerformingAgentsPage;