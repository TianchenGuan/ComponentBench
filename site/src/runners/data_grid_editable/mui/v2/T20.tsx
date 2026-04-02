'use client';

/**
 * data_grid_editable-mui-v2-T20: Current sprint vs Backlog disambiguation with title edit
 *
 * Two side-by-side DataGrids: "Current sprint" and "Backlog". Cell editing (auto-commit).
 * In Backlog, edit row BL-13 Title to "Refactor auth". Do not change Current sprint.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Chip, Paper, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

interface Row { id: string; title: string; owner: string; status: string; }

const sprintRows: Row[] = [
  { id: 'SP-1', title: 'User authentication', owner: 'Alice', status: 'In Progress' },
  { id: 'SP-2', title: 'Dashboard redesign', owner: 'Bob', status: 'Done' },
  { id: 'SP-3', title: 'API optimization', owner: 'Charlie', status: 'In Progress' },
  { id: 'BL-13', title: 'Sprint carry-over', owner: 'Diana', status: 'Blocked' },
];

const backlogRows: Row[] = [
  { id: 'BL-10', title: 'Mobile support', owner: 'Edward', status: 'Planned' },
  { id: 'BL-11', title: 'Dark mode', owner: 'Fiona', status: 'Planned' },
  { id: 'BL-12', title: 'Export feature', owner: 'George', status: 'Planned' },
  { id: 'BL-13', title: 'Legacy cleanup', owner: 'Hannah', status: 'Planned' },
  { id: 'BL-14', title: 'Performance monitoring', owner: 'Ivan', status: 'Planned' },
];

function GridCard({ title, initRows, onRowsChange, testId }: {
  title: string; initRows: Row[]; onRowsChange?: (r: Row[]) => void; testId: string;
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
    { field: 'id', headerName: 'Item ID', width: 80 },
    { field: 'title', headerName: 'Title', width: 170, editable: true },
    { field: 'owner', headerName: 'Owner', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

  return (
    <Card sx={{ flex: 1 }} data-testid={testId}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>{title}</Typography>
        <Box sx={{ height: 270 }}>
          <DataGrid rows={rows} columns={cols} processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={e => console.error(e)}
            disableRowSelectionOnClick hideFooter density="compact" />
        </Box>
      </CardContent>
    </Card>
  );
}

export default function T20({ onSuccess }: TaskComponentProps) {
  const [backlogState, setBacklogState] = useState<Row[]>(backlogRows);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const t = backlogState.find(r => r.id === 'BL-13');
    if (t && t.title.trim() === 'Refactor auth') {
      successFired.current = true;
      onSuccess();
    }
  }, [backlogState, onSuccess]);

  return (
    <Stack spacing={1} sx={{ p: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip label="Sprint 14" size="small" variant="outlined" />
        <Chip label="In Progress" size="small" variant="outlined" />
        <Chip label="Planned" size="small" variant="outlined" />
        <IconButton size="small"><RefreshIcon fontSize="small" /></IconButton>
      </Stack>
      <Stack direction="row" spacing={2}>
        <GridCard title="Current sprint" initRows={sprintRows} testId="current-sprint-grid" />
        <GridCard title="Backlog" initRows={backlogRows} onRowsChange={setBacklogState} testId="backlog-grid" />
      </Stack>
      <Paper sx={{ p: 1 }}>
        <Typography variant="caption" color="text.secondary">Recent activity: 3 items moved this week</Typography>
      </Paper>
    </Stack>
  );
}
