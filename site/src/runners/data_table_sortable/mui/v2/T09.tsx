'use client';

/**
 * data_table_sortable-mui-v2-T09: Queued jobs dialog – sort priority in the correct grid
 *
 * Opening "Job Manager" reveals a modal with two stacked DataGrid instances:
 * "Active jobs" on top and "Queued jobs" below. Both have sortable Priority and Scheduled columns.
 *
 * Success: Queued jobs sorted Priority descending. Active jobs must remain unsorted.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, Box, IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../../types';

interface JobRow {
  id: string;
  jobId: string;
  name: string;
  priority: number;
  scheduled: string;
  status: string;
}

const activeJobs: JobRow[] = [
  { id: '1', jobId: 'JOB-A01', name: 'ETL pipeline', priority: 3, scheduled: '2024-02-15 06:00', status: 'Running' },
  { id: '2', jobId: 'JOB-A02', name: 'Report gen', priority: 5, scheduled: '2024-02-15 07:00', status: 'Running' },
  { id: '3', jobId: 'JOB-A03', name: 'Backup', priority: 2, scheduled: '2024-02-15 05:30', status: 'Running' },
  { id: '4', jobId: 'JOB-A04', name: 'Index rebuild', priority: 4, scheduled: '2024-02-15 08:00', status: 'Running' },
];

const queuedJobs: JobRow[] = [
  { id: '1', jobId: 'JOB-Q01', name: 'Data sync', priority: 5, scheduled: '2024-02-15 12:00', status: 'Queued' },
  { id: '2', jobId: 'JOB-Q02', name: 'ML training', priority: 8, scheduled: '2024-02-15 09:00', status: 'Queued' },
  { id: '3', jobId: 'JOB-Q03', name: 'Cache warmup', priority: 2, scheduled: '2024-02-15 14:00', status: 'Queued' },
  { id: '4', jobId: 'JOB-Q04', name: 'Log rotation', priority: 3, scheduled: '2024-02-15 10:00', status: 'Queued' },
  { id: '5', jobId: 'JOB-Q05', name: 'Email digest', priority: 7, scheduled: '2024-02-15 11:30', status: 'Queued' },
  { id: '6', jobId: 'JOB-Q06', name: 'Metric export', priority: 4, scheduled: '2024-02-15 08:30', status: 'Queued' },
  { id: '7', jobId: 'JOB-Q07', name: 'Cert renewal', priority: 9, scheduled: '2024-02-15 13:00', status: 'Queued' },
  { id: '8', jobId: 'JOB-Q08', name: 'Snapshot', priority: 6, scheduled: '2024-02-15 15:00', status: 'Queued' },
];

const cols: GridColDef[] = [
  { field: 'jobId', headerName: 'Job ID', width: 100, sortable: false },
  { field: 'name', headerName: 'Name', width: 130, sortable: false },
  { field: 'priority', headerName: 'Priority', width: 90, type: 'number' },
  { field: 'scheduled', headerName: 'Scheduled', width: 150 },
  { field: 'status', headerName: 'Status', width: 90, sortable: false },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [activeSort, setActiveSort] = useState<GridSortModel>([]);
  const [queuedSort, setQueuedSort] = useState<GridSortModel>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const qOk = queuedSort.some(s => s.field === 'priority' && s.sort === 'desc');
    const aOk = activeSort.length === 0;
    if (qOk && aOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSort, queuedSort, onSuccess]);

  const toCanonical = (model: GridSortModel): SortModel =>
    model.map((item, idx) => ({
      column_key: item.field,
      direction: (item.sort || 'asc') as 'asc' | 'desc',
      priority: idx + 1,
    }));

  return (
    <div style={{ padding: 16 }}>
      <Card>
        <CardContent>
          <Button variant="contained" onClick={() => setOpen(true)}>Job Manager</Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Job Manager
          <IconButton onClick={() => setOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Active jobs</Typography>
            <div style={{ height: 240 }}>
              <DataGrid
                rows={activeJobs}
                columns={cols}
                sortModel={activeSort}
                onSortModelChange={setActiveSort}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                density="compact"
                data-testid="grid-active-jobs"
                {...({ 'data-sort-model': JSON.stringify(toCanonical(activeSort)) } as any)}
              />
            </div>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Queued jobs</Typography>
            <div style={{ height: 340 }}>
              <DataGrid
                rows={queuedJobs}
                columns={cols}
                sortModel={queuedSort}
                onSortModelChange={setQueuedSort}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                density="compact"
                data-testid="grid-queued-jobs"
                {...({ 'data-sort-model': JSON.stringify(toCanonical(queuedSort)) } as any)}
              />
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
