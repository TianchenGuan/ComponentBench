'use client';

/**
 * Task ID: resizable_columns-mui-T01
 * Task Name: Resize Full name column to 220px (DataGrid)
 *
 * Setup Description:
 * Layout: isolated_card centered in the viewport.
 * One MUI X DataGrid with resizable columns:
 * - Column headers: ID, Full name, Email, Role.
 * - Resizing affordance: drag the right portion of the column separator.
 * - A "Width Monitor" line below the grid shows "Full name width: ###px".
 *
 * Initial state: Full name starts at 160px.
 *
 * Success Trigger: Full name column width is within ±10px of 220px.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

const rows = [
  { id: 1, fullName: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
  { id: 3, fullName: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    id: 80,
    fullName: 160,
    email: 200,
    role: 120,
  });
  const successFired = useRef(false);

  const fullNameWidth = columnWidths.fullName ?? 160;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(fullNameWidth, 220, 10)) {
      successFired.current = true;
      onSuccess();
    }
  }, [fullNameWidth, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: columnWidths.id, resizable: true },
    { field: 'fullName', headerName: 'Full name', width: columnWidths.fullName, resizable: true },
    { field: 'email', headerName: 'Email', width: columnWidths.email, resizable: true },
    { field: 'role', headerName: 'Role', width: columnWidths.role, resizable: true },
  ];

  return (
    <Card sx={{ width: 700 }} data-testid="rc-datagrid-container">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Users
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
          color="text.secondary"
          sx={{ mt: 1 }}
          data-testid="rc-width-full_name"
        >
          Full name width: {fullNameWidth}px
        </Typography>
      </CardContent>
    </Card>
  );
}
