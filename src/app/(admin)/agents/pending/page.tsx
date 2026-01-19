'use client';

import React, { useEffect, useState } from 'react';
import PendingAgentsTable from '@/components/tables/PendingAgentsTable';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';

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

interface ApiResponse {
  success: boolean;
  data: Agent[];
  count: number;
  error?: string;
}

const PendingAgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agents?status=pending');
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setAgents(result.data);
      } else {
        setError(result.error || 'Failed to fetch pending agents');
      }
    } catch (err) {
      setError('Error fetching pending agents');
      console.error('Error fetching pending agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAgents();
  }, []);

  const handleApprove = async (agentId: string) => {
    try {
      const response = await fetch('/api/agents', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: agentId,
          status: 'active'
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the pending agents list
        await fetchPendingAgents();
      } else {
        setError(result.error || 'Failed to approve agent');
      }
    } catch (err) {
      setError('Error approving agent');
      console.error('Error approving agent:', err);
    }
  };

  if (loading) {
    return (
      <>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading pending agents...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
       
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
                      fetchPendingAgents();
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

  return (
    <>
      
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Agents</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Review and approve agent applications ({agents.length} pending approval)
          </p>
        </div>
        <button
          onClick={fetchPendingAgents}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Refresh
        </button>
      </div>
      
      <ComponentCard
        title="Agents Awaiting Approval"
        desc="Review agent details and approve their applications"
      >
        <PendingAgentsTable agents={agents} onApprove={handleApprove} />
      </ComponentCard>
    </>
  );
};

export default PendingAgentsPage;