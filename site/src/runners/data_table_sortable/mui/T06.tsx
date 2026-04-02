'use client';

/**
 * data_table_sortable-mui-T16: Wide grid - scroll to Created on and sort newest→oldest (bottom-right)
 *
 * Single wide MUI X DataGrid titled "Activity", positioned near the bottom-right.
 * - Many columns, horizontal scrolling required.
 * - Target column "Created on" is near the far right.
 * - Initial state: unsorted.
 *
 * Success: Created on sorted descending.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../types';

interface ActivityData {
  id: string;
  activityId: string;
  user: string;
  action: string;
  resource: string;
  resourceType: string;
  status: string;
  duration: string;
  createdOn: string;
}

const activityData: ActivityData[] = [
  { id: '1', activityId: 'ACT-001', user: 'alice@co.com', action: 'Create', resource: 'Document A', resourceType: 'File', status: 'Success', duration: '2s', createdOn: '2024-02-15 09:30' },
  { id: '2', activityId: 'ACT-002', user: 'bob@co.com', action: 'Update', resource: 'Project X', resourceType: 'Project', status: 'Success', duration: '5s', createdOn: '2024-02-15 08:45' },
  { id: '3', activityId: 'ACT-003', user: 'carol@co.com', action: 'Delete', resource: 'Task 123', resourceType: 'Task', status: 'Success', duration: '1s', createdOn: '2024-02-15 10:15' },
  { id: '4', activityId: 'ACT-004', user: 'david@co.com', action: 'Create', resource: 'Report Q1', resourceType: 'Report', status: 'Pending', duration: '10s', createdOn: '2024-02-14 17:30' },
  { id: '5', activityId: 'ACT-005', user: 'emma@co.com', action: 'Update', resource: 'Settings', resourceType: 'Config', status: 'Success', duration: '3s', createdOn: '2024-02-15 11:00' },
  { id: '6', activityId: 'ACT-006', user: 'frank@co.com', action: 'Share', resource: 'Document B', resourceType: 'File', status: 'Success', duration: '2s', createdOn: '2024-02-14 14:20' },
  { id: '7', activityId: 'ACT-007', user: 'grace@co.com', action: 'Export', resource: 'Data Set', resourceType: 'Data', status: 'Failed', duration: '45s', createdOn: '2024-02-15 07:55' },
  { id: '8', activityId: 'ACT-008', user: 'henry@co.com', action: 'Import', resource: 'Contacts', resourceType: 'Data', status: 'Success', duration: '30s', createdOn: '2024-02-14 16:45' },
];

const columns: GridColDef[] = [
  { field: 'activityId', headerName: 'Activity ID', width: 100, sortable: false },
  { field: 'user', headerName: 'User', width: 140, sortable: false },
  { field: 'action', headerName: 'Action', width: 90, sortable: false },
  { field: 'resource', headerName: 'Resource', width: 120, sortable: false },
  { field: 'resourceType', headerName: 'Type', width: 90, sortable: false },
  { field: 'status', headerName: 'Status', width: 90, sortable: false },
  { field: 'duration', headerName: 'Duration', width: 90, sortable: false },
  { field: 'createdOn', headerName: 'Created on', width: 140 },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  // Check success condition
  useEffect(() => {
    if (sortModel.length === 1 && sortModel[0].field === 'createdOn' && sortModel[0].sort === 'desc') {
      onSuccess();
    }
  }, [sortModel, onSuccess]);

  const canonicalSortModel: SortModel = sortModel.map((item: GridSortModel[number], idx: number) => ({
    column_key: item.field === 'createdOn' ? 'created_on' : item.field,
    direction: item.sort || 'asc',
    priority: idx + 1,
  }));

  return (
    <Card sx={{ width: 650 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Activity
        </Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={activityData}
            columns={columns}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            data-testid="grid-activity"
            data-sort-model={JSON.stringify(canonicalSortModel)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
