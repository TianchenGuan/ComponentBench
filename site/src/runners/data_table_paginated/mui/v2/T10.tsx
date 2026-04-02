'use client';

/**
 * data_table_paginated-mui-v2-T10: Sessions surface — configure Archived sessions, not Live sessions
 *
 * Off-center inline surface with two side-by-side MUI DataGrid cards:
 * "Live sessions" and "Archived sessions". Small audit-summary card beneath.
 * Initial: both page 1 (0-indexed: 0), size 10.
 * Target: Archived sessions → size 50, page 5 (0-indexed: 4).
 * Live sessions must remain page 1, size 10.
 */

import React, { useState, useRef, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Card, CardHeader, CardContent, Box, Typography, Chip } from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { generateUserData } from '../../types';

const sessionColumns: GridColDef[] = [
  { field: 'id', headerName: 'Session ID', width: 110 },
  { field: 'name', headerName: 'User', width: 140 },
  { field: 'status', headerName: 'Status', width: 100,
    renderCell: (p) => <Chip label={p.value} size="small" variant="outlined" /> },
  {
    field: 'lastSeen', headerName: 'Started', width: 160,
    valueFormatter: (v: string) => new Date(v).toLocaleString(),
  },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [liveRows] = useState(() =>
    generateUserData(150).map((u) => ({ ...u, id: u.id.replace('U-', 'LS-') })),
  );
  const [archivedRows] = useState(() =>
    generateUserData(300).map((u) => ({ ...u, id: u.id.replace('U-', 'AS-') })),
  );

  const [livePM, setLivePM] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [archivedPM, setArchivedPM] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      archivedPM.pageSize === 50 && archivedPM.page === 4 &&
      livePM.pageSize === 10 && livePM.page === 0
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [archivedPM, livePM, onSuccess]);

  return (
    <Box sx={{ p: 2, maxWidth: 1100 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Card sx={{ flex: 1 }} data-testid="live-sessions-card">
          <CardHeader title="Live sessions" titleTypographyProps={{ variant: 'subtitle1' }} />
          <CardContent>
            <DataGrid
              rows={liveRows}
              columns={sessionColumns}
              paginationModel={livePM}
              onPaginationModelChange={setLivePM}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              sx={{ height: 420 }}
              data-testid="live-sessions-grid"
              data-current-page={livePM.page + 1}
              data-page-size={livePM.pageSize}
            />
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }} data-testid="archived-sessions-card">
          <CardHeader title="Archived sessions" titleTypographyProps={{ variant: 'subtitle1' }} />
          <CardContent>
            <DataGrid
              rows={archivedRows}
              columns={sessionColumns}
              paginationModel={archivedPM}
              onPaginationModelChange={setArchivedPM}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              sx={{ height: 420 }}
              data-testid="archived-sessions-grid"
              data-current-page={archivedPM.page + 1}
              data-page-size={archivedPM.pageSize}
            />
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ p: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          Audit summary: 450 total sessions — 150 live, 300 archived
        </Typography>
      </Card>
    </Box>
  );
}
