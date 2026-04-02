'use client';

/**
 * data_table_paginated-mui-T04: Users grid: search and select the user from a reference chip
 *
 * Layout: isolated card centered titled **Users** with a small right-side panel.
 *
 * Component: MUI X DataGrid with toolbar enabled (includes a quick search/quick filter text field).
 * The grid supports checkbox row selection.
 *
 * Reference (mixed guidance): to the right of the grid is a **Target user** chip showing
 * an avatar and the text **Maria Chen**.
 *
 * Dataset: 250 users. Maria Chen appears exactly once in the Name column and is not on the first page.
 *
 * Initial state: page 1; no filters; no selected rows.
 *
 * Success: The selected row matches the reference chip user (resolved to User ID U-0137).
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridToolbarQuickFilter, GridRowSelectionModel } from '@mui/x-data-grid';
import { Card, CardHeader, CardContent, Chip, Avatar, Box, Paper, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import type { TaskComponentProps } from '../types';
import { generateUserData } from '../types';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'User ID', width: 100 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'role', headerName: 'Role', width: 100 },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={params.value === 'Active' ? 'success' : params.value === 'Inactive' ? 'default' : 'warning'}
      />
    ),
  },
  { field: 'email', headerName: 'Email', width: 200 },
];

function QuickSearchToolbar() {
  return (
    <Box sx={{ p: 1 }}>
      <GridToolbarQuickFilter />
    </Box>
  );
}

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [rows] = useState(() => generateUserData(250));
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    // Success when U-0137 is selected (exactly one row)
    const ids = rowSelectionModel.ids;
    if (
      ids.size === 1 &&
      ids.has('U-0137') &&
      !hasSucceeded
    ) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [rowSelectionModel, hasSucceeded, onSuccess]);

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Card sx={{ width: 700 }} data-testid="users-card">
        <CardHeader title="Users" />
        <CardContent>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[25]}
            checkboxSelection
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={setRowSelectionModel}
            slots={{ toolbar: QuickSearchToolbar }}
            sx={{ height: 500 }}
            data-testid="users-grid"
            data-selected-rows={JSON.stringify(Array.from(rowSelectionModel.ids))}
          />
        </CardContent>
      </Card>

      {/* Reference chip panel */}
      <Paper sx={{ p: 2, width: 200, height: 'fit-content' }} data-testid="reference-panel" data-reference-id="ref-user-chip-1">
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Target user
        </Typography>
        <Chip
          avatar={<Avatar><PersonIcon /></Avatar>}
          label="Maria Chen"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Paper>
    </Box>
  );
}
