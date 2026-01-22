import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Pagination from "../ui/pagination/Pagination";
import { usePagination } from "@/hooks/usePagination";

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

interface StudentsTableProps {
  students: Student[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getVisaStatus = (visaGrantStatus: string | null, coeStatus: string | null) => {
  // Case 1: If visaGrantStatus has one of these values, show it as is
  if (visaGrantStatus) {
    const lower = visaGrantStatus.toLowerCase();
    if (lower === 'in effect' || lower === 'cancelled' || lower === 'ceased') {
      return visaGrantStatus;
    }
  }
  
  // Case 2: If visaGrantStatus is null, check coeStatus
  if (!visaGrantStatus && coeStatus) {
    const coeStatusLower = coeStatus.toLowerCase();
    
    if (coeStatusLower === 'cancelled') {
      return 'Cancelled';
    }
    
    if (coeStatusLower === 'approved') {
      return 'Awaiting approval';
    }
  }
  
  return null;
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
    case 'awaiting visa approval':
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

export default function StudentsTable({ students }: StudentsTableProps) {
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
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm mt-2">There are currently no students in the system.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1400px]">
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
                  Course
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Visa Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Created
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {currentStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {(student.firstName?.charAt(0) || '')}{(student.familyName?.charAt(0) || '')}
                        </span>
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 max-w-[100px] truncate" title={`${student.firstName || ''} ${student.familyName || ''}`}>
                          {((student.firstName || '') + ' ' + (student.familyName || '')).length > 10 
                            ? ((student.firstName || '') + ' ' + (student.familyName || '')).substring(0, 10) + '...'
                            : `${student.firstName || ''} ${student.familyName || ''}`}
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
                      <span className="block font-medium text-gray-800 dark:text-white/90">
                        {student.coeCode || 'N/A'}
                      </span>
                      <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                        {student.coeType || 'N/A'}
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
                      <span className="block font-medium text-gray-800 dark:text-white/90 max-w-[200px] truncate" title={student.courseName || 'N/A'}>
                        {student.courseName || 'N/A'}
                      </span>
                      <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                        {student.courseCode || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {(() => {
                      const visaStatus = getVisaStatus(student.visaGrantStatus, student.coeStatus);
                      return (
                        <Badge
                          size="sm"
                          color={getVisaStatusBadgeColor(visaStatus)}
                        >
                          {visaStatus ? visaStatus.charAt(0).toUpperCase() + visaStatus.slice(1) : 'N/A'}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div>
                      <span className="block">{formatDate(student.createdAt)}</span>
                      <span className="block text-theme-xs text-gray-400 dark:text-gray-500">
                        {new Date(student.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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