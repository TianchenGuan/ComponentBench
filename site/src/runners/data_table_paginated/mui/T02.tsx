'use client';

/**
 * data_table_paginated-mui-T02: Users grid: set rows per page to 50
 *
 * Layout: isolated card centered titled **Users**.
 * Component: MUI X DataGrid with pagination. Footer includes a **Rows per page** select
 * with options 25, 50, 100.
 *
 * Initial state: page 1, rows per page = 25.
 *
 * Success: Users grid page size is 50 rows per page.
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

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [rows] = useState(() => generateUserData(250));
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    if (paginationModel.pageSize === 50 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [paginationModel.pageSize, hasSucceeded, onSuccess]);

  return (
    <Card sx={{ width: 700 }} data-testid="users-card">
      <CardHeader title="Users" />
      <CardContent>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[25, 50, 100]}
          disableRowSelectionOnClick
          sx={{ height: 500 }}
          data-testid="users-grid"
          data-page-size={paginationModel.pageSize}
        />
      </CardContent>
    </Card>
  );
}
