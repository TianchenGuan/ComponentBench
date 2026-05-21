'use client';

/**
 * Task ID: resizable_columns-mui-T07
 * Task Name: Use toolbar to reset DataGrid column widths
 *
 * Setup Description:
 * Layout: isolated_card, centered.
 * One MUI DataGrid with a compact toolbar row above it:
 * - Buttons: "Reset widths" (primary), "Export" (distractor), "Density" (distractor).
 *
 * Default widths: ID 90px, Name 180px, Email 240px, Role 120px.
 * Initial state (customized): ID 90px, Name 140px, Email 300px, Role 120px.
 *
 * Success Trigger: All column widths match defaults exactly.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box, Button, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Snackbar, Alert } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { allWidthsExactMatch } from '../types';

const rows = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer' },
];

const defaultWidths: Record<string, number> = {
  id: 90,
  name: 180,
  email: 240,
  role: 120,
};

export default function T07({ onSuccess }: TaskComponentProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    id: 90,
    name: 140,
    email: 300,
    role: 120,
  });
  const [showToast, setShowToast] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && allWidthsExactMatch(columnWidths, defaultWidths)) {
      successFired.current = true;
      onSuccess();
    }
  }, [columnWidths, onSuccess]);

  const handleReset = () => {
    setColumnWidths({ ...defaultWidths });
    setShowToast(true);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: columnWidths.id, resizable: true },
    { field: 'name', headerName: 'Name', width: columnWidths.name, resizable: true },
    { field: 'email', headerName: 'Email', width: columnWidths.email, resizable: true },
    { field: 'role', headerName: 'Role', width: columnWidths.role, resizable: true },
  ];

  return (
    <Card sx={{ width: 700 }} data-testid="rc-datagrid-container">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Button variant="contained" size="small" onClick={handleReset} data-testid="rc-reset-widths">
            Reset widths
          </Button>
          <Button variant="outlined" size="small">
            Export
          </Button>
          <Button variant="outlined" size="small">
            Density
          </Button>
        </Stack>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Default: ID 90px, Name 180px, Email 240px, Role 120px
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
      </CardContent>
      
      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
      >
        <Alert severity="success" onClose={() => setShowToast(false)}>
          Restored default column widths
        </Alert>
      </Snackbar>
    </Card>
  );
}
