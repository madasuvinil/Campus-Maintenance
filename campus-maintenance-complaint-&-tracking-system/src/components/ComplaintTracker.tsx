import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar, 
  MessageSquare, 
  Send,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';

interface ComplaintTrackerProps {
  complaints: Complaint[];
  initialTicketNumber?: string;
  onAddNote: (ticketId: string, note: string) => Promise<void>;
}

const LIFECYCLE_STEPS: ComplaintStatus[] = [
  'Pending',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed'
];

export const ComplaintTracker: React.FC<ComplaintTrackerProps> = ({
  complaints,
  initialTicketNumber,
  onAddNote
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialTicketNumber || 'CMP-2026-1041');
  const [activeTicket, setActiveTicket] = useState<Complaint | null>(() => {
    if (initialTicketNumber) {
      const match = complaints.find(c => c.ticketNumber.toLowerCase() === initialTicketNumber.toLowerCase());
      if (match) return match;
    }
    return complaints[0] || null;
  });

  const [newNote, setNewNote] = useState<string>('');
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [noteSuccess, setNoteSuccess] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const found = complaints.find(
      c => c.ticketNumber.toLowerCase() === query || 
           c.id.toLowerCase() === query ||
           c.title.toLowerCase().includes(query) ||
           c.requesterEmail.toLowerCase() === query
    );
    if (found) {
      setActiveTicket(found);
    } else {
      alert(`No complaint found matching "${searchQuery}". Please check your Ticket ID (e.g. CMP-2026-1041).`);
    }
  };

  const handleAddTimelineNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !activeTicket) return;

    setIsAddingNote(true);
    try {
      await onAddNote(activeTicket.id, newNote.trim());
      setNewNote('');
      setNoteSuccess(true);
      setTimeout(() => setNoteSuccess(false), 3000);
      
      // Update local view
      const updated = complaints.find(c => c.id === activeTicket.id);
      if (updated) {
        setActiveTicket(updated);
      }
    } catch (err: any) {
      alert('Failed to post note: ' + err.message);
    } finally {
      setIsAddingNote(false);
    }
  };

  const getStepIndex = (status: ComplaintStatus) => {
    return LIFECYCLE_STEPS.indexOf(status);
  };

  const currentStepIdx = activeTicket ? getStepIndex(activeTicket.status) : 0;

  return (
    <div className="space-y-6">
      {/* Search Bar & Quick Ticket Selectors */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Real-Time Tracking Portal
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 mt-1">
              Track Campus Complaint Status & History
            </h2>
            <p className="text-xs text-stone-500">
              Enter your CMP ticket number to inspect live maintenance progress, assigned technicians, and SLA audit logs.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter Ticket ID (e.g. CMP-2026-1041) or student email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-xl transition shadow-xs whitespace-nowrap"
            >
              Track Ticket
            </button>
          </form>

          {/* Quick Clickable Sample Tickets */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs">
            <span className="text-stone-400 text-[11px]">Quick Samples:</span>
            {complaints.slice(0, 4).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSearchQuery(c.ticketNumber);
                  setActiveTicket(c);
                }}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-mono transition ${
                  activeTicket?.id === c.id
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {c.ticketNumber} ({c.status})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Details View */}
      {activeTicket ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Status & Progress Panel */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              {/* Header with status badge */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-5 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      {activeTicket.ticketNumber}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(activeTicket.createdAt).toLocaleDateString()} {new Date(activeTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-1">
                    {activeTicket.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-stone-600">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-stone-400" />
                      {activeTicket.building}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {activeTicket.roomNumber}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    activeTicket.status === 'Resolved' || activeTicket.status === 'Closed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeTicket.status === 'In Progress'
                      ? 'bg-amber-100 text-amber-800'
                      : activeTicket.status === 'Assigned'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {activeTicket.status}
                  </span>
                  <span className="text-xs text-stone-500">
                    Priority: <strong className="text-stone-900">{activeTicket.priority}</strong>
                  </span>
                </div>
              </div>

              {/* Visual Step Progress Tracker */}
              <div className="py-6 px-2">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
                  Maintenance Progress Milestones
                </div>
                
                <div className="relative flex items-center justify-between">
                  {/* Background progress track */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 -translate-y-1/2 z-0" />
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-amber-600 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{ width: `${(currentStepIdx / (LIFECYCLE_STEPS.length - 1)) * 100}%` }}
                  />

                  {LIFECYCLE_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-amber-600 text-white ring-4 ring-amber-100 shadow-md scale-110'
                            : isCompleted
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-200 text-stone-600'
                        }`}>
                          {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                        </div>
                        <span className={`text-[11px] mt-2 font-medium whitespace-nowrap text-center ${
                          isCurrent ? 'text-amber-800 font-bold' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description & Details */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 mb-6">
                <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Reported Issue Description
                </div>
                <p className="text-stone-700 text-sm leading-relaxed">
                  {activeTicket.description}
                </p>
                {activeTicket.resolutionNotes && (
                  <div className="mt-3 pt-3 border-t border-stone-200 text-xs text-stone-800 bg-emerald-50/50 p-2.5 rounded-lg border-emerald-100">
                    <span className="font-semibold text-emerald-800 block mb-0.5">Technician Resolution Log:</span>
                    <span>{activeTicket.resolutionNotes}</span>
                  </div>
                )}
              </div>

              {/* Chronological Audit Timeline */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Official Ticket History & Audit Trail
                  </h4>
                  <span className="text-[11px] text-stone-400">
                    {activeTicket.timeline.length} recorded events
                  </span>
                </div>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200">
                  {activeTicket.timeline.map((event, index) => (
                    <div key={index} className="relative flex items-start gap-3 pl-1">
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-amber-600 flex items-center justify-center shrink-0 z-10 text-[10px]">
                        <Clock className="w-3 h-3 text-amber-700" />
                      </div>
                      <div className="flex-1 bg-stone-50 p-3 rounded-xl border border-stone-200/70 text-xs">
                        <div className="flex items-center justify-between font-medium text-stone-800 mb-1">
                          <span className="font-bold text-amber-900">{event.status} Stage</span>
                          <span className="text-[10px] text-stone-500">
                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(event.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-stone-600 mb-1">{event.note}</p>
                        <div className="text-[10px] text-stone-400">
                          Updated by: <strong className="text-stone-600">{event.author}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Student / Staff Note */}
              <form onSubmit={handleAddTimelineNote} className="mt-6 pt-5 border-t border-stone-100">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Post Follow-up Note / Student Clarification
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add extra details, room access time, or follow-up note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:border-amber-600 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isAddingNote || !newNote.trim()}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Note</span>
                  </button>
                </div>
                {noteSuccess && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Note appended to ticket history log!
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Assigned Staff & Requester Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Technician Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>Assigned Maintenance Specialist</span>
              </div>

              {activeTicket.technicianName ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 font-bold text-base flex items-center justify-center">
                      {activeTicket.technicianName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-sm">{activeTicket.technicianName}</div>
                      <div className="text-xs text-amber-700 font-medium">{activeTicket.technicianDept || 'Facilities Maintenance Div'}</div>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center justify-between">
                      <span>Direct Contact:</span>
                      <strong className="text-stone-800">{activeTicket.technicianPhone || '+91 98210 33410'}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Duty Shift:</span>
                      <span className="text-stone-700">General Morning (08:00 - 17:00)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SLA Status:</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> On Schedule
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-500">
                  <p>Technician dispatch currently pending assignment by maintenance desk supervisor.</p>
                </div>
              )}
            </div>

            {/* Requester Info */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-3">
                Requester Details
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Name:</span>
                  <span className="font-semibold text-stone-900">{activeTicket.requesterName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Campus Role:</span>
                  <span className="text-stone-800">{activeTicket.requesterRole}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Email:</span>
                  <span className="text-stone-800 font-mono text-[11px]">{activeTicket.requesterEmail}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Phone:</span>
                  <span className="text-stone-800">{activeTicket.requesterPhone}</span>
                </div>
              </div>
            </div>

            {/* Need Urgent Help */}
            <div className="bg-stone-900 text-white p-5 rounded-2xl shadow-xs">
              <h4 className="text-sm font-bold flex items-center gap-1.5 text-amber-400">
                <Zap className="w-4 h-4" />
                Emergency Facilities Hotline
              </h4>
              <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
                For active chemical leaks, elevator entrapments, or electrical fire hazards, dial the 24/7 campus emergency desk:
              </p>
              <div className="mt-3 p-2.5 rounded-xl bg-stone-800 border border-stone-700 text-center font-mono text-sm font-bold text-amber-300">
                Ext. 911 / +91 (80) 4122-9900
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center">
          <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p className="text-stone-600 text-sm">Please search for a ticket number to view its status.</p>
        </div>
      )}
    </div>
  );
};
