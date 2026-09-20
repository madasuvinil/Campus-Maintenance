import express from 'express';
import path from 'path';
import { spawn } from 'child_process';
import { createServer as createViteServer } from 'vite';
import { INITIAL_COMPLAINTS } from './src/data/mockComplaints.ts';
import { Complaint } from './src/types.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory persistent database of complaints for the session
let complaints: Complaint[] = [...INITIAL_COMPLAINTS];

// 1. Get all complaints
app.get('/api/complaints', (_req, res) => {
  res.json({ success: true, count: complaints.length, data: complaints });
});

// 2. Lodge a new complaint
app.post('/api/complaints', (req, res) => {
  try {
    const body = req.body;
    const ticketSeq = 1000 + complaints.length + 1;
    const newId = `cmp-${Date.now()}`;
    const newTicket = `CMP-2026-${ticketSeq}`;
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      id: newId,
      ticketNumber: newTicket,
      title: body.title || 'Untitled Complaint',
      description: body.description || '',
      category: body.category || 'General',
      priority: body.priority || 'Medium',
      building: body.building || 'Ramanujan Engineering Block',
      roomNumber: body.roomNumber || 'General Area',
      status: 'Pending',
      requesterName: body.requesterName || 'Campus Student',
      requesterEmail: body.requesterEmail || 'student@campus.edu',
      requesterPhone: body.requesterPhone || '+91 90000 00000',
      requesterRole: body.requesterRole || 'Student',
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          status: 'Pending',
          note: body.initialNote || 'Complaint lodged successfully in system.',
          timestamp: now,
          author: body.requesterName || 'Student/Staff'
        }
      ]
    };

    complaints.unshift(newComplaint);
    res.status(201).json({ success: true, complaint: newComplaint });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Update an existing complaint (assign technician, update status, add timeline)
app.patch('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const index = complaints.findIndex(c => c.id === id || c.ticketNumber === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Complaint ticket not found' });
  }

  const existing = complaints[index];
  const now = new Date().toISOString();

  // If status changed or note provided, append to timeline
  const updatedTimeline = [...existing.timeline];
  if (updates.status && updates.status !== existing.status) {
    updatedTimeline.push({
      status: updates.status,
      note: updates.statusNote || `Status updated from ${existing.status} to ${updates.status}`,
      timestamp: now,
      author: updates.author || updates.technicianName || 'Campus Maintenance Desk'
    });
  }

  const updatedComplaint: Complaint = {
    ...existing,
    ...updates,
    timeline: updatedTimeline,
    updatedAt: now
  };

  complaints[index] = updatedComplaint;
  res.json({ success: true, complaint: updatedComplaint });
});

// 4. Run Python Analytics Engine (`server/analytics.py`)
app.post('/api/python-analytics', (_req, res) => {
  try {
    const pythonProc = spawn('python3', [path.join(process.cwd(), 'server', 'analytics.py')]);

    let stdoutData = '';
    let stderrData = '';

    pythonProc.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProc.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProc.on('close', (code) => {
      if (code !== 0) {
        console.error('Python analytics script error:', stderrData);
        return res.status(500).json({
          success: false,
          error: 'Python analytics process failed',
          details: stderrData
        });
      }

      try {
        const parsed = JSON.parse(stdoutData);
        res.json({ success: true, ...parsed });
      } catch (parseErr: any) {
        res.status(500).json({
          success: false,
          error: 'Failed to parse Python JSON output',
          raw: stdoutData
        });
      }
    });

    // Feed current complaints JSON to python script via stdin
    pythonProc.stdin.write(JSON.stringify(complaints));
    pythonProc.stdin.end();
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Interactive Python Runner Endpoint for custom user Python code
app.post('/api/python/execute', (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, error: 'Python code is required' });
  }

  // Wrapper script that injects complaints data, executes the user's Python code,
  // and captures printed text or Matplotlib figure if generated
  const pythonWrapper = `
import sys
import json
import io
import base64

# Inject dataset
raw_complaints = ${JSON.stringify(complaints)}

# Try importing standard data libraries if installed
try:
    import pandas as pd
    df = pd.DataFrame(raw_complaints)
except Exception:
    df = raw_complaints

complaints_data = raw_complaints

# Execute user script
user_code = ${JSON.stringify(code)}
try:
    exec(user_code, {
        "__builtins__": __builtins__,
        "complaints": raw_complaints,
        "df": df,
        "json": json,
        "sys": sys
    })
except Exception as e:
    import traceback
    print(f"Error during Python execution:\\n{traceback.format_exc()}", file=sys.stderr)
`;

  const proc = spawn('python3', ['-c', pythonWrapper]);

  let stdout = '';
  let stderr = '';

  proc.stdout.on('data', (d) => {
    stdout += d.toString();
  });

  proc.stderr.on('data', (d) => {
    stderr += d.toString();
  });

  // 10 second timeout safety
  const timer = setTimeout(() => {
    proc.kill('SIGTERM');
  }, 10000);

  proc.on('close', (exitCode) => {
    clearTimeout(timer);
    res.json({
      success: exitCode === 0,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      exitCode
    });
  });
});

// Setup Vite / SPA static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Campus Maintenance System server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
