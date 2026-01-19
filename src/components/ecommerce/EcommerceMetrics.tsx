"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, UserCircleIcon, CheckCircleIcon } from "@/icons";

interface MetricsData {
  overview: {
    totalStudents: number;
    totalAgents: number;
    coeApproved: number;
    visaApproved: number;
    pendingApplications: number;
    lowPerformingAgents: number;
    studentGrowth: number;
    agentGrowth: number;
  };
}

export const EcommerceMetrics = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/dashboard/metrics');
        const result = await response.json();
        if (result.success) {
          setMetrics(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
            <div className="mt-5">
              <div className="w-16 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="w-20 h-6 mt-2 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Total Students */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
          <GroupIcon className="text-blue-600 size-6 dark:text-blue-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Students
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics?.overview.totalStudents?.toLocaleString() || 0}
            </h4>
          </div>
          <Badge color={metrics?.overview.studentGrowth >= 0 ? "success" : "error"}>
            {metrics?.overview.studentGrowth >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(metrics?.overview.studentGrowth || 0)}%
          </Badge>
        </div>
      </div>

      {/* Total Agents */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/20">
          <UserCircleIcon className="text-green-600 size-6 dark:text-green-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Active Agents
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics?.overview.totalAgents?.toLocaleString() || 0}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            {metrics?.overview.agentGrowth || 0}%
          </Badge>
        </div>
      </div>

      {/* COE Approved */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/20">
          <CheckCircleIcon className="text-purple-600 size-6 dark:text-purple-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              COE Approved
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics?.overview.coeApproved?.toLocaleString() || 0}
            </h4>
          </div>

          <Badge color="info">
            <CheckCircleIcon className="w-3 h-3" />
            Active
          </Badge>
        </div>
      </div>

      {/* Visa Approved */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/20">
          <BoxIconLine className="text-orange-600 size-6 dark:text-orange-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Visa Approved
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics?.overview.visaApproved?.toLocaleString() || 0}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            In Effect
          </Badge>
        </div>
      </div>
    </div>
  );
};
