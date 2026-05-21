'use client';

/**
 * data_grid_editable-mui-T12: Edit with single-click-to-edit in a small grid
 *
 * This page contains a single MUI X DataGrid titled "Notes", positioned near the top-right of the viewport.
 * The grid is rendered at a small scale (reduced font size and tighter header height).
 *
 * Editing behavior (non-default):
 * - The grid is configured using the documented "single click to enter edit mode" recipe.
 * - Clicking an editable cell immediately turns it into a text input (no double-click needed).
 * - Pressing Enter or clicking outside commits the value.
 *
 * Grid details:
 * - Theme light; spacing comfortable; scale small; placement top-right.
 * - One grid instance.
 * - Columns: ID (read-only key), Notes (editable text), Updated (read-only).
 * - Initial state: row ID 12 exists and Notes is not "OK".
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridCellParams, useGridApiRef } from '@mui/x-data-grid';
import type { TaskComponentProps, NotesRow } from '../types';

const initialRows: NotesRow[] = [
  { id: 10, notes: 'Review complete', updated: '2026-01-15' },
  { id: 11, notes: 'Pending approval', updated: '2026-01-16' },
  { id: 12, notes: 'Needs revision', updated: '2026-01-17' },
  { id: 13, notes: 'Final draft', updated: '2026-01-18' },
  { id: 14, notes: 'Archived', updated: '2026-01-19' },
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 60, editable: false },
  { field: 'notes', headerName: 'Notes', width: 150, editable: true },
  { field: 'updated', headerName: 'Updated', width: 100, editable: false },
];

export default function T12({ task, onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<NotesRow[]>(initialRows);
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const apiRef = useGridApiRef();

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as NotesRow;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  // Single-click to edit
  const handleCellClick = useCallback(
    (params: GridCellParams) => {
      if (params.isEditable && apiRef.current) {
        apiRef.current.startCellEditMode({ id: params.id, field: params.field });
      }
    },
    [apiRef]
  );

  // Check success condition after rows update
  useEffect(() => {
    const targetRow = rows.find((r) => r.id === 12);
    if (targetRow && targetRow.notes.trim() === 'OK' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [rows, hasSucceeded, onSuccess]);

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Notes
        </Typography>
        <Box sx={{ height: 280 }}>
          <DataGrid
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => console.error(error)}
            onCellClick={handleCellClick}
            disableRowSelectionOnClick
            hideFooter
            density="compact"
            sx={{
              fontSize: '0.85rem',
              '& .MuiDataGrid-columnHeaders': {
                fontSize: '0.8rem',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
