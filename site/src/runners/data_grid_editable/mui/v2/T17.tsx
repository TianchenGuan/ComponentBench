'use client';

/**
 * data_grid_editable-mui-v2-T17: Virtualized grid — scroll to offscreen row 248 and commit Status
 *
 * Large DataGrid "Incidents" with 300 rows (virtualized). Row 248 is not initially visible.
 * Scroll to row 248, set Status to "Escalated". Dark theme.
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Paper, Chip, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface Row { id: number; service: string; severity: string; status: string; owner: string; }

const SERVICES = ['Auth', 'Payment', 'Search', 'CDN', 'Analytics', 'Notification', 'Cache', 'Gateway'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['New', 'Investigating', 'Escalated', 'Resolved'];
const OWNERS = ['Alice', 'Bob', 'Charlie', 'Dana', 'Eve', 'Frank', 'George', 'Hannah'];

function generateRows(): Row[] {
  const rows: Row[] = [];
  for (let i = 1; i <= 300; i++) {
    rows.push({
      id: i,
      service: SERVICES[i % SERVICES.length],
      severity: SEVERITIES[i % SEVERITIES.length],
      status: i === 248 ? 'Investigating' : STATUSES[i % STATUSES.length],
      owner: OWNERS[i % OWNERS.length],
    });
  }
  return rows;
}

export default function T17({ onSuccess }: TaskComponentProps) {
  const initial = useMemo(() => generateRows(), []);
  const [rows, setRows] = useState<Row[]>(initial);
  const successFired = useRef(false);

  const processRowUpdate = useCallback((newRow: GridRowModel) => {
    const u = newRow as Row;
    setRows(prev => prev.map(r => (r.id === u.id ? u : r)));
    return u;
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const t = rows.find(r => r.id === 248);
    if (t && t.status === 'Escalated') {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'service', headerName: 'Service', width: 120 },
    { field: 'severity', headerName: 'Severity', width: 90 },
    { field: 'status', headerName: 'Status', width: 120, editable: true, type: 'singleSelect', valueOptions: STATUSES },
    { field: 'owner', headerName: 'Owner', width: 100 },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack spacing={1} sx={{ p: 2 }}>
        <Stack direction="row" spacing={0.5}>
          <Chip label="300 incidents" size="small" variant="outlined" />
          <Chip label="Active: 218" size="small" color="warning" variant="outlined" />
        </Stack>
        <Card sx={{ maxWidth: 560 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Incidents</Typography>
            <Box sx={{ height: 400 }}>
              <DataGrid rows={rows} columns={columns}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={e => console.error(e)}
                disableRowSelectionOnClick density="compact" />
            </Box>
          </CardContent>
        </Card>
        <Paper sx={{ p: 1 }}>
          <Typography variant="caption" color="text.secondary">Status cards (read-only)</Typography>
        </Paper>
      </Stack>
    </ThemeProvider>
  );
}
