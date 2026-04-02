'use client';

/**
 * data_table_paginated-mui-T08: Users grid: multi-select three users across distant pages
 *
 * Layout: isolated card centered titled **Users** in **dark theme**.
 *
 * Component: MUI X DataGrid with checkboxSelection and pagination (25 rows per page).
 * Selection model is configured to persist across pagination.
 *
 * Target IDs are on different pages:
 * • U-0020 (page 1)
 * • U-0077 (page 4)
 * • U-0199 (page 8)
 *
 * Initial state: page 1; no rows selected.
 *
 * Success: Selected row IDs are exactly {U-0020, U-0077, U-0199}.
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridRowSelectionModel } from '@mui/x-data-grid';
import { Card, CardHeader, CardContent, Chip, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { generateUserData } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

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
  {
    field: 'lastSeen',
    headerName: 'Last seen',
    width: 180,
    valueFormatter: (value: string) => new Date(value).toLocaleString(),
  },
];

const TARGET_IDS = ['U-0020', 'U-0077', 'U-0199'];

export default function T08({ task, onSuccess }: TaskComponentProps) {
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
    // Success when exactly the three target IDs are selected
    const ids = rowSelectionModel.ids;
    
    if (
      ids.size === TARGET_IDS.length &&
      TARGET_IDS.every(id => ids.has(id)) &&
      !hasSucceeded
    ) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [rowSelectionModel, hasSucceeded, onSuccess]);

  // Note: Dark theme is also handled by ThemeWrapper, but we add local ThemeProvider for MUI specifics
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Card sx={{ width: 700, bgcolor: 'background.paper' }} data-testid="users-card">
        <CardHeader title="Users" />
        <CardContent>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[25]}
            checkboxSelection
            keepNonExistentRowsSelected
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={setRowSelectionModel}
            sx={{ height: 500 }}
            data-testid="users-grid"
            data-current-page={paginationModel.page + 1}
            data-selected-rows={JSON.stringify(Array.from(rowSelectionModel.ids))}
          />
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
