'use client';

/**
 * data_grid_editable-mui-v2-T15: Wide services grid — horizontal scroll to offscreen Escalation owner
 *
 * Wide DataGrid "Services" with many columns. ID is pinned left. Escalation owner is offscreen right.
 * Scroll horizontally, then set Escalation owner for row SR-442 to "Platform".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Stack, Paper, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

interface Row { id: string; service: string; tier: string; owner: string; reviewer: string; escalationTeam: string; escalationOwner: string; region: string; }

const initialRows: Row[] = [
  { id: 'SR-440', service: 'Auth Service', tier: 'P0', owner: 'Alice', reviewer: 'Bob', escalationTeam: 'SRE', escalationOwner: 'Core', region: 'US-East' },
  { id: 'SR-441', service: 'Payment Gateway', tier: 'P0', owner: 'Charlie', reviewer: 'Dana', escalationTeam: 'Billing', escalationOwner: 'Finance', region: 'US-West' },
  { id: 'SR-442', service: 'Notification Hub', tier: 'P1', owner: 'Eve', reviewer: 'Frank', escalationTeam: 'SRE', escalationOwner: 'Infra', region: 'EU-West' },
  { id: 'SR-443', service: 'Search Index', tier: 'P1', owner: 'George', reviewer: 'Hannah', escalationTeam: 'Data', escalationOwner: 'Core', region: 'US-East' },
  { id: 'SR-444', service: 'CDN Edge', tier: 'P2', owner: 'Ivan', reviewer: 'Jane', escalationTeam: 'Infra', escalationOwner: 'Networking', region: 'AP-South' },
  { id: 'SR-445', service: 'Analytics Engine', tier: 'P2', owner: 'Kim', reviewer: 'Leo', escalationTeam: 'Data', escalationOwner: 'Core', region: 'US-West' },
];

export default function T15({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const successFired = useRef(false);

  const processRowUpdate = useCallback((newRow: GridRowModel) => {
    const u = newRow as Row;
    setRows(prev => prev.map(r => (r.id === u.id ? u : r)));
    return u;
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const t = rows.find(r => r.id === 'SR-442');
    if (t && t.escalationOwner.trim() === 'Platform') {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'service', headerName: 'Service', width: 140 },
    { field: 'tier', headerName: 'Tier', width: 60 },
    { field: 'owner', headerName: 'Owner', width: 100 },
    { field: 'reviewer', headerName: 'Reviewer', width: 100 },
    { field: 'region', headerName: 'Region', width: 100 },
    { field: 'escalationTeam', headerName: 'Escalation team', width: 130, editable: true },
    { field: 'escalationOwner', headerName: 'Escalation owner', width: 140, editable: true },
  ];

  return (
    <Stack spacing={1} sx={{ p: 2 }}>
      <Stack direction="row" spacing={0.5}>
        <Chip label="6 services" size="small" variant="outlined" />
        <Chip label="2 P0" size="small" color="error" variant="outlined" />
      </Stack>
      <Card sx={{ maxWidth: 650 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Services</Typography>
          <Box sx={{ height: 340, overflow: 'auto' }}>
            <DataGrid rows={rows} columns={columns}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={e => console.error(e)}
              disableRowSelectionOnClick hideFooter density="compact"
              sx={{ minWidth: 950 }} />
          </Box>
        </CardContent>
      </Card>
      <Paper sx={{ p: 1 }}>
        <Typography variant="caption" color="text.secondary">Incident summary (read-only)</Typography>
      </Paper>
    </Stack>
  );
}
