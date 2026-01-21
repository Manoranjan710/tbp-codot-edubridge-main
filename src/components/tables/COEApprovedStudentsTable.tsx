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
import { usePagination } from "@/hooks/usePagination";
import Pagination from "../ui/pagination/Pagination";

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
  passportNumber: string | null;
  emailAddress: string | null;
  mobile: string | null;
  courseCode: string | null;
  courseName: string | null;
  coeCreatedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface COEApprovedStudentsTableProps {
  students: Student[];
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

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

const getCountryFlag = (country: string | null) => {
  if (!country) return '🌐';
  
  const countryFlags: { [key: string]: string } = {
    'Australia': '🇦🇺',
    'Canada': '🇨🇦',
    'USA': '🇺🇸',
    'India': '🇮🇳',
    'Brazil': '🇧🇷',
    'UK': '🇬🇧',
    'United Kingdom': '🇬🇧',
    'China': '🇨🇳',
    'Nepal': '🇳🇵',
    'Bangladesh': '🇧🇩',
    'Pakistan': '🇵🇰',
    'Sri Lanka': '🇱🇰',
    'Philippines': '🇵🇭',
    'Thailand': '🇹🇭',
    'Vietnam': '🇻🇳',
    'Indonesia': '🇮🇩',
    'Malaysia': '🇲🇾',
    'Singapore': '🇸🇬',
    'South Korea': '🇰🇷',
    'Japan': '🇯🇵',
    'Saudi Arabia': '🇸🇦',
    'UAE': '🇦🇪',
    'Iran': '🇮🇷',
    'Turkey': '🇹🇷',
    'Egypt': '🇪🇬',
    'Nigeria': '🇳🇬',
    'Kenya': '🇰🇪',
    'South Africa': '🇿🇦',
    'Ghana': '🇬🇭',
    'Ethiopia': '🇪🇹',
    'Morocco': '🇲🇦',
    'Tunisia': '🇹🇳',
    'Zimbabwe': '🇿🇼',
    'Zambia': '🇿🇲',
    'Tanzania': '🇹🇿',
    'Uganda': '🇺🇬',
    'Rwanda': '🇷🇼',
    'Botswana': '🇧🇼',
    'Mauritius': '🇲🇺',
    'Fiji': '🇫🇯',
    'Papua New Guinea': '🇵🇬',
    'New Zealand': '🇳🇿',
    'Samoa': '🇼🇸',
    'Tonga': '🇹🇴',
    'Vanuatu': '🇻🇺',
    'Solomon Islands': '🇸🇧',
    'Palau': '🇵🇼',
    'Marshall Islands': '🇲🇭',
    'Micronesia': '🇫🇲',
    'Kiribati': '🇰🇮',
    'Nauru': '🇳🇷',
    'Tuvalu': '🇹🇻',
    'Bhutan': '🇧🇹'
  };
  return countryFlags[country] || '🌐';
};

const convertToCSV = (students: Student[]): string => {
  const headers = [
    'ID',
    'First Name',
    'Family Name',
    'Gender',
    'Date of Birth',
    'Country of Birth',
    'Nationality',
    'Passport Number',
    'Email Address',
    'Mobile',
    'Agent Name',
    'Agent ID',
    'Provider Code',
    'COE Code',
    'COE Status',
    'COE Type',
    'COE Created Date',
    'Course Code',
    'Course Name',
    'Visa Granted',
    'Visa Grant Status',
    'Visa Grant Number',
    'Created At',
    'Updated At'
  ];

  const csvContent = [
    headers.join(','),
    ...students.map(student => [
      student.id,
      `"${student.firstName || ''}"`,
      `"${student.familyName || ''}"`,
      `"${student.gender || ''}"`,
      `"${student.dateOfBirth || ''}"`,
      `"${student.countryOfBirth || ''}"`,
      `"${student.nationality || ''}"`,
      `"${student.passportNumber || ''}"`,
      `"${student.emailAddress || ''}"`,
      `"${student.mobile || ''}"`,
      `"${student.agentName || ''}"`,
      student.agentId || '',
      `"${student.providerCode || ''}"`,
      `"${student.coeCode || ''}"`,
      `"${student.coeStatus || ''}"`,
      `"${student.coeType || ''}"`,
      `"${student.coeCreatedDate || ''}"`,
      `"${student.courseCode || ''}"`,
      `"${student.courseName || ''}"`,
      `"${student.visaGranted || ''}"`,
      `"${student.visaGrantStatus || ''}"`,
      `"${student.visaGrantNumber || ''}"`,
      `"${student.createdAt}"`,
      `"${student.updatedAt}"`
    ].join(','))
  ].join('\n');

  return csvContent;
};

const downloadCSV = (students: Student[]) => {
  const csv = convertToCSV(students);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `coe-approved-students-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function COEApprovedStudentsTable({ students }: COEApprovedStudentsTableProps) {
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    itemsPerPage,
    goToPage
  } = usePagination({
    totalItems: students.length,
    itemsPerPage: 20
  });

  const currentStudents = students.slice(startIndex, endIndex);

  if (!students || students.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No COE approved students found</p>
            <p className="text-sm mt-2">There are currently no students with approved COE status.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Download CSV Button */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/[0.05] flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">COE Approved Students</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{students.length} students with approved COE status</p>
        </div>
        <Button
          size="sm"
          color="primary"
          onClick={() => downloadCSV(students)}
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download CSV
        </Button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 w-12 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Student
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Agent Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  COE Details
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Contact
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
                  Passport Number
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Course
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  COE Approved Date
                </TableCell>
                
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {currentStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
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
                        {student.agentName || 'N/A'}
                      </span>
                      <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                        ID: {student.agentId || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div>
                      <span className="block font-medium text-green-600 dark:text-green-400">
                        {student.coeCode || 'N/A'}
                      </span>
                      <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                        {student.coeType || 'N/A'}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-400">
                        ✓ {student.coeStatus}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div>
                      {student.emailAddress && (
                        <a 
                          href={`mailto:${student.emailAddress}`}
                          className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[150px]"
                          title={student.emailAddress}
                        >
                          {student.emailAddress}
                        </a>
                      )}
                      {student.mobile && (
                        <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                          {student.mobile}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCountryFlag(student.countryOfBirth)}</span>
                      <div>
                        <span className="block">{student.countryOfBirth || 'N/A'}</span>
                        {student.nationality && student.nationality !== student.countryOfBirth && (
                          <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                            {student.nationality}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div>
                      <span className="block font-medium text-gray-800 dark:text-white/90">
                        {student.passportNumber || 'N/A'}
                      </span>
                      <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                        Passport
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div>
                      <span className="block font-medium text-gray-800 dark:text-white/90 max-w-[200px] truncate" title={student.courseName || 'N/A'}>
                        {student.courseName || 'N/A'}
                      </span>
                      <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                        {student.courseCode || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div>
                      <span className="block font-medium text-green-600 dark:text-green-400">
                        {formatDate(student.coeCreatedDate)}
                      </span>
                      <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                        COE Approved
                      </span>
                    </div>
                  </TableCell>
                 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={students.length}
        itemsPerPage={itemsPerPage}
        onPageChange={goToPage}
      />
    </div>
  );
}