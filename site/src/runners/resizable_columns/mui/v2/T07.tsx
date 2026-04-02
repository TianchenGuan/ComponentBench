'use client';

/**
 * Task ID: resizable_columns-mui-v2-T07
 * Task Name: Compact tri-column convergence at top-left
 *
 * Setup Description:
 * Layout uses inline_surface with compact spacing, small scale, and high clutter. The grid sits near the top-left of an operations surface so the user has to acquire it in a crowded region. Density mode is compact and the visible separators are close together.
 * A shared monitor above the grid reads `ID: ###px • Customer: ###px • Status: ###px`. Initial widths are ID 108px, Customer 162px, and Status 142px. The remaining columns Updated and Queue are present but not targets.
 *
 * Success Trigger: ID 76px, Customer 196px, Status 118px each within ±4px.
 * require_confirm: false
 *
 * Theme: light, Spacing: compact, Layout: inline_surface, Placement: top_left, scale: small
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

const rows = [
  { rowKey: 1, id: 'O-104', customer: 'Northwind', status: 'Picking', updated: '10:01', queue: 'A' },
  { rowKey: 2, id: 'O-105', customer: 'Contoso', status: 'Packed', updated: '09:44', queue: 'B' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    id: 108,
    customer: 162,
    status: 142,
    updated: 130,
    queue: 88,
  });
  const successFired = useRef(false);

  const idW = columnWidths.id ?? 108;
  const customerW = columnWidths.customer ?? 162;
  const statusW = columnWidths.status ?? 142;

  useEffect(() => {
    const idOk = isWithinTolerance(idW, 76, 4);
    const customerOk = isWithinTolerance(customerW, 196, 4);
    const statusOk = isWithinTolerance(statusW, 118, 4);
    if (!successFired.current && idOk && customerOk && statusOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [idW, customerW, statusW, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: columnWidths.id, resizable: true },
    { field: 'customer', headerName: 'Customer', width: columnWidths.customer, resizable: true },
    { field: 'status', headerName: 'Status', width: columnWidths.status, resizable: true },
    { field: 'updated', headerName: 'Updated', width: columnWidths.updated, resizable: true },
    { field: 'queue', headerName: 'Queue', width: columnWidths.queue, resizable: true },
  ];

  return (
    <Box sx={{ position: 'relative', width: 640, maxWidth: '100%' }} data-testid="rc-inline-orders-compact">
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
        <Chip size="small" label="Ops" variant="outlined" />
        <Chip size="small" label="SLA watch" color="warning" variant="outlined" />
        <Chip size="small" label="3 alerts" variant="outlined" />
        <Chip size="small" label="Shift B" variant="outlined" />
      </Stack>
      <Card variant="outlined" sx={{ transform: 'scale(0.92)', transformOrigin: 'top left', width: 'calc(100% / 0.92)' }}>
        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }} data-testid="rc-width-monitor-triple">
            ID: {idW}px • Customer: {customerW}px • Status: {statusW}px
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Orders (compact)
          </Typography>
          <Box sx={{ height: 200, width: '100%' }}>
            <DataGrid
              density="compact"
              rows={rows}
              columns={columns}
              getRowId={(r) => r.rowKey}
              disableRowSelectionOnClick
              hideFooter
              onColumnWidthChange={(params) => {
                setColumnWidths((prev) => ({
                  ...prev,
                  [params.colDef.field]: params.width,
                }));
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
