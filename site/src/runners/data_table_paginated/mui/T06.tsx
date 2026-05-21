'use client';

/**
 * data_table_paginated-mui-T06: Users grid: filter Status to Active via filter panel
 *
 * Layout: **dashboard** page with a top bar (non-interactive) and the **Users** grid in main content.
 *
 * Component: MUI X DataGrid with the built-in toolbar enabled, including a **Filters** button
 * that opens the filter panel. The Status column supports a single filter rule.
 *
 * Initial state: no filters; page 1.
 *
 * Clutter: dashboard shows a small stats strip (cards like "Active", "Pending") above the grid.
 *
 * Success: Users grid has an active filter rule: Status equals Active.
 */

import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridFilterModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { Card, CardHeader, CardContent, Chip, Box, Paper, Typography } from '@mui/material';
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
    type: 'singleSelect',
    valueOptions: ['Active', 'Inactive', 'Pending'],
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

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [rows] = useState(() => generateUserData(250));
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [hasSucceeded, setHasSucceeded] = useState(false);

  // Count status for stats strip
  const activeCount = rows.filter(r => r.status === 'Active').length;
  const pendingCount = rows.filter(r => r.status === 'Pending').length;
  const inactiveCount = rows.filter(r => r.status === 'Inactive').length;

  useEffect(() => {
    // Success when filter is Status equals Active
    const statusFilter = filterModel.items.find(
      item => item.field === 'status' && item.operator === 'is' && item.value === 'Active'
    );
    if (statusFilter && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [filterModel, hasSucceeded, onSuccess]);

  return (
    <Box sx={{ maxWidth: 800 }}>
      {/* Stats strip */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main">{activeCount}</Typography>
          <Typography variant="body2" color="text.secondary">Active</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main">{pendingCount}</Typography>
          <Typography variant="body2" color="text.secondary">Pending</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
          <Typography variant="h4" color="text.disabled">{inactiveCount}</Typography>
          <Typography variant="body2" color="text.secondary">Inactive</Typography>
        </Paper>
      </Box>

      {/* Users grid */}
      <Card data-testid="users-card">
        <CardHeader title="Users" />
        <CardContent>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            pageSizeOptions={[25]}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: false,
              },
            }}
            sx={{ height: 500 }}
            data-testid="users-grid"
            data-filter-model={JSON.stringify(filterModel)}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
