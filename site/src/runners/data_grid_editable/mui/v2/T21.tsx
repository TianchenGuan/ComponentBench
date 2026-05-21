'use client';

/**
 * data_grid_editable-mui-v2-T21: Bulk-edit two rows and save all changes
 *
 * DataGrid "Reviews" with bulk-editing pattern. Edits accumulate locally.
 * Change Owner for row ID 4 to "Nina Patel" and Status for row ID 9 to "Approved",
 * then click "Save all changes". Dark theme.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Paper, Button, Chip, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface Row { id: number; title: string; owner: string; status: string; reviewer: string; }

const initialRows: Row[] = [
  { id: 1, title: 'Audit report', owner: 'Alice Brown', status: 'Open', reviewer: 'Sam' },
  { id: 2, title: 'SOC2 prep', owner: 'Bob Johnson', status: 'Approved', reviewer: 'Dana' },
  { id: 3, title: 'Vendor eval', owner: 'Charlie Wilson', status: 'Open', reviewer: 'Eve' },
  { id: 4, title: 'Risk matrix', owner: 'Diana Miller', status: 'In Review', reviewer: 'Frank' },
  { id: 5, title: 'Compliance doc', owner: 'Mina Ortiz', status: 'Open', reviewer: 'George' },
  { id: 6, title: 'Pen test', owner: 'Fiona Apple', status: 'Approved', reviewer: 'Hannah' },
  { id: 7, title: 'Data privacy', owner: 'George Kim', status: 'In Review', reviewer: 'Ivan' },
  { id: 8, title: 'Access review', owner: 'Hannah Lee', status: 'Open', reviewer: 'Jane' },
  { id: 9, title: 'Cert renewal', owner: 'Ivan Chen', status: 'In Review', reviewer: 'Kim' },
  { id: 10, title: 'Policy update', owner: 'Jane Park', status: 'Open', reviewer: 'Leo' },
];

export default function T21({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [unsavedChanges, setUnsavedChanges] = useState<Map<number, Partial<Row>>>(new Map());
  const [savedRows, setSavedRows] = useState<Row[]>(initialRows);
  const successFired = useRef(false);

  const processRowUpdate = useCallback((newRow: GridRowModel) => {
    const u = newRow as Row;
    setRows(prev => prev.map(r => (r.id === u.id ? u : r)));
    setUnsavedChanges(prev => {
      const next = new Map(prev);
      next.set(u.id, u);
      return next;
    });
    return u;
  }, []);

  const handleSaveAll = () => {
    setSavedRows([...rows]);
    setUnsavedChanges(new Map());
  };

  const handleDiscardAll = () => {
    setRows([...savedRows]);
    setUnsavedChanges(new Map());
  };

  useEffect(() => {
    if (successFired.current) return;
    if (unsavedChanges.size > 0) return;
    const r4 = savedRows.find(r => r.id === 4);
    const r9 = savedRows.find(r => r.id === 9);
    if (r4 && r4.owner.trim() === 'Nina Patel' && r9 && r9.status === 'Approved') {
      successFired.current = true;
      onSuccess();
    }
  }, [savedRows, unsavedChanges, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'title', headerName: 'Title', width: 130 },
    { field: 'owner', headerName: 'Owner', width: 130, editable: true },
    { field: 'status', headerName: 'Status', width: 110, editable: true, type: 'singleSelect', valueOptions: ['Open', 'In Review', 'Approved', 'Blocked'] },
    { field: 'reviewer', headerName: 'Reviewer', width: 90 },
  ];

  const hasUnsaved = unsavedChanges.size > 0;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack spacing={1} sx={{ p: 2 }}>
        <Stack direction="row" spacing={0.5}>
          <Chip label="10 reviews" size="small" variant="outlined" />
          <Chip label="3 approved" size="small" color="success" variant="outlined" />
          {hasUnsaved && <Chip label={`${unsavedChanges.size} unsaved`} size="small" color="warning" />}
        </Stack>
        <Stack direction="row" spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Reviews</Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button variant="contained" size="small" disabled={!hasUnsaved} onClick={handleSaveAll}>
                  Save all changes
                </Button>
                <Button variant="outlined" size="small" disabled={!hasUnsaved} onClick={handleDiscardAll}>
                  Discard all changes
                </Button>
              </Stack>
              <Box sx={{ height: 420 }}>
                <DataGrid rows={rows} columns={columns}
                  processRowUpdate={processRowUpdate}
                  onProcessRowUpdateError={e => console.error(e)}
                  disableRowSelectionOnClick hideFooter density="compact" />
              </Box>
            </CardContent>
          </Card>
          <Paper sx={{ p: 1, width: 150, alignSelf: 'flex-start' }}>
            <Typography variant="caption" color="text.secondary">Analytics</Typography>
            <Typography variant="body2">Pass rate: 78%</Typography>
          </Paper>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
