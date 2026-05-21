'use client';

/**
 * data_grid_editable-mui-v2-T24: Reveal a hidden column in Archive (not Active review) and edit
 *
 * Two DataGrids: "Active review" and "Archive", both with hidden Reviewer column. Dark theme.
 * In Archive, show Reviewer via Columns control, set Reviewer for row ID 6 to "Dana Kim",
 * then click "Apply archive changes".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Paper, Button, Chip, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridColumnVisibilityModel } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface Row { id: number; title: string; reviewer: string; status: string; owner: string; }

const activeRows: Row[] = [
  { id: 5, title: 'Sprint review', reviewer: 'Alice', status: 'Open', owner: 'Bob' },
  { id: 6, title: 'QA signoff', reviewer: 'Charlie', status: 'In Progress', owner: 'Diana' },
  { id: 7, title: 'Design review', reviewer: 'Eve', status: 'Open', owner: 'Frank' },
];

const archiveRows: Row[] = [
  { id: 5, title: 'Audit Q1', reviewer: 'George', status: 'Closed', owner: 'Hannah' },
  { id: 6, title: 'Compliance check', reviewer: 'Ivan', status: 'Closed', owner: 'Jane' },
  { id: 7, title: 'Vendor eval', reviewer: 'Kim', status: 'Closed', owner: 'Leo' },
  { id: 8, title: 'Risk assessment', reviewer: 'Mina', status: 'Closed', owner: 'Nina' },
];

function ReviewGrid({ title, initRows, onRowsChange, applyLabel, onApply, testId }: {
  title: string; initRows: Row[]; onRowsChange?: (r: Row[]) => void;
  applyLabel: string; onApply?: () => void; testId: string;
}) {
  const [rows, setRows] = useState<Row[]>(initRows);
  const [colVis, setColVis] = useState<GridColumnVisibilityModel>({ reviewer: false });

  const processRowUpdate = useCallback((newRow: GridRowModel) => {
    const u = newRow as Row;
    const next = rows.map(r => (r.id === u.id ? u : r));
    setRows(next);
    onRowsChange?.(next);
    return u;
  }, [rows, onRowsChange]);

  const cols: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'title', headerName: 'Title', width: 140 },
    { field: 'reviewer', headerName: 'Reviewer', width: 120, editable: true },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'owner', headerName: 'Owner', width: 90 },
  ];

  return (
    <Card sx={{ flex: 1 }} data-testid={testId}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>{title}</Typography>
        <Box sx={{ height: 260 }}>
          <DataGrid rows={rows} columns={cols}
            columnVisibilityModel={colVis}
            onColumnVisibilityModelChange={setColVis}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={e => console.error(e)}
            disableRowSelectionOnClick hideFooter density="compact"
            showToolbar
          />
        </Box>
        <Button variant="contained" size="small" fullWidth sx={{ mt: 1 }} onClick={onApply}>
          {applyLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function T24({ onSuccess }: TaskComponentProps) {
  const [archiveState, setArchiveState] = useState<Row[]>(archiveRows);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !applied) return;
    const t = archiveState.find(r => r.id === 6);
    if (t && t.reviewer.trim() === 'Dana Kim') {
      successFired.current = true;
      onSuccess();
    }
  }, [archiveState, applied, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack spacing={1} sx={{ p: 1 }}>
        <Stack direction="row" spacing={0.5}>
          <Chip label="Active: 3" size="small" variant="outlined" />
          <Chip label="Archive: 4" size="small" variant="outlined" />
          <Chip label="Reviewer hidden" size="small" color="info" variant="outlined" />
        </Stack>
        <Stack direction="row" spacing={2}>
          <ReviewGrid title="Active review" initRows={activeRows} applyLabel="Apply active changes" testId="active-review-grid" />
          <ReviewGrid title="Archive" initRows={archiveRows} onRowsChange={setArchiveState}
            applyLabel="Apply archive changes" onApply={() => setApplied(true)} testId="archive-grid" />
        </Stack>
        <Paper sx={{ p: 1 }}>
          <Typography variant="caption" color="text.secondary">Filter chips (read-only)</Typography>
        </Paper>
      </Stack>
    </ThemeProvider>
  );
}
