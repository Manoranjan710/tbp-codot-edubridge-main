'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import StudentsTable from '@/components/tables/StudentsTable';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';

interface Student {
  id: number;
  agentId: number | null;
  providerCode: string | null;
  coeCode: string | null;
  coeStatus: string | null;
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
  count: number;
  error?: string;
}

const StudentsPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Wait for user to be loaded
      if (!user) {
        return;
      }

      try {
        setLoading(true);
        let response;

        if (user.role === 'agent' && user.id) {
          // If user is an agent, fetch their students
          response = await fetch(`/api/agents/${user.id}/students`);
        } else if (user.role === 'admin') {
          // If user is admin, fetch all students
          response = await fetch('/api/students');
        } else {
          setError('Invalid user role');
          setLoading(false);
          return;
        }

        if (!response) {
          setError('Failed to fetch data');
          setLoading(false);
          return;
        }

        const result: ApiResponse = await response.json();
        if (result.success) {
          setStudents(result.data);
        } else {
          setError(result.error || 'Failed to fetch students');
        }
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <>
        <PageBreadCrumb title="Students" />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading students...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageBreadCrumb title="Students" />
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
      <PageBreadCrumb title="Students" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {user?.role === 'agent'
              ? `Your students (${students.length} total)`
              : `Manage and view all registered students (${students.length} total)`
            }
          </p>
        </div>
      </div>

      <ComponentCard
        title={user?.role === 'agent' ? 'My Students' : 'All Students'}
        desc={user?.role === 'agent'
          ? 'Students assigned to you'
          : 'Complete list of all students in the system'
        }
      >
        <StudentsTable students={students} />
      </ComponentCard>
    </>
  );
};

export default StudentsPage;