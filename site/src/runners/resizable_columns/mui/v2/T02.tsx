'use client';

/**
 * Task ID: resizable_columns-mui-v2-T02
 * Task Name: Flex clamp: expand Owner to its 210 px maximum
 *
 * Setup Description:
 * Layout uses inline_surface with compact spacing and medium clutter. The triage grid sits beneath a compact toolbar inside a product-admin surface. The grid mixes fixed-width and flex columns, and Owner specifically has minWidth=160 and maxWidth=210.
 * As the Owner separator is dragged, neighboring flex columns reflow and a monitor line below the grid reads `Owner width: ###px (max 210px)`. Owner starts at 176px. The drag should stop at the hard cap; no confirmation button is required.
 *
 * Success Trigger: Owner width is within ±0px of 210px (exactly 210px).
 * require_confirm: false
 *
 * Theme: light, Spacing: compact, Layout: inline_surface, Placement: off_center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';

const rows = [
  { id: 1, ticket: 'TRG-221', owner: 'N. Patel', priority: 'P2', sla: '6h', updated: 'Mon' },
  { id: 2, ticket: 'TRG-222', owner: 'K. Ng', priority: 'P3', sla: '2d', updated: 'Mon' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    ticket: 100,
    owner: 176,
  });
  const successFired = useRef(false);

  const ownerWidth = columnWidths.owner ?? 176;

  useEffect(() => {
    if (!successFired.current && ownerWidth === 210) {
      successFired.current = true;
      onSuccess();
    }
  }, [ownerWidth, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'ticket', headerName: 'Ticket', width: columnWidths.ticket, resizable: true },
    {
      field: 'owner',
      headerName: 'Owner',
      width: columnWidths.owner,
      minWidth: 160,
      maxWidth: 210,
      resizable: true,
    },
    { field: 'priority', headerName: 'Priority', flex: 1, minWidth: 88, resizable: true },
    { field: 'sla', headerName: 'SLA', flex: 1, minWidth: 72, resizable: true },
    { field: 'updated', headerName: 'Updated', flex: 1, minWidth: 80, resizable: true },
  ];

  return (
    <Card sx={{ width: 720, maxWidth: '100%' }} variant="outlined" data-testid="rc-inline-triage-grid">
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.6}>
          Product admin
        </Typography>
        <Stack direction="row" spacing={1} sx={{ my: 1 }} flexWrap="wrap" useFlexGap alignItems="center">
          <TextField size="small" placeholder="Search triage…" sx={{ flex: 1, minWidth: 160 }} />
          <Button size="small" variant="outlined">
            Export
          </Button>
          <Button size="small" variant="contained" disableElevation>
            Assign
          </Button>
        </Stack>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Triage
        </Typography>
        <Box sx={{ height: 220, width: '100%' }}>
          <DataGrid
            density="compact"
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter
            onColumnWidthChange={(params) => {
              if (params.colDef.field === 'ticket' || params.colDef.field === 'owner') {
                setColumnWidths((prev) => ({
                  ...prev,
                  [params.colDef.field]: params.width,
                }));
              }
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} data-testid="rc-width-owner">
          Owner width: {ownerWidth}px (max 210px)
        </Typography>
      </CardContent>
    </Card>
  );
}
