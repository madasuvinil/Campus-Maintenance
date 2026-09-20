import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  UserCheck, 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Filter, 
  Search, 
  AlertTriangle,
  Building2,
  Calendar,
  Save,
  X
} from 'lucide-react';
import { Complaint, ComplaintStatus, PriorityLevel, CategoryType } from '../types';

interface TechnicianBoardProps {
  complaints: Complaint[];
  onUpdateComplaint: (id: string, updates: Partial<Complaint>) => Promise<void>;
}

const TECHNICIANS = [
  { name: 'Vikram Joshi', dept: 'Electrical Maintenance Div', phone: '+91 98210 33410' },
  { name: 'Sunil Ramesh', dept: 'Plumbing & Water Works', phone: '+91 98330 44192' },
  { name: 'Anil Choudhury', dept: 'HVAC Services Team', phone: '+91 97110 55219' },
  { name: 'Gopal Sutar', dept: 'Carpentry & Workshop', phone: '+91 98450 77123' },
  { name: 'Sanjay Yadav', dept: 'Campus Sanitation & Drainage', phone: '+91 98190 66201' },
  { name: 'Karthik Raja', dept: 'Smart AV & IT Support', phone: '+91 99001 22910' },
  { name: 'Rameshwar Lal', dept: 'Civil & Automation Div', phone: '+91 98901 88765' }
];

export const TechnicianBoard: React.FC<TechnicianBoardProps> = ({
  complaints,
  onUpdateComplaint
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [modalStatus, setModalStatus] = useState<ComplaintStatus>('In Progress');
  const [modalTechName, setModalTechName] = useState<string>('');
  const [modalTechNotes, setModalTechNotes] = useState<string>('');
  const [modalHours, setModalHours] = useState<number>(2.0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const filtered = complaints.filter(c => {
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    if (filterCategory !== 'All' && c.category !== filterCategory) return false;
    if (filterPriority !== 'All' && c.priority !== filterPriority) return false;
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const match = c.title.toLowerCase().includes(q) ||
                    c.ticketNumber.toLowerCase().includes(q) ||
                    c.building.toLowerCase().includes(q) ||
                    c.roomNumber.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenEdit = (ticket: Complaint) => {
    setSelectedTicket(ticket);
    setModalStatus(ticket.status);
    setModalTechName(ticket.technicianName || TECHNICIANS[0].name);
    setModalTechNotes(ticket.resolutionNotes || '');
    setModalHours(ticket.resolutionHours || 2.0);
  };

  const handleSaveTicketUpdates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setIsUpdating(true);
    try {
      const techObj = TECHNICIANS.find(t => t.name === modalTechName);
      await onUpdateComplaint(selectedTicket.id, {
        status: modalStatus,
        technicianName: modalTechName,
        technicianDept: techObj?.dept || 'Facilities Operations',
        technicianPhone: techObj?.phone || '+91 98000 00000',
        resolutionNotes: modalTechNotes,
        resolutionHours: Number(modalHours),
        statusNote: `Updated by maintenance admin to ${modalStatus} (Assigned: ${modalTechName})`
      });
      setSelectedTicket(null);
    } catch (err: any) {
      alert('Error saving ticket update: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-stone-900 text-white">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Facilities Staff & Technician Workboard
              </h2>
              <p className="text-xs text-stone-500">
                Dispatch technicians, update repair statuses, and document resolution logs
              </p>
            </div>
          </div>

          {/* Search query input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by keyword, ticket #, or room..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:bg-white focus:border-amber-600"
            />
          </div>
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-4 border-t border-stone-100 text-xs">
          <div>
            <label className="block text-[11px] text-stone-500 mb-1">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-1.5 bg-stone-50 border border-stone-200 rounded-md font-medium text-stone-800"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-stone-500 mb-1">Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-1.5 bg-stone-50 border border-stone-200 rounded-md font-medium text-stone-800"
            >
              <option value="All">All Categories</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="HVAC & AC">HVAC & AC</option>
              <option value="Carpentry & Furniture">Carpentry & Furniture</option>
              <option value="Sanitation & Cleaning">Sanitation & Cleaning</option>
              <option value="IT & Smart Classroom">IT & Smart Classroom</option>
              <option value="Civil & Safety">Civil & Safety</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-stone-500 mb-1">Priority:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full p-1.5 bg-stone-50 border border-stone-200 rounded-md font-medium text-stone-800"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus('All');
                setFilterCategory('All');
                setFilterPriority('All');
                setSearchKeyword('');
              }}
              className="w-full py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-md font-medium transition"
            >
              Clear Filters ({filtered.length} visible)
            </button>
          </div>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
          >
            <div>
              {/* Top row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {ticket.ticketNumber}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  ticket.status === 'Resolved' || ticket.status === 'Closed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : ticket.status === 'In Progress'
                    ? 'bg-amber-100 text-amber-800'
                    : ticket.status === 'Assigned'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {ticket.status}
                </span>
              </div>

              {/* Title & Category */}
              <h4 className="text-sm font-bold text-stone-900 line-clamp-1 mb-1">
                {ticket.title}
              </h4>
              <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                {ticket.description}
              </p>

              {/* Building & Room */}
              <div className="space-y-1 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 mb-3">
                <div className="flex items-center gap-1.5 truncate">
                  <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{ticket.building}</span>
                </div>
                <div className="text-[11px] text-stone-500 pl-5">
                  {ticket.roomNumber}
                </div>
              </div>

              {/* Priority & Assigned Tech */}
              <div className="flex items-center justify-between text-[11px] text-stone-500 mb-3">
                <span>Priority: <strong className="text-stone-800">{ticket.priority}</strong></span>
                <span className="truncate max-w-[140px]">
                  Tech: <strong className="text-stone-800">{ticket.technicianName || 'Unassigned'}</strong>
                </span>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] text-stone-400">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleOpenEdit(ticket)}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-900 text-white hover:bg-stone-800 transition"
              >
                <Wrench className="w-3 h-3" />
                <span>Manage Ticket</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white p-8 rounded-xl border border-stone-200 text-center text-stone-500 text-sm">
            No complaints match the current filter selection.
          </div>
        )}
      </div>

      {/* Quick Edit Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {selectedTicket.ticketNumber}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  Manage Maintenance Dispatch
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTicketUpdates} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Issue Summary:</label>
                <p className="p-2.5 bg-stone-50 rounded-lg text-stone-700 border border-stone-200">
                  {selectedTicket.title} ({selectedTicket.building}, {selectedTicket.roomNumber})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Update Status:</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as ComplaintStatus)}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg font-medium text-stone-800 focus:border-amber-600 outline-none"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Assign Technician:</label>
                  <select
                    value={modalTechName}
                    onChange={(e) => setModalTechName(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg font-medium text-stone-800 focus:border-amber-600 outline-none"
                  >
                    {TECHNICIANS.map(t => (
                      <option key={t.name} value={t.name}>{t.name} ({t.dept.split(' ')[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Labor & Resolution Duration (Hours):
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="120"
                  value={modalHours}
                  onChange={(e) => setModalHours(parseFloat(e.target.value))}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg focus:border-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Technician Notes / Work Performed:
                </label>
                <textarea
                  rows={3}
                  placeholder="Record parts replaced, circuit isolation test, plumbing sealant applied, etc."
                  value={modalTechNotes}
                  onChange={(e) => setModalTechNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-lg focus:border-amber-600 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-xs transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isUpdating ? 'Saving...' : 'Update & Log Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
