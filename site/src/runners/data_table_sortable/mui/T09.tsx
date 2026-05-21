'use client';

/**
 * data_table_sortable-mui-T19: Server-like grid - sort Last updated newest→oldest with loading (dark)
 *
 * Dark theme scene with a single MUI X DataGrid titled "User Sessions".
 * - Simulates server-side sorting: loading overlay appears for ~1-2 seconds on sort change.
 * - Columns: User, IP address, Last updated, Status.
 * - Initial state: unsorted.
 *
 * Distractors: help tooltip icon.
 * Success: Last updated sorted descending AND loading is false.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Box, Tooltip, IconButton, Chip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridSortModel, GridRenderCellParams } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../types';

interface SessionData {
  id: string;
  user: string;
  ipAddress: string;
  lastUpdated: string;
  status: 'Active' | 'Idle' | 'Expired';
}

const sessionsData: SessionData[] = [
  { id: '1', user: 'alice@company.com', ipAddress: '192.168.1.100', lastUpdated: '2024-02-15 09:30:15', status: 'Active' },
  { id: '2', user: 'bob@company.com', ipAddress: '192.168.1.101', lastUpdated: '2024-02-15 08:45:22', status: 'Active' },
  { id: '3', user: 'carol@company.com', ipAddress: '192.168.1.102', lastUpdated: '2024-02-14 17:30:45', status: 'Idle' },
  { id: '4', user: 'david@company.com', ipAddress: '192.168.1.103', lastUpdated: '2024-02-15 10:15:08', status: 'Active' },
  { id: '5', user: 'emma@company.com', ipAddress: '192.168.1.104', lastUpdated: '2024-02-13 14:20:33', status: 'Expired' },
  { id: '6', user: 'frank@company.com', ipAddress: '192.168.1.105', lastUpdated: '2024-02-15 07:55:12', status: 'Active' },
  { id: '7', user: 'grace@company.com', ipAddress: '192.168.1.106', lastUpdated: '2024-02-14 16:45:50', status: 'Idle' },
  { id: '8', user: 'henry@company.com', ipAddress: '192.168.1.107', lastUpdated: '2024-02-15 11:00:00', status: 'Active' },
];

const statusColors: Record<SessionData['status'], 'success' | 'warning' | 'default'> = {
  Active: 'success',
  Idle: 'warning',
  Expired: 'default',
};

const columns: GridColDef[] = [
  { field: 'user', headerName: 'User', width: 180, sortable: false },
  { field: 'ipAddress', headerName: 'IP address', width: 130, sortable: false },
  { field: 'lastUpdated', headerName: 'Last updated', width: 160 },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <Chip
        label={params.value}
        color={statusColors[params.value as SessionData['status']]}
        size="small"
      />
    ),
  },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [loading, setLoading] = useState(false);
  const [appliedSortModel, setAppliedSortModel] = useState<GridSortModel>([]);

  const handleSortModelChange = useCallback((newModel: GridSortModel) => {
    setSortModel(newModel);
    setLoading(true);
    
    // Simulate server delay
    setTimeout(() => {
      setAppliedSortModel(newModel);
      setLoading(false);
    }, 1500);
  }, []);

  // Check success condition: applied sort model is correct AND not loading
  useEffect(() => {
    if (
      !loading &&
      appliedSortModel.length === 1 &&
      appliedSortModel[0].field === 'lastUpdated' &&
      appliedSortModel[0].sort === 'desc'
    ) {
      onSuccess();
    }
  }, [appliedSortModel, loading, onSuccess]);

  const canonicalSortModel: SortModel = appliedSortModel.map((item: GridSortModel[number], idx: number) => ({
    column_key: item.field === 'lastUpdated' ? 'last_updated' : item.field,
    direction: item.sort || 'asc',
    priority: idx + 1,
  }));

  return (
    <Card sx={{ width: 650 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            User Sessions
          </Typography>
          <Tooltip title="Sessions are automatically refreshed every 5 minutes">
            <IconButton size="small">
              <HelpOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <div style={{ height: 400 }}>
          <DataGrid
            rows={sessionsData}
            columns={columns}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            loading={loading}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            data-testid="grid-user-sessions"
            data-sort-model={JSON.stringify(canonicalSortModel)}
            data-loading={String(loading)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
