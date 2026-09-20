import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Search, 
  Sliders, 
  FileSpreadsheet, 
  FileCode,
  ExternalLink
} from 'lucide-react';
import { Complaint } from '../types';

interface ComplaintsTableProps {
  complaints: Complaint[];
  onSelectTicket: (ticketNumber: string) => void;
}

export const ComplaintsTable: React.FC<ComplaintsTableProps> = ({
  complaints,
  onSelectTicket
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = complaints.filter(c => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.ticketNumber.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.building.toLowerCase().includes(q) ||
      c.requesterName.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  });

  // Download CSV for Python Pandas analysis
  const downloadCSV = () => {
    const headers = [
      'TicketNumber',
      'Title',
      'Category',
      'Priority',
      'Building',
      'RoomNumber',
      'Status',
      'RequesterName',
      'RequesterRole',
      'TechnicianName',
      'ResolutionHours',
      'CreatedAt'
    ];

    const rows = complaints.map(c => [
      `"${c.ticketNumber}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.category}"`,
      `"${c.priority}"`,
      `"${c.building}"`,
      `"${c.roomNumber}"`,
      `"${c.status}"`,
      `"${c.requesterName}"`,
      `"${c.requesterRole}"`,
      `"${c.technicianName || ''}"`,
      c.resolutionHours || '',
      `"${c.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campus_maintenance_complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download JSON for Python scripts
  const downloadJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(complaints, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `campus_maintenance_complaints_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Top controls */}
      <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Master Maintenance Records</span>
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Complaint Dataset ({filtered.length} of {complaints.length} Records)
          </h3>
          <p className="text-xs text-stone-500">
            Export dataset formatted for Python Pandas (`pd.read_csv`) or Jupyter Notebook analysis
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:bg-white focus:border-amber-600"
            />
          </div>

          {/* Export buttons */}
          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 transition"
            title="Download CSV for Pandas"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={downloadJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200 transition"
            title="Download JSON for Python json.load()"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-600" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Ticket</th>
              <th className="py-3 px-4">Issue Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Facility / Room</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Technician</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filtered.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-amber-50/30 transition">
                <td className="py-3 px-4 font-mono font-bold text-amber-800 whitespace-nowrap">
                  {ticket.ticketNumber}
                </td>
                <td className="py-3 px-4 max-w-xs">
                  <div className="font-semibold text-stone-900 truncate">{ticket.title}</div>
                  <div className="text-[11px] text-stone-500 truncate">{ticket.description}</div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[11px]">
                    {ticket.category}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`font-semibold text-[11px] ${
                    ticket.priority === 'Critical' ? 'text-rose-600' :
                    ticket.priority === 'High' ? 'text-amber-600' :
                    ticket.priority === 'Medium' ? 'text-blue-600' : 'text-stone-500'
                  }`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-medium text-stone-800">{ticket.building}</div>
                  <div className="text-[11px] text-stone-500">{ticket.roomNumber}</div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
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
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-[11px]">
                  {ticket.technicianName || <span className="text-stone-400 italic">Unassigned</span>}
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => onSelectTicket(ticket.ticketNumber)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-md transition"
                  >
                    <span>Track</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
