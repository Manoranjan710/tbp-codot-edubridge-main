import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";

interface UpdatedStudent {
  id: number;
  passportNumber: string;
  firstName: string | null;
  familyName: string | null;
  previousVisaGranted: string | null;
  previousVisaStatus: string | null;
  previousVisaNumber: string | null;
  newVisaGranted: string;
  newVisaStatus: string;
  newVisaNumber: string;
  agentName: string | null;
  courseCode: string | null;
  courseName: string | null;
}

interface VisaStatusResultsProps {
  students: UpdatedStudent[];
}

const getVisaStatusBadgeColor = (status: string | null) => {
  if (!status) return 'light';
  
  switch (status.toLowerCase()) {
    case 'in effect':
    case 'granted':
    case 'approved':
      return 'success';
    case 'cancelled':
    case 'refused':
    case 'rejected':
      return 'error';
    case 'expired':
    case 'withdrawn':
      return 'warning';
    case 'pending':
    case 'under review':
      return 'info';
    default:
      return 'light';
  }
};

const convertToCSV = (students: UpdatedStudent[]): string => {
  const headers = [
    'Student ID',
    'Passport Number',
    'First Name',
    'Family Name',
    'Agent Name',
    'Course Code',
    'Course Name',
    'Previous Visa Granted',
    'Previous Visa Status',
    'Previous Visa Number',
    'New Visa Granted',
    'New Visa Status',
    'New Visa Number'
  ];

  const csvContent = [
    headers.join(','),
    ...students.map(student => [
      student.id,
      `"${student.passportNumber}"`,
      `"${student.firstName || ''}"`,
      `"${student.familyName || ''}"`,
      `"${student.agentName || ''}"`,
      `"${student.courseCode || ''}"`,
      `"${student.courseName || ''}"`,
      `"${student.previousVisaGranted || ''}"`,
      `"${student.previousVisaStatus || ''}"`,
      `"${student.previousVisaNumber || ''}"`,
      `"${student.newVisaGranted}"`,
      `"${student.newVisaStatus}"`,
      `"${student.newVisaNumber}"`
    ].join(','))
  ].join('\n');

  return csvContent;
};

const downloadCSV = (students: UpdatedStudent[]) => {
  const csv = convertToCSV(students);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `visa-status-updates-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const VisaStatusResults: React.FC<VisaStatusResultsProps> = ({ students }) => {
  if (!students || students.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No updated students to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          size="sm"
          color="primary"
          onClick={() => downloadCSV(students)}
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Results
        </Button>
      </div>

      {/* Results Table */}
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
                    Student
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Passport Number
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Agent & Course
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Previous Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    New Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Visa Number
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {students.map((student) => (
                  <TableRow key={student.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {(student.firstName?.charAt(0) || '?')}{(student.familyName?.charAt(0) || '')}
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {student.firstName || 'N/A'} {student.familyName || ''}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            ID: {student.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>
                        <span className="block font-medium text-gray-800 dark:text-white/90">
                          {student.passportNumber}
                        </span>
                        <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                          Passport
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>
                        <span className="block font-medium text-gray-800 dark:text-white/90">
                          {student.agentName || 'N/A'}
                        </span>
                        <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                          {student.courseCode || 'N/A'} - {student.courseName || 'N/A'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="space-y-1">
                        <div>
                          <span className="block text-theme-xs text-gray-500 dark:text-gray-400">Granted:</span>
                          <span className="block font-medium">
                            {student.previousVisaGranted || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <Badge
                            size="sm"
                            color={getVisaStatusBadgeColor(student.previousVisaStatus)}
                          >
                            {student.previousVisaStatus || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="space-y-1">
                        <div>
                          <span className="block text-theme-xs text-gray-500 dark:text-gray-400">Granted:</span>
                          <span className="block font-medium text-green-600 dark:text-green-400">
                            {student.newVisaGranted}
                          </span>
                        </div>
                        <div>
                          <Badge
                            size="sm"
                            color={getVisaStatusBadgeColor(student.newVisaStatus)}
                          >
                            {student.newVisaStatus}
                          </Badge>
                        </div>
                        <div className="text-theme-xs">
                          <span className="text-green-600 dark:text-green-400">✓ Updated</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="space-y-1">
                        <div>
                          <span className="block text-theme-xs text-gray-500 dark:text-gray-400">Previous:</span>
                          <span className="block font-mono text-sm">
                            {student.previousVisaNumber || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-theme-xs text-gray-500 dark:text-gray-400">New:</span>
                          <span className="block font-mono text-sm font-medium text-green-600 dark:text-green-400">
                            {student.newVisaNumber || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaStatusResults;