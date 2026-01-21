export interface MonthlyStats {
  month: string;
  applications: number;
  approvals: number;
}

export interface AgentPerformanceData {
  month: string;
  totalAgents: number;
  lowPerformingAgents: number;
}

export interface DemographicData {
  country: string;
  students: number;
  percentage: number;
}

export interface OverviewStats {
  totalStudents: number;
  totalAgents: number;
  coeApproved: number;
  visaApproved: number;
  pendingApplications: number;
  lowPerformingAgents: number;
  studentGrowth: number;
  agentGrowth: number;
}

export interface AgentPerformanceStats {
  totalApplications: number;
  approvalRate: number;
  currentMonth: number;
  target: number;
}

export interface MetricsData {
  overview?: OverviewStats;
  monthlyApplications?: MonthlyStats[];
  monthlyAgentPerformance?: AgentPerformanceData[];
  visaStatistics?: any;
  coeStatistics?: any;
  demographics?: DemographicData[];
  agentPerformance?: AgentPerformanceStats;
}

export interface StudentData {
  success: boolean;
  data: any[];
  count: number;
}

export interface DashboardData {
  metrics?: MetricsData;
  studentData?: StudentData;
}
