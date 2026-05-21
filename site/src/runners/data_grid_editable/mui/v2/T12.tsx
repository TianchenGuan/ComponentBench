'use client';

/**
 * data_grid_editable-mui-v2-T12: Single-click editing in the correct one of three mini-grids
 *
 * Three DataGrids: "Planned items", "Delayed items", "Complete items" (dark theme).
 * In Delayed items, set Flag for row ID 8 to "Escalate", then click "Apply delayed items".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Paper, Button, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface Row { id: number; item: string; flag: string; owner: string; }

const plannedRows: Row[] = [
  { id: 7, item: 'Feature A', flag: 'None', owner: 'Alice' },
  { id: 8, item: 'Feature B', flag: 'Watch', owner: 'Bob' },
  { id: 9, item: 'Feature C', flag: 'None', owner: 'Charlie' },
];

const delayedRows: Row[] = [
  { id: 7, item: 'Hotfix X', flag: 'Watch', owner: 'Dana' },
  { id: 8, item: 'Migration Y', flag: 'Watch', owner: 'Eve' },
  { id: 9, item: 'Patch Z', flag: 'None', owner: 'Frank' },
];

const completeRows: Row[] = [
  { id: 7, item: 'Release 3.1', flag: 'None', owner: 'George' },
  { id: 8, item: 'Release 3.0', flag: 'None', owner: 'Hannah' },
];

function MiniGrid({ title, initRows, onRowsChange, applyLabel, onApply, testId }: {
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
    { field: 'id', headerName: 'ID', width: 45 },
    { field: 'item', headerName: 'Item', width: 110 },
    { field: 'flag', headerName: 'Flag', width: 90, editable: true, type: 'singleSelect', valueOptions: ['None', 'Watch', 'Escalate'] },
    { field: 'owner', headerName: 'Owner', width: 80 },
  ];

  return (
    <Card sx={{ flex: 1, minWidth: 200 }} data-testid={testId}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Typography variant="caption" fontWeight="bold" gutterBottom sx={{ display: 'block' }}>{title}</Typography>
        <Box sx={{ height: 190 }}>
          <DataGrid rows={rows} columns={cols} processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={e => console.error(e)}
            disableRowSelectionOnClick hideFooter density="compact" />
        </Box>
        <Button variant="outlined" size="small" fullWidth sx={{ mt: 0.5 }} onClick={onApply}>
          {applyLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function T12({ onSuccess }: TaskComponentProps) {
  const [delayedState, setDelayedState] = useState<Row[]>(delayedRows);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !applied) return;
    const t = delayedState.find(r => r.id === 8);
    if (t && t.flag === 'Escalate') {
      successFired.current = true;
      onSuccess();
    }
  }, [delayedState, applied, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack spacing={1} sx={{ p: 1 }}>
        <Paper sx={{ p: 1 }}><Typography variant="caption" color="text.secondary">Status board — modify only the Delayed items grid</Typography></Paper>
        <Stack direction="row" spacing={1}>
          <MiniGrid title="Planned items" initRows={plannedRows} applyLabel="Apply planned items" testId="planned-grid" />
          <MiniGrid title="Delayed items" initRows={delayedRows} onRowsChange={setDelayedState}
            applyLabel="Apply delayed items" onApply={() => setApplied(true)} testId="delayed-grid" />
          <MiniGrid title="Complete items" initRows={completeRows} applyLabel="Apply complete items" testId="complete-grid" />
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
