'use client';

/**
 * data_grid_editable-mui-v2-T14: Date edit in Team B schedule (not Team A), dark theme
 *
 * Two side-by-side DataGrids: "Team A schedule" and "Team B schedule".
 * In Team B, set Start date for row ID 6 to "2026-09-09", then click "Apply Team B schedule".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Chip, Paper, Button, TextField, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface Row { id: number; task: string; startDate: string; owner: string; }

const teamARows: Row[] = [
  { id: 5, task: 'Standup review', startDate: '2026-08-01', owner: 'Alice' },
  { id: 6, task: 'Sprint retro', startDate: '2026-08-15', owner: 'Bob' },
  { id: 7, task: 'Demo day', startDate: '2026-09-01', owner: 'Charlie' },
];

const teamBRows: Row[] = [
  { id: 5, task: 'Capacity plan', startDate: '2026-08-05', owner: 'Dana' },
  { id: 6, task: 'Route setup', startDate: '2026-10-01', owner: 'Eve' },
  { id: 7, task: 'Integration test', startDate: '2026-10-15', owner: 'Frank' },
  { id: 8, task: 'Release sign-off', startDate: '2026-11-01', owner: 'George' },
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

function ScheduleGrid({ title, initRows, onRowsChange, applyLabel, onApply, testId }: {
  title: string; initRows: Row[]; onRowsChange?: (r: Row[]) => void;
  applyLabel: string; onApply?: () => void; testId: string;
}) {
  const [rows, setRows] = useState<Row[]>(initRows);
  const processRowUpdate = useCallback((newRow: GridRowModel) => {
    const u = newRow as Row;
    const next = rows.map(r => (r.id === u.id ? u : r));
    setRows(next);
    onRowsChange?.(next);
    return u;
  }, [rows, onRowsChange]);

  const cols: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'task', headerName: 'Task', width: 130 },
    { field: 'startDate', headerName: 'Start date', width: 150, editable: true, renderEditCell: p => <DateEditCell {...p} /> },
    { field: 'owner', headerName: 'Owner', width: 90 },
  ];

  return (
    <Card sx={{ flex: 1 }} data-testid={testId}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>{title}</Typography>
        <Box sx={{ height: 240 }}>
          <DataGrid rows={rows} columns={cols} processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={e => console.error(e)}
            disableRowSelectionOnClick hideFooter density="compact" />
        </Box>
        <Button variant="contained" size="small" fullWidth sx={{ mt: 1 }} onClick={onApply}>
          {applyLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function T14({ onSuccess }: TaskComponentProps) {
  const [teamBState, setTeamBState] = useState<Row[]>(teamBRows);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !applied) return;
    const t = teamBState.find(r => r.id === 6);
    if (t && t.startDate === '2026-09-09') {
      successFired.current = true;
      onSuccess();
    }
  }, [teamBState, applied, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack spacing={1} sx={{ p: 1 }}>
        <Stack direction="row" spacing={0.5}>
          <Chip label="Team A: 3" size="small" variant="outlined" />
          <Chip label="Team B: 4" size="small" variant="outlined" />
        </Stack>
        <Stack direction="row" spacing={2}>
          <ScheduleGrid title="Team A schedule" initRows={teamARows} applyLabel="Apply Team A schedule" testId="team-a-schedule" />
          <ScheduleGrid title="Team B schedule" initRows={teamBRows} onRowsChange={setTeamBState}
            applyLabel="Apply Team B schedule" onApply={() => setApplied(true)} testId="team-b-schedule" />
        </Stack>
        <Paper sx={{ p: 1 }}>
          <Typography variant="caption" color="text.secondary">Dashboard filters (read-only)</Typography>
        </Paper>
      </Stack>
    </ThemeProvider>
  );
}
