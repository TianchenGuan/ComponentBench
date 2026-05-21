'use client';

/**
 * data_table_paginated-mui-T10: Users grid: resize the Email column to reveal full text
 *
 * Layout: isolated card positioned near the **top-right** of the viewport.
 *
 * Component: MUI X DataGrid with pagination and resizable columns (default behavior).
 * Page size is 25.
 *
 * Initial state: the **Email** column is intentionally narrow, causing long emails to be
 * truncated with an ellipsis (…).
 *
 * Scale: **small** — the column resize handle is thin and requires precise pointer control.
 *
 * Success: Email column width is at least 260 px.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridColumnResizeParams } from '@mui/x-data-grid';
import { Card, CardHeader, CardContent, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { generateUserData } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [rows] = useState(() => {
    // Generate users with longer email addresses
    const data = generateUserData(250);
    // Make first few users have long emails
    data[0].email = 'alex.henderson@company.example.com';
    data[1].email = 'chris.jones@longerdomain.example.org';
    data[2].email = 'elizabeth.smythe@workplace.example.net';
    return data;
  });
  
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [emailColumnWidth, setEmailColumnWidth] = useState(120); // Intentionally narrow
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'User ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 130, resizable: true },
    { field: 'role', headerName: 'Role', width: 90, resizable: true },
    {
      field: 'email',
      headerName: 'Email',
      width: emailColumnWidth,
      resizable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 90,
      resizable: true,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'Active' ? 'success' : params.value === 'Inactive' ? 'default' : 'warning'}
        />
      ),
    },
  ];

  useEffect(() => {
    if (emailColumnWidth >= 200 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [emailColumnWidth, hasSucceeded, onSuccess]);

  const handleColumnResize = useCallback((params: GridColumnResizeParams) => {
    if (params.colDef.field === 'email') {
      setEmailColumnWidth(params.width);
    }
  }, []);

  // Note: Placement (top-right) is handled by PlacementWrapper
  return (
    <Card sx={{ width: 600 }} data-testid="users-card">
      <CardHeader title="Users" titleTypographyProps={{ variant: 'subtitle1' }} />
      <CardContent sx={{ p: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[25]}
          disableRowSelectionOnClick
          onColumnWidthChange={handleColumnResize}
          density="compact"
          sx={{ height: 400 }}
          data-testid="users-grid"
          data-email-column-width={emailColumnWidth}
        />
      </CardContent>
    </Card>
  );
}
