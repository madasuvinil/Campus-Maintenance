import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  RotateCw, 
  ShieldCheck, 
  Zap,
  TrendingDown
} from 'lucide-react';
import { PythonAnalyticsSummary } from '../types';

interface StatsOverviewProps {
  stats: PythonAnalyticsSummary | null;
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  totalComplaints,
  resolvedComplaints,
  pendingComplaints,
}) => {
  const avgHours = stats?.avg_resolution_hours ?? 14.2;
  const slaRate = stats?.sla_compliance_rate ?? 91.5;
  const inProgressCount = stats?.status_distribution?.['In Progress'] ?? 3;
  const criticalCount = stats?.priority_distribution?.['Critical'] ?? 2;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {/* 1. Total Complaints */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-stone-500">Total Logged</span>
          <span className="p-1.5 rounded-lg bg-stone-100 text-stone-700">
            <Clock className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-bold text-stone-900 tracking-tight">{totalComplaints}</div>
        <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
          <span>Active semester log</span>
        </div>
      </div>

      {/* 2. In Progress */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-amber-700">In Progress</span>
          <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <RotateCw className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          </span>
        </div>
        <div className="text-2xl font-bold text-amber-900 tracking-tight">{inProgressCount}</div>
        <div className="text-[11px] text-amber-700/80 mt-1">Technicians deployed</div>
      </div>

      {/* 3. Resolved */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-emerald-700">Resolved</span>
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-bold text-emerald-900 tracking-tight">{resolvedComplaints}</div>
        <div className="text-[11px] text-emerald-700/80 mt-1">
          {totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0}% completion
        </div>
      </div>

      {/* 4. Pending Action */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-rose-700">Pending Review</span>
          <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
            <AlertCircle className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-bold text-rose-900 tracking-tight">{pendingComplaints}</div>
        <div className="text-[11px] text-rose-700/80 mt-1">{criticalCount} critical tier</div>
      </div>

      {/* 5. Avg Resolution Time */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-stone-500">Avg Turnaround</span>
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <Zap className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-bold text-stone-900 tracking-tight">{avgHours}h</div>
        <div className="text-[11px] text-indigo-700/90 mt-1 flex items-center gap-0.5">
          <TrendingDown className="w-3 h-3 text-indigo-600 inline" />
          <span>vs 24h campus baseline</span>
        </div>
      </div>

      {/* 6. SLA Compliance */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-stone-500">SLA Adherence</span>
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-bold text-emerald-700 tracking-tight">{slaRate}%</div>
        <div className="text-[11px] text-stone-500 mt-1">Within target SLA limit</div>
      </div>
    </div>
  );
};
