import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { LodgeComplaintForm } from './components/LodgeComplaintForm';
import { ComplaintTracker } from './components/ComplaintTracker';
import { TechnicianBoard } from './components/TechnicianBoard';
import { PythonLab } from './components/PythonLab';
import { ComplaintsTable } from './components/ComplaintsTable';
import { INITIAL_COMPLAINTS } from './data/mockComplaints';
import { Complaint, PythonAnalyticsSummary } from './types';

export default function App() {
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [pythonStats, setPythonStats] = useState<PythonAnalyticsSummary | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lodge' | 'track' | 'manage' | 'python' | 'dataset'>('dashboard');
  const [selectedTrackTicket, setSelectedTrackTicket] = useState<string>('CMP-2026-1041');
  const [isRefreshingPython, setIsRefreshingPython] = useState<boolean>(false);

  // Fetch initial complaints from backend or use seed
  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setComplaints(json.data);
        }
      }
    } catch (err) {
      console.warn('Backend not available, using in-memory dataset:', err);
    }
  };

  // Run server-side Python analytics engine
  const fetchPythonAnalytics = async () => {
    setIsRefreshingPython(true);
    try {
      const res = await fetch('/api/python-analytics', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPythonStats(data);
        }
      }
    } catch (err) {
      console.warn('Python analytics endpoint failed:', err);
    } finally {
      setIsRefreshingPython(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchPythonAnalytics();
  }, []);

  // Handler: Lodge new complaint
  const handleLodgeComplaint = async (complaintData: Partial<Complaint>): Promise<Complaint | null> => {
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.complaint) {
          setComplaints(prev => [json.complaint, ...prev]);
          // Refresh Python analytics
          fetchPythonAnalytics();
          return json.complaint;
        }
      }
    } catch (err) {
      console.error('Failed to submit via API:', err);
    }

    // Local fallback
    const seq = 1000 + complaints.length + 1;
    const ticketNo = `CMP-2026-${seq}`;
    const now = new Date().toISOString();
    const fallbackTicket: Complaint = {
      id: `cmp-${Date.now()}`,
      ticketNumber: ticketNo,
      title: complaintData.title || 'Maintenance Request',
      description: complaintData.description || '',
      category: complaintData.category || 'General',
      priority: complaintData.priority || 'Medium',
      building: complaintData.building || 'Ramanujan Engineering Block',
      roomNumber: complaintData.roomNumber || 'General Area',
      status: 'Pending',
      requesterName: complaintData.requesterName || 'Student',
      requesterEmail: complaintData.requesterEmail || 'student@campus.edu',
      requesterPhone: complaintData.requesterPhone || '+91 90000 00000',
      requesterRole: complaintData.requesterRole || 'Student',
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          status: 'Pending',
          note: 'Complaint registered in campus portal.',
          timestamp: now,
          author: complaintData.requesterName || 'Student'
        }
      ]
    };
    setComplaints(prev => [fallbackTicket, ...prev]);
    return fallbackTicket;
  };

  // Handler: Update complaint (assign technician, update status)
  const handleUpdateComplaint = async (id: string, updates: Partial<Complaint>) => {
    try {
      await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      await fetchComplaints();
      fetchPythonAnalytics();
    } catch (err) {
      // Local fallback
      setComplaints(prev => prev.map(c => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)));
    }
  };

  // Handler: Add note to ticket
  const handleAddNote = async (ticketId: string, noteText: string) => {
    const ticket = complaints.find(c => c.id === ticketId || c.ticketNumber === ticketId);
    if (!ticket) return;

    const updatedTimeline = [
      ...ticket.timeline,
      {
        status: ticket.status,
        note: noteText,
        timestamp: new Date().toISOString(),
        author: 'Campus Requester'
      }
    ];

    await handleUpdateComplaint(ticket.id, {
      timeline: updatedTimeline,
      statusNote: noteText
    });
  };

  // Calculate high-level metrics
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const pendingComplaints = totalComplaints - resolvedComplaints;
  const slaRate = pythonStats?.sla_compliance_rate ?? (totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 92);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-900">
      {/* Sticky Campus Portal Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalComplaints={totalComplaints}
        resolvedComplaints={resolvedComplaints}
        slaRate={slaRate}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Summary Cards */}
        <StatsOverview
          stats={pythonStats}
          totalComplaints={totalComplaints}
          resolvedComplaints={resolvedComplaints}
          pendingComplaints={pendingComplaints}
        />

        {/* Tab 1: Dashboard & Visual Graphs */}
        {activeTab === 'dashboard' && (
          <AnalyticsCharts
            stats={pythonStats}
            complaints={complaints}
            onRefreshPython={fetchPythonAnalytics}
            isRefreshing={isRefreshingPython}
          />
        )}

        {/* Tab 2: Live Ticket Tracker */}
        {activeTab === 'track' && (
          <ComplaintTracker
            complaints={complaints}
            initialTicketNumber={selectedTrackTicket}
            onAddNote={handleAddNote}
          />
        )}

        {/* Tab 3: Lodge New Complaint */}
        {activeTab === 'lodge' && (
          <LodgeComplaintForm
            onSubmitComplaint={handleLodgeComplaint}
            onNavigateToTracker={(ticketNo) => {
              setSelectedTrackTicket(ticketNo);
              setActiveTab('track');
            }}
          />
        )}

        {/* Tab 4: Facilities Staff & Technician Board */}
        {activeTab === 'manage' && (
          <TechnicianBoard
            complaints={complaints}
            onUpdateComplaint={handleUpdateComplaint}
          />
        )}

        {/* Tab 5: Python Analytics & Code Lab */}
        {activeTab === 'python' && (
          <PythonLab
            complaints={complaints}
          />
        )}

        {/* Tab 6: Master Records Dataset & Export */}
        {activeTab === 'dataset' && (
          <ComplaintsTable
            complaints={complaints}
            onSelectTicket={(ticketNo) => {
              setSelectedTrackTicket(ticketNo);
              setActiveTab('track');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">Campus Maintenance Complaint & Tracking System</span>
            <span>•</span>
            <span>Powered by Python 3 Analytics & Interactive Graph Engine</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>SLA Response Window: 4h - 24h</span>
            <span>•</span>
            <span>Campus Helpdesk: Ext. 911</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
