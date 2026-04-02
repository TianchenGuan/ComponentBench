'use client';

/**
 * data_table_paginated-mui-T05: Users grid: select user U-0062 (page 3)
 *
 * Layout: isolated card anchored near the **bottom-left** of the viewport titled **Users**.
 *
 * Component: MUI X DataGrid with pagination (25 rows per page) and checkbox selection.
 *
 * Dataset: 250 users with sequential IDs. User **U-0062** appears on page 3 (rows 51–75).
 *
 * Initial state: page 1; no rows selected.
 *
 * Success: Exactly one selected row: U-0062.
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridRowSelectionModel } from '@mui/x-data-grid';
import { Card, CardHeader, CardContent, Chip } from '@mui/material';
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
  {
    field: 'lastSeen',
    headerName: 'Last seen',
    width: 180,
    valueFormatter: (value: string) => new Date(value).toLocaleString(),
  },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
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
    // Success when U-0062 is selected (exactly one row)
    const ids = rowSelectionModel.ids;
    if (
      ids.size === 1 &&
      ids.has('U-0062') &&
      !hasSucceeded
    ) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [rowSelectionModel, hasSucceeded, onSuccess]);

  // Note: Placement (bottom-left) is handled by PlacementWrapper
  return (
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
            sx={{ height: 500 }}
            data-testid="users-grid"
            data-current-page={paginationModel.page + 1}
            data-selected-rows={JSON.stringify(Array.from(rowSelectionModel.ids))}
        />
      </CardContent>
    </Card>
  );
}
