'use client';

/**
 * data_table_sortable-mui-T18: Column menu - sort Status ascending (open-and-select)
 *
 * Single MUI X DataGrid titled "Deployments".
 * - Columns: Deployment, Environment, Status, Started, Duration.
 * - Each column header has a menu icon that opens column options.
 * - Initial state: unsorted.
 *
 * Distractors: toolbar with Columns, Density, Export buttons.
 * Success: Status sorted ascending via column menu.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../types';

interface DeploymentData {
  id: string;
  deployment: string;
  environment: string;
  status: 'Success' | 'Failed' | 'Running' | 'Pending';
  started: string;
  duration: string;
}

const deploymentsData: DeploymentData[] = [
  { id: '1', deployment: 'v2.5.1', environment: 'Production', status: 'Success', started: '2024-02-15 09:00', duration: '3m 45s' },
  { id: '2', deployment: 'v2.5.0', environment: 'Staging', status: 'Success', started: '2024-02-14 14:30', duration: '2m 10s' },
  { id: '3', deployment: 'v2.4.9', environment: 'Production', status: 'Failed', started: '2024-02-13 11:00', duration: '1m 23s' },
  { id: '4', deployment: 'v2.5.2-rc', environment: 'Development', status: 'Running', started: '2024-02-15 10:30', duration: '-' },
  { id: '5', deployment: 'v2.4.8', environment: 'Production', status: 'Success', started: '2024-02-12 16:00', duration: '4m 02s' },
  { id: '6', deployment: 'v2.5.1-hotfix', environment: 'Staging', status: 'Pending', started: '-', duration: '-' },
  { id: '7', deployment: 'v2.4.7', environment: 'Production', status: 'Success', started: '2024-02-11 09:15', duration: '3m 55s' },
  { id: '8', deployment: 'v2.5.0-beta', environment: 'Development', status: 'Failed', started: '2024-02-10 13:45', duration: '0m 45s' },
];

const statusColors: Record<DeploymentData['status'], 'success' | 'error' | 'info' | 'warning'> = {
  Success: 'success',
  Failed: 'error',
  Running: 'info',
  Pending: 'warning',
};

const columns: GridColDef[] = [
  { field: 'deployment', headerName: 'Deployment', width: 120, sortable: false },
  { field: 'environment', headerName: 'Environment', width: 120, sortable: false },
  {
    field: 'status',
    headerName: 'Status',
    width: 110,
    renderCell: (params: GridRenderCellParams) => (
      <Chip
        label={params.value}
        color={statusColors[params.value as DeploymentData['status']]}
        size="small"
      />
    ),
  },
  { field: 'started', headerName: 'Started', width: 150, sortable: false },
  { field: 'duration', headerName: 'Duration', width: 100, sortable: false },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  // Check success condition
  useEffect(() => {
    if (sortModel.length === 1 && sortModel[0].field === 'status' && sortModel[0].sort === 'asc') {
      onSuccess();
    }
  }, [sortModel, onSuccess]);

  const canonicalSortModel: SortModel = sortModel.map((item: GridSortModel[number], idx: number) => ({
    column_key: item.field,
    direction: item.sort || 'asc',
    priority: idx + 1,
  }));

  return (
    <Card sx={{ width: 700 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Deployments
        </Typography>
        <div style={{ height: 450 }}>
          <DataGrid
            rows={deploymentsData}
            columns={columns}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: false,
              },
            }}
            data-testid="grid-deployments"
            data-sort-model={JSON.stringify(canonicalSortModel)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
