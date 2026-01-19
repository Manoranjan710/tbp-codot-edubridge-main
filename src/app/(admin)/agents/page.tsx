'use client';

import React, { useEffect, useState } from 'react';
import AgentsTable from '@/components/tables/AgentsTable';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import AgentStudentsModal from '@/components/modals/AgentStudentsModal';

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

const AgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedAgentName, setSelectedAgentName] = useState<string>('');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/agents');
        const result: ApiResponse = await response.json();
        
        if (result.success) {
          setAgents(result.data);
        } else {
          setError(result.error || 'Failed to fetch agents');
        }
      } catch (err) {
        setError('Error fetching agents');
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleViewStudents = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgentId(agentId);
      setSelectedAgentName(`${agent.first_name} ${agent.last_name}`);
    }
  };

  const handleCloseModal = () => {
    setSelectedAgentId(null);
    setSelectedAgentName('');
  };

  if (loading) {
    return (
      <>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading agents...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agents</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and view all registered agents ({agents.length} total)
          </p>
        </div>
      </div>
      
      <ComponentCard
        title="All Agents"
        desc="Complete list of all agents in the system"
      >
        <AgentsTable agents={agents} onViewStudents={handleViewStudents} />
      </ComponentCard>

      {/* Agent Students Modal */}
      {selectedAgentId && (
        <AgentStudentsModal
          isOpen={!!selectedAgentId}
          onClose={handleCloseModal}
          agentId={selectedAgentId}
          agentName={selectedAgentName}
        />
      )}
    </>
  );
};

export default AgentsPage;