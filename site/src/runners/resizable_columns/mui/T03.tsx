'use client';

/**
 * Task ID: resizable_columns-mui-T03
 * Task Name: Dark theme: set Status column to 140px
 *
 * Setup Description:
 * Layout: isolated_card, centered, dark theme.
 * One MUI X DataGrid:
 * - Headers: Ticket, Owner, Status, Updated.
 * - A "Status width: ###px" monitor appears below the grid.
 *
 * Initial state: Status starts at 100px.
 *
 * Success Trigger: Status column width is within ±10px of 140px.
 *
 * Theme: dark, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

const rows = [
  { id: 1, ticket: 'TKT-001', owner: 'John Doe', status: 'Open', updated: '2024-01-15' },
  { id: 2, ticket: 'TKT-002', owner: 'Jane Smith', status: 'In Progress', updated: '2024-01-14' },
  { id: 3, ticket: 'TKT-003', owner: 'Bob Wilson', status: 'Resolved', updated: '2024-01-13' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    ticket: 120,
    owner: 150,
    status: 100,
    updated: 130,
  });
  const successFired = useRef(false);

  const statusWidth = columnWidths.status ?? 100;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(statusWidth, 140, 10)) {
      successFired.current = true;
      onSuccess();
    }
  }, [statusWidth, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'ticket', headerName: 'Ticket', width: columnWidths.ticket, resizable: true },
    { field: 'owner', headerName: 'Owner', width: columnWidths.owner, resizable: true },
    { field: 'status', headerName: 'Status', width: columnWidths.status, resizable: true },
    { field: 'updated', headerName: 'Updated', width: columnWidths.updated, resizable: true },
  ];

  return (
    <Card
      sx={{ width: 650, bgcolor: '#1e1e1e' }}
      data-testid="rc-datagrid-tickets"
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
          Tickets grid
        </Typography>
        <Box sx={{ height: 250, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter
            onColumnWidthChange={(params) => {
              setColumnWidths(prev => ({
                ...prev,
                [params.colDef.field]: params.width,
              }));
            }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{ mt: 1, color: '#aaa' }}
          data-testid="rc-width-status"
        >
          Status width: {statusWidth}px
        </Typography>
      </CardContent>
    </Card>
  );
}
