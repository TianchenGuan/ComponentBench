'use client';

/**
 * data_grid_editable-mui-T07: Enter a formatted currency value in a compact grid
 *
 * A single MUI X DataGrid titled "Projects" is shown in a centered card.
 * The grid is rendered in compact spacing, reducing row height and cell padding.
 *
 * Budget column behavior:
 * - Budget is an editable column displayed in US currency format in view mode (e.g., "$800.00").
 * - Entering edit mode shows a text input that accepts numeric input; the grid formats the committed value to "$X,XXX.XX".
 * - If the entered value cannot be parsed into a valid currency amount, the cell shows an inline error state and does not commit.
 *
 * Grid details:
 * - One grid instance; light theme; scale default; spacing compact.
 * - Columns: ID (read-only key), Project (read-only), Budget (editable currency), Owner (read-only).
 * - Initial state: row ID 5 Budget is not $1,250.00.
 */

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import type { TaskComponentProps, ProjectRow } from '../types';

const initialRows: ProjectRow[] = [
  { id: 1, project: 'Website Redesign', budget: 5000, owner: 'Alice' },
  { id: 2, project: 'Mobile App', budget: 8500, owner: 'Bob' },
  { id: 3, project: 'API Integration', budget: 3200, owner: 'Charlie' },
  { id: 4, project: 'Database Migration', budget: 4100, owner: 'Diana' },
  { id: 5, project: 'Security Audit', budget: 800, owner: 'Edward' },
  { id: 6, project: 'Performance Tuning', budget: 2300, owner: 'Fiona' },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, editable: false },
  { field: 'project', headerName: 'Project', width: 180, editable: false },
  {
    field: 'budget',
    headerName: 'Budget',
    width: 120,
    editable: true,
    type: 'number',
    valueFormatter: (value: number) => formatCurrency(value),
  },
  { field: 'owner', headerName: 'Owner', width: 100, editable: false },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<ProjectRow[]>(initialRows);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as ProjectRow;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  // Check success condition after rows update
  useEffect(() => {
    const targetRow = rows.find((r) => r.id === 5);
    if (targetRow && Math.abs(targetRow.budget - 1250.0) < 0.01 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [rows, hasSucceeded, onSuccess]);

  return (
    <Card sx={{ width: 520 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Projects
        </Typography>
        <Box sx={{ height: 350 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => console.error(error)}
            disableRowSelectionOnClick
            hideFooter
            density="compact"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
