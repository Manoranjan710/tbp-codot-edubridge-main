'use client';

import React, { useEffect, useState } from 'react';
import StudentsTable from '@/components/tables/StudentsTable';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import { useAuth } from '@/context/AuthContext';

interface Student {
  id: number;
  agentId: number | null;
  agentName: string | null;
  agentFullId: string | null;
  providerCode: string | null;
  coeCode: string | null;
  coeStatus: string | null;
  visaGranted: string | null;
  visaGrantStatus: string | null;
  visaGrantNumber: string | null;
  coeType: string | null;
  firstName: string | null;
  familyName: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  countryOfBirth: string | null;
  nationality: string | null;
  emailAddress: string | null;
  mobile: string | null;
  courseCode: string | null;
  courseName: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Student[];
  totalCount: number;
  showing: number;
  error?: string;
}

const ApprovedStudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchApprovedStudents = async () => {
      if (!user) {
        return;
      }

      try {
        setLoading(true);
        let response;
        if (user?.role === 'agent' && user?.id) {
          response = await fetch(`/api/agents/${user.id}/students?visaGrantStatus=In Effect`);
        } else if (user?.role === 'admin') {
          response = await fetch('/api/students?visaGrantStatus=In Effect');
        } else {
          setError('Unauthorized access');
          setLoading(false);
          return;
        }

        const result: ApiResponse = await response.json();
        
        if (result.success) {
          setStudents(result.data);
        } else {
          setError(result.error || 'Failed to fetch approved students');
        }
      } catch (err) {
        setError('Error fetching approved students');
        console.error('Error fetching approved students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedStudents();
  }, [user]);

  if (loading) {
    return (
      <>
        <PageBreadCrumb title="Approved Students" />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading approved students...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageBreadCrumb title="Approved Students" />
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
      <PageBreadCrumb title="Approved Students" />
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Approved Students</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Students with visa status "In Effect" ({students.length} total)
          </p>
        </div>
      </div>
      
      <ComponentCard
        title="Students with Active Visas"
        desc="Students whose visa grant status is currently in effect"
      >
        <StudentsTable students={students} />
      </ComponentCard>
    </>
  );
};

export default ApprovedStudentsPage;