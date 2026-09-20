import React from 'react';
import { 
  Wrench, 
  BarChart3, 
  PlusCircle, 
  Search, 
  SlidersHorizontal, 
  Code2, 
  Database,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'lodge' | 'track' | 'manage' | 'python' | 'dataset';
  setActiveTab: (tab: 'dashboard' | 'lodge' | 'track' | 'manage' | 'python' | 'dataset') => void;
  totalComplaints: number;
  resolvedComplaints: number;
  slaRate: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalComplaints,
  resolvedComplaints,
  slaRate
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-sm shadow-amber-600/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold text-stone-900 tracking-tight">
                  Campus Maintenance
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                  Complaint & Tracking
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 hidden sm:inline-flex">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Python 3.10 Engine
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Facilities Operations, Live Ticket Tracking & Python Analytics
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>Total: <strong className="text-stone-900">{totalComplaints}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Resolved: <strong className="text-emerald-900">{resolvedComplaints}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700">
              <span>SLA Met: <strong className="text-amber-900">{slaRate}%</strong></span>
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-2">
            <button
              id="header-lodge-btn"
              onClick={() => setActiveTab('lodge')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Lodge Complaint</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-stone-100 no-scrollbar">
          <button
            id="tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition ${
              activeTab === 'dashboard'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard & Graphs</span>
          </button>

          <button
            id="tab-track"
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition ${
              activeTab === 'track'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Live Ticket Tracker</span>
          </button>

          <button
            id="tab-lodge"
            onClick={() => setActiveTab('lodge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition ${
              activeTab === 'lodge'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Complaint Form</span>
          </button>

          <button
            id="tab-manage"
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition ${
              activeTab === 'manage'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Technician Board</span>
          </button>

          <button
            id="tab-python"
            onClick={() => setActiveTab('python')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition ${
              activeTab === 'python'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Python Analytics Lab</span>
          </button>

          <button
            id="tab-dataset"
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition ${
              activeTab === 'dataset'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>All Records & Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
