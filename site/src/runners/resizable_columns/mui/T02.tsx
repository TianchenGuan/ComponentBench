'use client';

/**
 * Task ID: resizable_columns-mui-T02
 * Task Name: Resize Age column into 80–100px range
 *
 * Setup Description:
 * Layout: isolated_card, centered.
 * One MUI X DataGrid:
 * - Headers: ID, Full name, Age, City.
 * - A small text readout under the grid shows "Age width: ###px".
 *
 * Initial state: Age starts at 140px (too wide). Min 60px, max 200px.
 *
 * Success Trigger: Age column width is between 80px and 100px (inclusive).
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../types';
import { isInRange } from '../types';

const rows = [
  { id: 1, fullName: 'John Doe', age: 32, city: 'New York' },
  { id: 2, fullName: 'Jane Smith', age: 28, city: 'Los Angeles' },
  { id: 3, fullName: 'Bob Wilson', age: 45, city: 'Chicago' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    id: 80,
    fullName: 180,
    age: 140,
    city: 150,
  });
  const successFired = useRef(false);

  const ageWidth = columnWidths.age ?? 140;

  useEffect(() => {
    if (!successFired.current && isInRange(ageWidth, 80, 100)) {
      successFired.current = true;
      onSuccess();
    }
  }, [ageWidth, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: columnWidths.id, resizable: true },
    { field: 'fullName', headerName: 'Full name', width: columnWidths.fullName, resizable: true },
    { field: 'age', headerName: 'Age', width: columnWidths.age, minWidth: 60, maxWidth: 200, resizable: true },
    { field: 'city', headerName: 'City', width: columnWidths.city, resizable: true },
  ];

  return (
    <Card sx={{ width: 650 }} data-testid="rc-datagrid-container">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          People
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
          data-testid="rc-width-age"
        >
          Age width: {ageWidth}px
        </Typography>
      </CardContent>
    </Card>
  );
}
