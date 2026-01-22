'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';

interface Student {
  id: number;
  firstName: string | null;
  familyName: string | null;
  emailAddress: string | null;
  courseCode: string | null;
  courseName: string | null;
  coeCode: string | null;
  visaGrantNumber: string | null;
  visaGrantStatus: string | null;
  coeStatus: string | null;
  agentId: number | null;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Student[];
  totalCount: number;
  showing: number;
  agentId: string;
  error?: string;
}

interface AgentStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
}

const AgentStudentsModal: React.FC<AgentStudentsModalProps> = ({
  isOpen,
  onClose,
  agentId,
  agentName,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && agentId) {
      fetchStudents();
    }
  }, [isOpen, agentId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/students?agentId=${agentId}`);
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setStudents(result.data);
      } else {
        setError(result.error || 'Failed to fetch students');
      }
    } catch (err) {
      setError('Error fetching students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return 'light';
    switch (status.toLowerCase()) {
      case 'studying':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Students Assigned to {agentName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Agent ID: {agentId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <span className="ml-2">Loading students...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="text-red-600 dark:text-red-400">{error}</div>
                <button 
                  onClick={fetchStudents}
                  className="mt-2 text-blue-600 dark:text-blue-400 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && students.length === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No students assigned</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  This agent doesn't have any students assigned yet.
                </p>
              </div>
            )}

            {!loading && !error && students.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {students.length} students
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="border-b border-gray-200 dark:border-gray-700">
                      <TableRow>
                        <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Student
                        </TableCell>
                        <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Email
                        </TableCell>
                        <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Course
                        </TableCell>
                        <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          COE Status
                        </TableCell>
                        <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Visa Status
                        </TableCell>
                        
                        <TableCell isHeader className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Enrolled
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {students.map((student) => (
                        <TableRow key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <TableCell className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {(student.firstName || student.familyName || 'U').charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {student.firstName || 'N/A'} {student.familyName || ''}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {student.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-900 dark:text-white">
                            {student.emailAddress || 'N/A'}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <div>
                              <div className="text-gray-900 dark:text-white font-medium">
                                {student.courseCode || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {student.courseName || 'N/A'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              <Badge 
                                size="sm" 
                                color={getStatusColor(student.coeStatus)}
                              >
                                {student.coeStatus || 'Unknown'}
                              </Badge>
                              {student.coeCode && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {student.coeCode}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              <Badge 
                                size="sm" 
                                color={getStatusColor(student.visaGrantStatus)}
                              >
                                {student.visaGrantStatus || 'Unknown'}
                              </Badge>
                              {student.visaGrantNumber && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {student.visaGrantNumber}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(student.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentStudentsModal;