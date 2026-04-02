'use client';

/**
 * data_grid_editable-mui-v2-T23: Reveal a hidden editable column, then edit and apply
 *
 * DataGrid "Tickets" with showToolbar and Priority column hidden via columnVisibilityModel.
 * Use the Columns control to show Priority, then set Priority for row ID 14 to "High",
 * then click "Apply ticket changes".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Paper, Button, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridColumnVisibilityModel, GridToolbar } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

interface Row { id: number; title: string; priority: string; owner: string; status: string; }

const initialRows: Row[] = [
  { id: 11, title: 'Auth timeout', priority: 'Low', owner: 'Alice', status: 'Open' },
  { id: 12, title: 'Payment retry', priority: 'Medium', owner: 'Bob', status: 'In Progress' },
  { id: 13, title: 'Search crash', priority: 'High', owner: 'Charlie', status: 'Open' },
  { id: 14, title: 'Export hang', priority: 'Medium', owner: 'Diana', status: 'Open' },
  { id: 15, title: 'Cache stale', priority: 'Low', owner: 'Eve', status: 'Resolved' },
  { id: 16, title: 'API 500s', priority: 'High', owner: 'Frank', status: 'In Progress' },
];

export default function T23({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [columnVisibility, setColumnVisibility] = useState<GridColumnVisibilityModel>({ priority: false });
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  const processRowUpdate = useCallback((newRow: GridRowModel) => {
    const u = newRow as Row;
    setRows(prev => prev.map(r => (r.id === u.id ? u : r)));
    return u;
  }, []);

  useEffect(() => {
    if (successFired.current || !applied) return;
    const t = rows.find(r => r.id === 14);
    const priorityVisible = columnVisibility.priority !== false;
    if (t && t.priority === 'High' && priorityVisible) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, applied, columnVisibility, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'title', headerName: 'Title', width: 140 },
    {
      field: 'priority', headerName: 'Priority', width: 100, editable: true,
      type: 'singleSelect', valueOptions: ['Low', 'Medium', 'High'],
      renderCell: (params) => {
        const colorMap: Record<string, 'default' | 'warning' | 'error'> = { Low: 'default', Medium: 'warning', High: 'error' };
        return <Chip label={params.value} size="small" color={colorMap[params.value as string] ?? 'default'} />;
      },
    },
    { field: 'owner', headerName: 'Owner', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

  return (
    <Stack spacing={1} sx={{ p: 2 }}>
      <Stack direction="row" spacing={0.5}>
        <Chip label="6 tickets" size="small" variant="outlined" />
        <Chip label="Priority column hidden by default" size="small" color="info" variant="outlined" />
      </Stack>
      <Card sx={{ maxWidth: 580 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Tickets</Typography>
          <Box sx={{ height: 360 }}>
            <DataGrid rows={rows} columns={columns}
              columnVisibilityModel={columnVisibility}
              onColumnVisibilityModelChange={setColumnVisibility}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={e => console.error(e)}
              disableRowSelectionOnClick hideFooter density="compact"
              showToolbar
            />
          </Box>
          <Button variant="contained" size="small" fullWidth sx={{ mt: 1 }}
            onClick={() => setApplied(true)}>
            Apply ticket changes
          </Button>
        </CardContent>
      </Card>
      <Paper sx={{ p: 1 }}>
        <Typography variant="caption" color="text.secondary">Summary card (read-only)</Typography>
      </Paper>
    </Stack>
  );
}
