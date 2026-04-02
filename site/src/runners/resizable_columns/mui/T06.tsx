'use client';

/**
 * Task ID: resizable_columns-mui-T06
 * Task Name: Match DataGrid column widths to visual header strip
 *
 * Setup Description:
 * Layout: isolated_card, centered.
 * One MUI DataGrid with a visual reference strip directly above the header row:
 * - The strip shows labeled segments: "Name", "Email", "Role".
 * - No numeric pixel targets shown; widths inferred from visual alignment.
 *
 * DataGrid headers: Name, Email, Role, Last login.
 * Initial state: Name/Email/Role widths close but not aligned.
 *
 * Target widths: Name 180px, Email 260px, Role 120px.
 *
 * Success Trigger: Name ±6px of 180px, Email ±6px of 260px, Role ±6px of 120px.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

const rows = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', lastLogin: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', lastLogin: '2024-01-14' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', lastLogin: '2024-01-13' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    name: 160,
    email: 240,
    role: 100,
    lastLogin: 130,
  });
  const successFired = useRef(false);

  const nameWidth = columnWidths.name ?? 160;
  const emailWidth = columnWidths.email ?? 240;
  const roleWidth = columnWidths.role ?? 100;

  useEffect(() => {
    const nameOk = isWithinTolerance(nameWidth, 180, 6);
    const emailOk = isWithinTolerance(emailWidth, 260, 6);
    const roleOk = isWithinTolerance(roleWidth, 120, 6);
    
    if (!successFired.current && nameOk && emailOk && roleOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [nameWidth, emailWidth, roleWidth, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: columnWidths.name, resizable: true },
    { field: 'email', headerName: 'Email', width: columnWidths.email, resizable: true },
    { field: 'role', headerName: 'Role', width: columnWidths.role, resizable: true },
    { field: 'lastLogin', headerName: 'Last login', width: columnWidths.lastLogin, resizable: true },
  ];

  return (
    <Card sx={{ width: 750 }} data-testid="rc-datagrid-container">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Team Members
        </Typography>
        
        {/* Visual reference strip */}
        <Box
          sx={{ display: 'flex', mb: 1, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}
          data-testid="rc-reference-strip"
        >
          <Box sx={{ width: 180, bgcolor: '#e3f2fd', p: 1, borderRight: '1px solid #90caf9' }}>
            Name
          </Box>
          <Box sx={{ width: 260, bgcolor: '#e8f5e9', p: 1, borderRight: '1px solid #a5d6a7' }}>
            Email
          </Box>
          <Box sx={{ width: 120, bgcolor: '#fff3e0', p: 1 }}>
            Role
          </Box>
        </Box>

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
    </Card>
  );
}
