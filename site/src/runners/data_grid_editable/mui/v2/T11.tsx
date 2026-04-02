'use client';

/**
 * data_grid_editable-mui-v2-T11: Single-click cell editing with two-cell commit and card apply
 *
 * Single DataGrid "Backlog" using single-click editing recipe.
 * Edit row ID 27: Title → "Refactor auth", Priority → "High", then click "Apply backlog changes".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Chip, Paper, Button } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

interface Row { id: number; title: string; priority: string; owner: string; status: string; }

const initialRows: Row[] = [
  { id: 25, title: 'Fix login flow', priority: 'Medium', owner: 'Alice', status: 'Open' },
  { id: 26, title: 'Update docs', priority: 'Low', owner: 'Bob', status: 'Open' },
  { id: 27, title: 'Legacy cleanup', priority: 'Low', owner: 'Charlie', status: 'Planned' },
  { id: 28, title: 'Onboarding wizard', priority: 'High', owner: 'Diana', status: 'In Progress' },
  { id: 29, title: 'Perf audit', priority: 'Medium', owner: 'Eve', status: 'Open' },
  { id: 30, title: 'Security scan', priority: 'High', owner: 'Frank', status: 'Done' },
];

export default function T11({ onSuccess }: TaskComponentProps) {
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
    const t = rows.find(r => r.id === 27);
    if (t && t.title.trim() === 'Refactor auth' && t.priority === 'High') {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, applied, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'title', headerName: 'Title', width: 160, editable: true },
    { field: 'priority', headerName: 'Priority', width: 100, editable: true, type: 'singleSelect', valueOptions: ['Low', 'Medium', 'High'] },
    { field: 'owner', headerName: 'Owner', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

  return (
    <Stack spacing={1} sx={{ p: 2 }}>
      <Stack direction="row" spacing={0.5}>
        <Chip label="6 items" size="small" variant="outlined" />
        <Chip label="Sprint 14" size="small" variant="outlined" />
      </Stack>
      <Card sx={{ width: 560 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Backlog</Typography>
          <Box sx={{ height: 340 }}>
            <DataGrid rows={rows} columns={columns}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={e => console.error(e)}
              disableRowSelectionOnClick hideFooter density="compact"
            />
          </Box>
          <Button variant="contained" size="small" fullWidth sx={{ mt: 1 }}
            onClick={() => setApplied(true)}>
            Apply backlog changes
          </Button>
        </CardContent>
      </Card>
      <Paper sx={{ p: 1 }}>
        <Typography variant="caption" color="text.secondary">Velocity chart (read-only)</Typography>
      </Paper>
    </Stack>
  );
}
