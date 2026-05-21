'use client';

/**
 * Task ID: resizable_columns-mui-v2-T04
 * Task Name: Two grids, autosized starts: resize Description in Tickets only
 *
 * Setup Description:
 * Layout uses dashboard_panel with compact spacing and medium clutter. Two MUI DataGrids are stacked in the same card: the upper grid is labeled Customers and the lower grid is labeled Tickets. Both have resizable separators and similar header density.
 * Both grids begin from autosized initial widths rather than uniform widths, so Description does not start at a round number. In the Tickets grid, Description starts at 226px and a local monitor reads `Description width: ###px`. The Customers grid has its own description-like free-text column but is a distractor.
 *
 * Success Trigger: Description width is between 260px and 272px inclusive. Correct instance: Tickets.
 * require_confirm: false
 *
 * Theme: light, Spacing: compact, Layout: dashboard_panel, Placement: off_center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';
import { isInRange } from '../../types';

const customersRows = [
  { id: 1, customer: 'Orbit LLC', email: 'ops@orbit.example', segment: 'Enterprise', summary: 'Multi-region rollout Q3' },
  { id: 2, customer: 'Lumen Co', email: 'hello@lumen.example', segment: 'Mid-market', summary: 'Pilot ending soon' },
];

const ticketsRows = [
  { id: 1, ticket: 'INC-8821', owner: 'S. Ali', description: 'Latency spikes on checkout', notes: 'Repro on staging', updated: '14:02' },
  { id: 2, ticket: 'INC-8822', owner: 'J. Park', description: 'Webhook retries failing', notes: 'Vendor ticket open', updated: '13:18' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [customersWidths, setCustomersWidths] = useState<Record<string, number>>({
    customer: 143,
    email: 187,
    segment: 109,
    summary: 205,
  });
  const [ticketsWidths, setTicketsWidths] = useState<Record<string, number>>({
    ticket: 97,
    owner: 124,
    description: 226,
    notes: 116,
    updated: 102,
  });
  const successFired = useRef(false);

  const descriptionWidth = ticketsWidths.description ?? 226;

  useEffect(() => {
    if (!successFired.current && isInRange(descriptionWidth, 260, 272)) {
      successFired.current = true;
      onSuccess();
    }
  }, [descriptionWidth, onSuccess]);

  const customersColumns: GridColDef[] = [
    { field: 'customer', headerName: 'Customer', width: customersWidths.customer, resizable: true },
    { field: 'email', headerName: 'Email', width: customersWidths.email, resizable: true },
    { field: 'segment', headerName: 'Segment', width: customersWidths.segment, resizable: true },
    { field: 'summary', headerName: 'Summary', width: customersWidths.summary, resizable: true },
  ];

  const ticketsColumns: GridColDef[] = [
    { field: 'ticket', headerName: 'Ticket', width: ticketsWidths.ticket, resizable: true },
    { field: 'owner', headerName: 'Owner', width: ticketsWidths.owner, resizable: true },
    { field: 'description', headerName: 'Description', width: ticketsWidths.description, resizable: true },
    { field: 'notes', headerName: 'Notes', width: ticketsWidths.notes, resizable: true },
    { field: 'updated', headerName: 'Updated', width: ticketsWidths.updated, resizable: true },
  ];

  return (
    <Card sx={{ width: 760, maxWidth: '100%' }} variant="outlined" data-testid="rc-dashboard-dual-grids">
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="caption" color="text.secondary" textTransform="uppercase">
          Dashboard
        </Typography>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box data-testid="rc-grid-customers">
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Customers
            </Typography>
            <Box sx={{ height: 200, width: '100%' }}>
              <DataGrid
                density="compact"
                rows={customersRows}
                columns={customersColumns}
                disableRowSelectionOnClick
                hideFooter
                onColumnWidthChange={(params) => {
                  setCustomersWidths((prev) => ({
                    ...prev,
                    [params.colDef.field]: params.width,
                  }));
                }}
              />
            </Box>
          </Box>

          <Box data-testid="rc-grid-tickets">
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Tickets
            </Typography>
            <Box sx={{ height: 200, width: '100%' }}>
              <DataGrid
                density="compact"
                rows={ticketsRows}
                columns={ticketsColumns}
                disableRowSelectionOnClick
                hideFooter
                onColumnWidthChange={(params) => {
                  setTicketsWidths((prev) => ({
                    ...prev,
                    [params.colDef.field]: params.width,
                  }));
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} data-testid="rc-width-description">
              Description width: {descriptionWidth}px
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
