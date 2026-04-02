'use client';

/**
 * data_table_paginated-mui-T01: Users grid: go to page 2
 *
 * Layout: isolated card centered titled **Users**.
 * Component: MUI X **DataGrid** with client-side pagination enabled.
 * The footer shows the displayed-rows label (e.g., "1–25 of 250"), a Rows-per-page selector,
 * and Next/Previous page arrow buttons.
 *
 * Dataset: 250 users (User IDs U-0001…U-0250). Page size is 25 rows per page (10 pages total).
 * Initial state: page 1 (showing rows 1–25), no sorting, no filters, no selected rows.
 *
 * Success: Users grid current page is 2 (1-based in canonical state).
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
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

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [rows] = useState(() => generateUserData(250));
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0, // MUI uses 0-based indexing
    pageSize: 25,
  });
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    // Success when page is 2 (which is page index 1 in MUI)
    if (paginationModel.page === 1 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [paginationModel.page, hasSucceeded, onSuccess]);

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
          disableRowSelectionOnClick
          sx={{ height: 500 }}
          data-testid="users-grid"
          data-current-page={paginationModel.page + 1}
        />
      </CardContent>
    </Card>
  );
}
