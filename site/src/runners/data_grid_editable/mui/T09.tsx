'use client';

/**
 * data_grid_editable-mui-T09: Edit the correct DataGrid when two are on the page
 *
 * This page is a planning dashboard with two MUI X DataGrids stacked vertically:
 *
 * - Top card: "Current sprint" data grid.
 * - Bottom card: "Backlog" data grid.
 *
 * Both grids have similar columns and both are editable, so you must choose the correct instance.
 *
 * Backlog grid details:
 * - Columns: Item ID (read-only key, e.g., BL-13), Title (editable text), Owner (read-only), Status (read-only).
 * - Editing Title uses standard cell editing (double click / Enter to edit; Enter/blur to commit).
 *
 * Scene configuration:
 * - Light theme; comfortable spacing; default scale.
 * - Two grid instances (Current sprint vs Backlog).
 * - Medium clutter: a few non-required filter chips and a "Refresh" icon appear in the header area.
 *
 * Initial state:
 * - In the Backlog grid, item BL-13 exists and its Title is not "Refactor auth".
 */

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, IconButton, Stack } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import type { TaskComponentProps, BacklogRow } from '../types';

interface SprintRow {
  id: string;
  title: string;
  owner: string;
  status: string;
}

const sprintRows: SprintRow[] = [
  { id: 'SP-1', title: 'User authentication', owner: 'Alice', status: 'In Progress' },
  { id: 'SP-2', title: 'Dashboard redesign', owner: 'Bob', status: 'Done' },
  { id: 'SP-3', title: 'API optimization', owner: 'Charlie', status: 'In Progress' },
];

const backlogRows: BacklogRow[] = [
  { id: 'BL-10', title: 'Mobile support', owner: 'Diana', status: 'Planned' },
  { id: 'BL-11', title: 'Dark mode', owner: 'Edward', status: 'Planned' },
  { id: 'BL-12', title: 'Export feature', owner: 'Fiona', status: 'Planned' },
  { id: 'BL-13', title: 'Legacy cleanup', owner: 'George', status: 'Planned' },
  { id: 'BL-14', title: 'Performance monitoring', owner: 'Hannah', status: 'Planned' },
];

const sprintColumns: GridColDef[] = [
  { field: 'id', headerName: 'Item ID', width: 80 },
  { field: 'title', headerName: 'Title', width: 180, editable: true },
  { field: 'owner', headerName: 'Owner', width: 100 },
  { field: 'status', headerName: 'Status', width: 100 },
];

const backlogColumns: GridColDef[] = [
  { field: 'id', headerName: 'Item ID', width: 80 },
  { field: 'title', headerName: 'Title', width: 180, editable: true },
  { field: 'owner', headerName: 'Owner', width: 100 },
  { field: 'status', headerName: 'Status', width: 100 },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [sprint, setSprint] = useState<SprintRow[]>(sprintRows);
  const [backlog, setBacklog] = useState<BacklogRow[]>(backlogRows);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const processSprintUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as SprintRow;
    setSprint((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const processBacklogUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as BacklogRow;
    setBacklog((prev) => prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    return updatedRow;
  };

  // Check success condition after backlog update
  useEffect(() => {
    const targetRow = backlog.find((r) => r.id === 'BL-13');
    if (targetRow && targetRow.title.trim() === 'Refactor auth' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [backlog, hasSucceeded, onSuccess]);

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Chip label="All" variant="outlined" size="small" />
        <Chip label="In Progress" variant="outlined" size="small" />
        <Chip label="Planned" variant="outlined" size="small" />
        <IconButton size="small">
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Card sx={{ mb: 2 }} data-testid="current-sprint-grid">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current sprint
          </Typography>
          <Box sx={{ height: 200 }}>
            <DataGrid
              rows={sprint}
              columns={sprintColumns}
              processRowUpdate={processSprintUpdate}
              onProcessRowUpdateError={(error) => console.error(error)}
              disableRowSelectionOnClick
              hideFooter
            />
          </Box>
        </CardContent>
      </Card>

      <Card data-testid="backlog-grid">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Backlog
          </Typography>
          <Box sx={{ height: 280 }}>
            <DataGrid
              rows={backlog}
              columns={backlogColumns}
              processRowUpdate={processBacklogUpdate}
              onProcessRowUpdateError={(error) => console.error(error)}
              disableRowSelectionOnClick
              hideFooter
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
