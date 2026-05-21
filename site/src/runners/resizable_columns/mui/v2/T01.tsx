'use client';

/**
 * Task ID: resizable_columns-mui-v2-T01
 * Task Name: DataGrid header fight: resize Status without opening menus
 *
 * Setup Description:
 * Layout uses settings_panel with compact spacing and high clutter. A left settings rail, quick filters, and summary chips surround the main MUI X DataGrid. The grid columns are Ticket, Owner, Status, SLA, and Updated.
 * Status has all normal header affordances enabled: sort arrow, menu trigger, and the draggable right-edge resize separator. The separator is visible on hover and the grid shows `Status width: ###px` in a persistent monitor below the header. Status starts at 112px.
 *
 * Success Trigger: Status width is within ±4px of 148px.
 * require_confirm: false
 *
 * Theme: light, Spacing: compact, Layout: settings_panel, Placement: top_left
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

const rows = [
  { id: 1, ticket: 'TKT-1042', owner: 'A. Chen', status: 'Open', sla: '4h', updated: '10:12' },
  { id: 2, ticket: 'TKT-1043', owner: 'B. Ortiz', status: 'Pending', sla: '1d', updated: '09:40' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    ticket: 120,
    owner: 140,
    status: 112,
    sla: 96,
    updated: 110,
  });
  const successFired = useRef(false);

  const statusWidth = columnWidths.status ?? 112;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(statusWidth, 148, 4)) {
      successFired.current = true;
      onSuccess();
    }
  }, [statusWidth, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'ticket', headerName: 'Ticket', width: columnWidths.ticket, resizable: true },
    { field: 'owner', headerName: 'Owner', width: columnWidths.owner, resizable: true },
    { field: 'status', headerName: 'Status', width: columnWidths.status, resizable: true, sortable: true },
    { field: 'sla', headerName: 'SLA', width: columnWidths.sla, resizable: true },
    { field: 'updated', headerName: 'Updated', width: columnWidths.updated, resizable: true },
  ];

  return (
    <Box sx={{ display: 'flex', width: 920, maxWidth: '100%' }} data-testid="rc-settings-panel-ticket-queue">
      <Paper sx={{ width: 200, mr: 1.5, flexShrink: 0 }} variant="outlined">
        <List dense disablePadding>
          {['Routing', 'Queues', 'SLA policies', 'Webhooks', 'Audit'].map((label) => (
            <ListItemButton key={label} dense>
              <ListItemText primary={label} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      <Card sx={{ flex: 1, minWidth: 0 }} variant="outlined" data-testid="rc-datagrid-ticket-queue">
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Ticket queue
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }} alignItems="center">
            <TextField size="small" placeholder="Quick filter…" sx={{ width: 160 }} />
            <Chip size="small" label="Team: Core" variant="outlined" />
            <Chip size="small" label="P1: 3" color="warning" variant="outlined" />
            <Chip size="small" label="Stale: 7" variant="outlined" />
          </Stack>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }} data-testid="rc-width-status">
            Status width: {statusWidth}px
          </Typography>
          <Box sx={{ height: 240, width: '100%' }}>
            <DataGrid
              density="compact"
              rows={rows}
              columns={columns}
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
