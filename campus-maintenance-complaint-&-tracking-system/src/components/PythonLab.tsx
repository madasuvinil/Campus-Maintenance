import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Terminal, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCw, 
  BarChart2, 
  FileText,
  Layers,
  Database
} from 'lucide-react';
import { Complaint } from '../types';

interface PythonLabProps {
  complaints: Complaint[];
}

const PYTHON_PRESETS = [
  {
    id: 'category_analysis',
    title: 'Category Frequency & Distribution',
    description: 'Computes frequency counts, percentages, and ranked categories using Python Counter.',
    code: `# Campus Maintenance Complaint & Tracking System
# Script 1: Category Breakdown & Proportional Distribution
from collections import Counter

categories = [c['category'] for c in complaints]
counter = Counter(categories)
total = len(categories)

print("=" * 55)
print("  CAMPUS MAINTENANCE COMPLAINT CATEGORY ANALYSIS")
print("=" * 55)
print(f"Total Maintenance Records Analyzed: {total}\\n")

print(f"{'Category':<26} | {'Count':<7} | {'Share (%)':<10}")
print("-" * 55)
for cat, count in counter.most_common():
    share = (count / total) * 100
    bar = "█" * int(share / 3)
    print(f"{cat:<26} | {count:<7} | {share:>5.1f}%  {bar}")

print("-" * 55)
top_category = counter.most_common(1)[0]
print(f"\\nPrimary Maintenance Driver: {top_category[0]} ({top_category[1]} tickets)")`
  },
  {
    id: 'priority_sla',
    title: 'Priority vs Resolution Turnaround (SLA)',
    description: 'Calculates mean turnaround hours for each priority tier and compares against campus SLA targets.',
    code: `# Campus Maintenance Complaint & Tracking System
# Script 2: Priority Level vs Resolution Turnaround Analysis
from collections import defaultdict

sla_targets = {
    'Critical': 4.0,
    'High': 12.0,
    'Medium': 24.0,
    'Low': 48.0
}

priority_hours = defaultdict(list)
for c in complaints:
    p = c.get('priority', 'Medium')
    h = c.get('resolution_hours', 12.0)
    priority_hours[p].append(float(h))

print("=" * 60)
print("  PRIORITY TIER RESOLUTION TIME vs CAMPUS SLA TARGETS")
print("=" * 60)
print(f"{'Priority Tier':<12} | {'Avg (hrs)':<10} | {'SLA Target':<12} | {'Status'}")
print("-" * 60)

for p, target in sla_targets.items():
    hours = priority_hours.get(p, [])
    if hours:
        avg_h = sum(hours) / len(hours)
        diff = target - avg_h
        status = "✅ PASS" if diff >= 0 else f"⚠️ BREACH ({abs(diff):.1f}h overdue)"
        print(f"{p:<12} | {avg_h:<10.1f} | {target:<12.1f} | {status}")
    else:
        print(f"{p:<12} | {'N/A':<10} | {target:<12.1f} | No records")

print("-" * 60)`
  },
  {
    id: 'building_hotspots',
    title: 'Building Hotspot & Workload Matrix',
    description: 'Identifies high-traffic maintenance facilities and hostel blocks needing preventive overhaul.',
    code: `# Campus Maintenance Complaint & Tracking System
# Script 3: Building Facility Hotspot Identification
from collections import Counter

buildings = [c['building'] for c in complaints]
building_counts = Counter(buildings)

print("=" * 60)
print("  CAMPUS BUILDING WORKLOAD & PREVENTIVE MAINTENANCE AUDIT")
print("=" * 60)

# Identify top 3 hotspots
ranked = building_counts.most_common()
print("Top Facilities by Complaint Volume:")
for rank, (bldg, count) in enumerate(ranked, 1):
    pct = (count / len(complaints)) * 100
    risk = "🔴 HIGH" if count >= 3 else ("🟡 MODERATE" if count == 2 else "🟢 LOW")
    print(f" #{rank} [{risk}] {bldg}: {count} tickets ({pct:.1f}%)")

print("\\nRecommendation:")
print(f"Deploy permanent roving maintenance technician team to: {ranked[0][0]}")`
  },
  {
    id: 'active_emergency',
    title: 'Emergency Unresolved Escalation Filter',
    description: 'Filters open Critical and High priority tickets requiring urgent supervisory dispatch.',
    code: `# Campus Maintenance Complaint & Tracking System
# Script 4: Critical & High Priority Escalation Filter

unresolved = [
    c for c in complaints 
    if c.get('status') not in ('Resolved', 'Closed') and c.get('priority') in ('Critical', 'High')
]

print("=" * 65)
print(f"  ACTIVE ESCALATIONS: {len(unresolved)} URGENT CAMPUS TICKETS NEEDING IMMEDIATE ACTION")
print("=" * 65)

for ticket in unresolved:
    print(f"\\n* Ticket: {ticket['ticketNumber']} [{ticket['priority']}]")
    print(f"  Title:    {ticket['title']}")
    print(f"  Building: {ticket['building']} - {ticket['roomNumber']}")
    print(f"  Status:   {ticket['status']} | Tech: {ticket.get('technicianName', 'UNASSIGNED')}")
    print(f"  Contact:  {ticket['requesterName']} ({ticket['requesterPhone']})")

if not unresolved:
    print("✅ No critical escalations currently pending.")`
  }
];

export const PythonLab: React.FC<PythonLabProps> = ({ complaints }) => {
  const [activePreset, setActivePreset] = useState<string>(PYTHON_PRESETS[0].id);
  const [pythonCode, setPythonCode] = useState<string>(PYTHON_PRESETS[0].code);
  const [outputConsole, setOutputConsole] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectPreset = (preset: typeof PYTHON_PRESETS[0]) => {
    setActivePreset(preset.id);
    setPythonCode(preset.code);
    setOutputConsole('');
  };

  const handleRunPython = async () => {
    setIsRunning(true);
    setOutputConsole('Executing script in Python 3.10 runtime environment...');
    try {
      const res = await fetch('/api/python/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: pythonCode })
      });

      const data = await res.json();
      if (data.success) {
        setOutputConsole(data.stdout || '(Script executed successfully with no printed stdout)');
      } else {
        setOutputConsole(data.stderr || data.error || 'Execution encountered an error.');
      }
    } catch (err: any) {
      setOutputConsole('Error connecting to Python backend: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-stone-900 text-white p-6 sm:p-7 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Code2 className="w-4 h-4" />
              <span>Interactive Python Analytics Studio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Python Data Science & Campus Analytics Lab
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Write, edit, and execute Python 3 code directly against the campus maintenance complaints database. Analyze trends, calculate SLAs, and generate text-based data visualizations.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 text-amber-300 border border-stone-700 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Python 3.10 • Subprocess Engine
            </span>
          </div>
        </div>

        {/* Preset Script Tabs */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-stone-400 font-medium whitespace-nowrap">Python Presets:</span>
          {PYTHON_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                activePreset === p.id
                  ? 'bg-amber-600 text-white font-semibold shadow-xs'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Console Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Python Code Editor */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col">
          <div className="bg-stone-100 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              </div>
              <span className="text-xs font-mono font-medium text-stone-700 ml-2">
                campus_analytics.py
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 px-2 py-1 rounded bg-white border border-stone-200"
                title="Copy script"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleRunPython}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold rounded-md text-white bg-amber-600 hover:bg-amber-700 transition shadow-xs disabled:opacity-50"
              >
                {isRunning ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{isRunning ? 'Running...' : 'Run Python'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Code Textarea */}
          <div className="relative flex-1 p-3 bg-stone-950 font-mono text-xs text-stone-200">
            <textarea
              value={pythonCode}
              onChange={(e) => setPythonCode(e.target.value)}
              className="w-full h-96 bg-transparent text-emerald-300 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-amber-600/40"
              spellCheck={false}
            />
          </div>

          <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Injected Variables: <code className="text-amber-700 font-bold">complaints</code> (list of dicts), <code className="text-amber-700 font-bold">df</code></span>
            <span>Live Data Sync: {complaints.length} Records</span>
          </div>
        </div>

        {/* Python Terminal Output */}
        <div className="lg:col-span-5 bg-stone-950 rounded-2xl border border-stone-800 shadow-xs overflow-hidden flex flex-col">
          <div className="bg-stone-900 px-4 py-3 border-b border-stone-800 flex items-center justify-between text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="font-mono font-medium">Python Output Terminal</span>
            </div>
            <button
              onClick={() => setOutputConsole('')}
              className="text-[11px] text-stone-400 hover:text-white"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto max-h-[420px] bg-stone-950 text-stone-100 whitespace-pre-wrap leading-relaxed">
            {outputConsole ? (
              outputConsole
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-stone-500 text-xs">
                <Play className="w-8 h-8 text-stone-700 mb-2" />
                <p>Click "Run Python" to execute this analytics code against the campus complaints database.</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-stone-900/80 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Runtime: CPython 3.10.12 (Linux x86_64)</span>
            <span className="text-emerald-400 font-mono">exit code 0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
