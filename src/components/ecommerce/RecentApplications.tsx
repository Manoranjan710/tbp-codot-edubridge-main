"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

interface RecentApplication {
  id: number;
  firstName: string;
  familyName: string;
  courseCode: string;
  courseName: string;
  coeStatus: string;
  visaGrantStatus: string;
  countryOfBirth: string;
  agentId: number;
  agentName: string;
  createdAt: string;
}

const getStatusBadgeColor = (status: string) => {
  if (!status || status === 'N/A') return 'light';
  
  switch (status.toLowerCase()) {
    case 'studying':
    case 'approved':
    case 'in effect':
    case 'granted':
      return 'success';
    case 'cancelled':
    case 'refused':
    case 'rejected':
      return 'error';
    case 'pending':
    case 'under review':
      return 'warning';
    case 'finished':
    case 'completed':
      return 'info';
    default:
      return 'light';
  }
};

const getCountryFlag = (country: string) => {
  const countryMappings: { [key: string]: string } = {
    'India': '🇮🇳',
    'Nepal': '🇳🇵',
    'Pakistan': '🇵🇰',
    'Bangladesh': '🇧🇩',
    'China': '🇨🇳',
    'Saudi Arabia': '🇸🇦',
    'Australia': '🇦🇺',
    'USA': '🇺🇸',
    'United States': '🇺🇸'
  };
  return countryMappings[country] || '🌍';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function RecentApplications() {
  const [applications, setApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/students/recent');
        const result = await response.json();
        if (result.success) {
          setApplications(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch recent applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Recent Applications
            </h3>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                <div>
                  <div className="w-32 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                  <div className="w-24 h-3 mt-1 bg-gray-200 rounded dark:bg-gray-700"></div>
                </div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Applications
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Latest 10 student applications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>
      
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Student
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Course
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Agent
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                COE Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Visa Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Applied
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {applications.map((application) => (
              <TableRow key={application.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                      <span className="text-white font-medium text-sm">
                        {application.firstName.charAt(0)}{application.familyName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {application.firstName} {application.familyName}
                      </p>
                      <div className="flex items-center gap-1 text-gray-500 text-theme-xs dark:text-gray-400">
                        <span className="text-base">{getCountryFlag(application.countryOfBirth)}</span>
                        <span>{application.countryOfBirth}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="py-3">
                  <div>
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {application.courseCode}
                    </p>
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {application.courseName.length > 30 
                        ? `${application.courseName.substring(0, 30)}...` 
                        : application.courseName}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div>
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {application.agentName}
                    </p>
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                      ID: {application.agentId}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={getStatusBadgeColor(application.coeStatus)}
                  >
                    {application.coeStatus}
                  </Badge>
                </TableCell>
                
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={getStatusBadgeColor(application.visaGrantStatus)}
                  >
                    {application.visaGrantStatus || 'Pending'}
                  </Badge>
                </TableCell>
                
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {formatDate(application.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}