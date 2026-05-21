'use client';

/**
 * data_grid_editable-mui-T05: Clear a notes cell (empty string)
 *
 * The UI is a single centered MUI X DataGrid titled "Users".
 * Notes is an editable text column. Entering edit mode shows a text input.
 *
 * Configuration:
 * - Light theme; comfortable spacing; default scale.
 * - One grid instance.
 * - Initial state: row ID 6 has a non-empty Notes value.
 *
 * Commit behavior: press Enter or click outside the cell to commit the cleared value.
 */

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import type { TaskComponentProps, UserRow } from '../types';

const initialRows: UserRow[] = [
  { id: 1, name: 'John Smith', age: 28, role: 'Staff', active: true, notes: '' },
  { id: 2, name: 'Jane Doe', age: 34, role: 'Manager', active: true, notes: 'Team lead' },
  { id: 3, name: 'Bob Johnson', age: 45, role: 'Director', active: false, notes: '' },
  { id: 4, name: 'Alice Brown', age: 29, role: 'Staff', active: true, notes: 'New hire' },
  { id: 5, name: 'Charlie Wilson', age: 38, role: 'Manager', active: true, notes: '' },
  { id: 6, name: 'Diana Miller', age: 31, role: 'Staff', active: false, notes: 'On leave' },
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, editable: false },
  { field: 'name', headerName: 'Name', width: 150, editable: true },
  { field: 'age', headerName: 'Age', width: 80, type: 'number', editable: true },
  {
    field: 'role',
    headerName: 'Role',
    width: 120,
    editable: true,
    type: 'singleSelect',
    valueOptions: ['Staff', 'Manager', 'Director'],
  },
  { field: 'active', headerName: 'Active', width: 80, type: 'boolean', editable: true },
  { field: 'notes', headerName: 'Notes', width: 150, editable: true },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<UserRow[]>(initialRows);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as UserRow;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  // Check success condition after rows update
  useEffect(() => {
    const targetRow = rows.find((r) => r.id === 6);
    if (targetRow && targetRow.notes.trim() === '' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [rows, hasSucceeded, onSuccess]);

  return (
    <Card sx={{ width: 750 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => console.error(error)}
            disableRowSelectionOnClick
            hideFooter
          />
        </Box>
      </CardContent>
    </Card>
  );
}
