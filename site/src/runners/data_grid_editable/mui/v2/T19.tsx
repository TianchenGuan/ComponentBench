'use client';

/**
 * data_grid_editable-mui-v2-T19: Reference chip in a compact tickets grid with card apply
 *
 * Settings panel with a Reference card showing a priority chip and a DataGrid "Tickets".
 * Match Priority for ticket ID 2 to the reference chip, then click "Apply ticket changes".
 * The reference value is "High".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Paper, Button, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

const REFERENCE_PRIORITY = 'High';

interface Row { id: number; title: string; priority: string; owner: string; status: string; }

const initialRows: Row[] = [
  { id: 1, title: 'Login timeout', priority: 'Low', owner: 'Alice', status: 'Open' },
  { id: 2, title: 'Payment error', priority: 'Medium', owner: 'Bob', status: 'Open' },
  { id: 3, title: 'Search slow', priority: 'High', owner: 'Charlie', status: 'In Progress' },
  { id: 4, title: 'Export broken', priority: 'Low', owner: 'Diana', status: 'Open' },
  { id: 5, title: 'Dashboard crash', priority: 'Medium', owner: 'Eve', status: 'Resolved' },
];

export default function T19({ onSuccess }: TaskComponentProps) {
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
    const t = rows.find(r => r.id === 2);
    if (t && t.priority === REFERENCE_PRIORITY) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, applied, onSuccess]);

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
    { field: 'owner', headerName: 'Owner', width: 90 },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

  return (
    <Stack direction="row" spacing={2} sx={{ p: 2 }} alignItems="flex-start">
      <Card sx={{ width: 180 }} data-testid="priority-reference">
        <CardContent>
          <Typography variant="caption" color="text.secondary">Reference card</Typography>
          <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>Priority</Typography>
          <Chip label={REFERENCE_PRIORITY} color="error" />
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, maxWidth: 540 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Tickets</Typography>
          <Box sx={{ height: 320 }}>
            <DataGrid rows={rows} columns={columns}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={e => console.error(e)}
              disableRowSelectionOnClick hideFooter density="compact" />
          </Box>
          <Button variant="contained" size="small" fullWidth sx={{ mt: 1 }}
            onClick={() => setApplied(true)}>
            Apply ticket changes
          </Button>
        </CardContent>
      </Card>

      <Paper sx={{ p: 1, width: 140 }}>
        <Typography variant="caption" color="text.secondary">Summary</Typography>
        <Typography variant="body2">5 tickets total</Typography>
      </Paper>
    </Stack>
  );
}
