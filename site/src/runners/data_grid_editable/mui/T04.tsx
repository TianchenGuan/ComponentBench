'use client';

/**
 * data_grid_editable-mui-T04: Toggle boolean cell (Active)
 *
 * A single MUI X DataGrid titled "Users" is shown in a centered isolated card.
 * The Active column is a boolean editable column, displayed as a checkbox/switch-like control in each cell.
 *
 * Details:
 * - Light theme; comfortable spacing; default scale.
 * - One grid instance.
 * - Row IDs are numeric and shown in the first column.
 * - Initial state: row ID 4 has Active = Off/false.
 *
 * Toggling updates the grid state immediately (no separate Save button).
 */

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import type { TaskComponentProps, UserRow } from '../types';

const initialRows: UserRow[] = [
  { id: 1, name: 'John Smith', age: 28, role: 'Staff', active: true, notes: '' },
  { id: 2, name: 'Jane Doe', age: 34, role: 'Manager', active: true, notes: 'Team lead' },
  { id: 3, name: 'Bob Johnson', age: 45, role: 'Director', active: true, notes: '' },
  { id: 4, name: 'Alice Brown', age: 29, role: 'Staff', active: false, notes: 'New hire' },
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

export default function T04({ task, onSuccess }: TaskComponentProps) {
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
    const targetRow = rows.find((r) => r.id === 4);
    if (targetRow && targetRow.active === true && !hasSucceeded) {
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
