'use client';

/**
 * data_grid_editable-mui-v2-T13: Modal schedule grid with custom date editor and apply
 *
 * Button opens a modal containing DataGrid "Schedule". Custom date edit component for Start date.
 * Edit row ID 9: Start date → "2026-04-01", then click "Apply schedule changes".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

interface Row { id: number; task: string; startDate: string; owner: string; status: string; }

const initialRows: Row[] = [
  { id: 7, task: 'Sprint planning', startDate: '2026-03-01', owner: 'Alice', status: 'Done' },
  { id: 8, task: 'Design phase', startDate: '2026-03-15', owner: 'Bob', status: 'Active' },
  { id: 9, task: 'Dev kickoff', startDate: '2026-05-10', owner: 'Charlie', status: 'Planned' },
  { id: 10, task: 'QA cycle', startDate: '2026-06-01', owner: 'Diana', status: 'Planned' },
  { id: 11, task: 'Release prep', startDate: '2026-07-01', owner: 'Eve', status: 'Planned' },
];

function DateEditCell(params: GridRenderEditCellParams) {
  const apiRef = useGridApiContext();
  const { id, field, value } = params;
  return (
    <TextField type="date" size="small" autoFocus fullWidth value={value ?? ''}
      onChange={e => apiRef.current.setEditCellValue({ id, field, value: e.target.value })}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); apiRef.current.stopCellEditMode({ id, field }); } }}
      InputLabelProps={{ shrink: true }} sx={{ minWidth: 140 }} />
  );
}

export default function T13({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  const processRowUpdate = useCallback((newRow: GridRowModel) => {
    const u = newRow as Row;
    setRows(prev => prev.map(r => (r.id === u.id ? u : r)));
    return u;
  }, []);

  useEffect(() => {
    if (successFired.current || !applied) return;
    const t = rows.find(r => r.id === 9);
    if (t && t.startDate === '2026-04-01') {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, applied, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'task', headerName: 'Task', width: 130 },
    { field: 'startDate', headerName: 'Start date', width: 150, editable: true, renderEditCell: p => <DateEditCell {...p} /> },
    { field: 'owner', headerName: 'Owner', width: 90 },
    { field: 'status', headerName: 'Status', width: 90 },
  ];

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="subtitle1">Release Planner</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Manage schedule milestones.</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>Edit schedule</Button>
        </CardContent>
      </Card>
      <Paper sx={{ p: 1, width: 400 }}>
        <Typography variant="caption" color="text.secondary">Summary: 5 milestones, 1 done</Typography>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Schedule</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 320, mt: 1 }}>
            <DataGrid rows={rows} columns={columns}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={e => console.error(e)}
              disableRowSelectionOnClick hideFooter density="compact" />
          </Box>
          <Paper variant="outlined" sx={{ p: 1, mt: 1 }}>
            <Typography variant="caption" color="text.secondary">Read-only timeline (summary)</Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { setApplied(true); setOpen(false); }}>
            Apply schedule changes
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
