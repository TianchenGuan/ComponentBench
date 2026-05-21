'use client';

/**
 * data_table_paginated-mui-T03: Users grid: sort by Last seen (most recent first)
 *
 * Layout: isolated card centered titled **Users**.
 * Component: MUI X DataGrid with sortable columns.
 *
 * Columns: User ID, Name, Role, Status, and **Last seen** (date-time).
 * Initial state: no active sort model (neutral).
 *
 * Success: Active sort model is Last seen descending (most recent first).
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { Card, CardHeader, CardContent, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { generateUserData } from '../types';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'User ID', width: 100, sortable: true },
  { field: 'name', headerName: 'Name', width: 150, sortable: true },
  { field: 'role', headerName: 'Role', width: 100, sortable: true },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    sortable: true,
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
    sortable: true,
    valueFormatter: (value: string) => new Date(value).toLocaleString(),
  },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [rows] = useState(() => generateUserData(250));
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    // Success when sorted by lastSeen descending
    if (
      sortModel.length === 1 &&
      sortModel[0].field === 'lastSeen' &&
      sortModel[0].sort === 'desc' &&
      !hasSucceeded
    ) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [sortModel, hasSucceeded, onSuccess]);

  return (
    <Card sx={{ width: 700 }} data-testid="users-card">
      <CardHeader title="Users" />
      <CardContent>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          pageSizeOptions={[25]}
          disableRowSelectionOnClick
          sx={{ height: 500 }}
          data-testid="users-grid"
          data-sort-field={sortModel[0]?.field || ''}
          data-sort-direction={sortModel[0]?.sort || ''}
        />
      </CardContent>
    </Card>
  );
}
