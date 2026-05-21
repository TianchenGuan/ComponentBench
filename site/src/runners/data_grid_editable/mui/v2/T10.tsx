'use client';

/**
 * data_grid_editable-mui-v2-T10: Multiline edit in Internal notes (not Public notes)
 *
 * Two stacked DataGrids: "Public notes" and "Internal notes". Both have multiline Notes.
 * In Internal notes, edit row ID 4 Notes to: "Hold shipment\nNotify finance"
 * Ctrl+Enter commits.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Paper, InputBase } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

interface Row { id: number; subject: string; notes: string; updated: string; }

const publicRows: Row[] = [
  { id: 1, subject: 'Welcome', notes: 'General info', updated: '2026-03-01' },
  { id: 2, subject: 'FAQ', notes: 'Common questions', updated: '2026-03-05' },
  { id: 3, subject: 'Policies', notes: 'Return policy', updated: '2026-03-10' },
  { id: 4, subject: 'Contact', notes: 'Support hours', updated: '2026-03-12' },
];

const internalRows: Row[] = [
  { id: 1, subject: 'Escalation', notes: 'Call manager', updated: '2026-03-01' },
  { id: 2, subject: 'Shift notes', notes: 'Quiet day', updated: '2026-03-05' },
  { id: 3, subject: 'Inventory', notes: 'Low stock alert', updated: '2026-03-10' },
  { id: 4, subject: 'Shipping', notes: 'Standard protocol', updated: '2026-03-12' },
  { id: 5, subject: 'Billing', notes: 'Month-end close', updated: '2026-03-15' },
];

function MultilineEditCell(params: GridRenderEditCellParams) {
  const apiRef = useGridApiContext();
  const { id, field, value } = params;
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); apiRef.current.stopCellEditMode({ id, field }); }
    else if (e.key === 'Enter') e.stopPropagation();
  };
  return (
    <InputBase value={value ?? ''} onChange={e => apiRef.current.setEditCellValue({ id, field, value: e.target.value })}
      onKeyDown={handleKeyDown} multiline minRows={2} maxRows={4} autoFocus fullWidth
      sx={{ p: 0.5, fontSize: '0.875rem', alignItems: 'flex-start' }} />
  );
}

function NotesGrid({ title, initRows, onRowsChange, testId }: {
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
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'subject', headerName: 'Subject', width: 110 },
    { field: 'notes', headerName: 'Notes', width: 220, editable: true, renderEditCell: p => <MultilineEditCell {...p} /> },
    { field: 'updated', headerName: 'Updated', width: 100 },
  ];

  return (
    <Card data-testid={testId}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>{title}</Typography>
        <Box sx={{ height: 240 }}>
          <DataGrid rows={rows} columns={cols} processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={e => console.error(e)}
            disableRowSelectionOnClick hideFooter density="compact" />
        </Box>
      </CardContent>
    </Card>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [internalState, setInternalState] = useState<Row[]>(internalRows);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const t = internalState.find(r => r.id === 4);
    if (t && t.notes.trim() === 'Hold shipment\nNotify finance') {
      successFired.current = true;
      onSuccess();
    }
  }, [internalState, onSuccess]);

  return (
    <Stack spacing={2} sx={{ p: 2, maxWidth: 520 }}>
      <Paper sx={{ p: 1 }}>
        <Typography variant="caption" color="text.secondary">Ctrl+Enter saves multiline edits</Typography>
      </Paper>
      <NotesGrid title="Public notes" initRows={publicRows} testId="public-notes-grid" />
      <NotesGrid title="Internal notes" initRows={internalRows} onRowsChange={setInternalState} testId="internal-notes-grid" />
    </Stack>
  );
}
