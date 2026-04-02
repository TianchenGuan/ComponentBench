'use client';

/**
 * data_grid_editable-mui-T10: Match a grid value to a visual reference
 *
 * The page is a settings-style layout with two panels:
 *
 * - A left "Reference" card that displays a single Priority chip with a visible label (Low/Medium/High).
 * - A right panel containing one MUI X DataGrid titled "Tickets".
 *
 * Grid details:
 * - One grid instance; light theme; comfortable spacing; default scale.
 * - Columns: ID (read-only key), Title (read-only), Priority (editable singleSelect), Owner (read-only).
 * - Priority is rendered as a colored chip in view mode; in edit mode it becomes a dropdown with options Low, Medium, High.
 *
 * Guidance:
 * - The target is provided visually by the Reference chip; the label on the chip is the canonical value.
 *
 * Initial state:
 * - Ticket ID 2 exists and its Priority does not match the Reference chip.
 */

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridRenderCellParams } from '@mui/x-data-grid';
import type { TaskComponentProps, MuiTicketRow } from '../types';

// Reference priority - the target that ID 2 should match
const REFERENCE_PRIORITY: 'Low' | 'Medium' | 'High' = 'High';

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'success';
    default:
      return 'default';
  }
};

const initialRows: MuiTicketRow[] = [
  { id: 1, title: 'Login issue', priority: 'High', owner: 'Alice' },
  { id: 2, title: 'Performance problem', priority: 'Low', owner: 'Bob' },
  { id: 3, title: 'Feature request', priority: 'Low', owner: 'Charlie' },
  { id: 4, title: 'Bug report', priority: 'Medium', owner: 'Diana' },
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, editable: false },
  { field: 'title', headerName: 'Title', width: 180, editable: false },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 120,
    editable: true,
    type: 'singleSelect',
    valueOptions: ['Low', 'Medium', 'High'],
    renderCell: (params: GridRenderCellParams) => (
      <Chip
        label={params.value}
        color={getPriorityColor(params.value as string) as any}
        size="small"
      />
    ),
  },
  { field: 'owner', headerName: 'Owner', width: 100, editable: false },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<MuiTicketRow[]>(initialRows);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as MuiTicketRow;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  // Check success condition after rows update
  useEffect(() => {
    const targetRow = rows.find((r) => r.id === 2);
    if (targetRow && targetRow.priority === REFERENCE_PRIORITY && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [rows, hasSucceeded, onSuccess]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Reference
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Target priority level:
            </Typography>
            <Chip
              label={REFERENCE_PRIORITY}
              color={getPriorityColor(REFERENCE_PRIORITY) as any}
              data-testid="priority-reference"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tickets
            </Typography>
            <Box sx={{ height: 280 }}>
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
      </Grid>
    </Grid>
  );
}
