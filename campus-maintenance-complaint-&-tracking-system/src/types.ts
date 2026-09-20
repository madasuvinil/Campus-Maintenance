export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type ComplaintStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export type CategoryType =
  | 'Electrical'
  | 'Plumbing'
  | 'HVAC & AC'
  | 'Carpentry & Furniture'
  | 'Sanitation & Cleaning'
  | 'IT & Smart Classroom'
  | 'Civil & Safety'
  | 'General';

export type RequesterRole = 'Student' | 'Faculty' | 'Hostel Resident' | 'Admin Staff' | 'Guest';

export interface TimelineEvent {
  status: ComplaintStatus;
  note: string;
  timestamp: string;
  author: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: CategoryType;
  priority: PriorityLevel;
  building: string;
  roomNumber: string;
  status: ComplaintStatus;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  requesterRole: RequesterRole;
  technicianName?: string;
  technicianPhone?: string;
  technicianDept?: string;
  resolutionNotes?: string;
  resolutionHours?: number;
  statusNote?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface DepartmentRanking {
  category: string;
  total: number;
  resolved: number;
  resolution_rate: number;
  avg_hours: number;
  efficiency_score: number;
}

export interface DailyTrend {
  date: string;
  total: number;
  resolved: number;
  pending: number;
}

export interface PythonAnalyticsSummary {
  engine: string;
  timestamp: string;
  total_complaints: number;
  resolved_complaints: number;
  pending_complaints: number;
  avg_resolution_hours: number;
  sla_compliance_rate: number;
  status_distribution: Record<string, number>;
  category_distribution: Record<string, number>;
  priority_distribution: Record<string, number>;
  building_distribution: Record<string, number>;
  department_rankings: DepartmentRanking[];
  daily_trends: DailyTrend[];
}
