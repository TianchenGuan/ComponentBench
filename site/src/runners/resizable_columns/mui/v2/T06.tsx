'use client';

/**
 * Task ID: resizable_columns-mui-v2-T06
 * Task Name: Primary queue only: match SLA, Priority, and Owner to the ruler
 *
 * Setup Description:
 * Layout uses dashboard_panel with compact spacing and high clutter. Two same-width DataGrids sit in a queue dashboard card: Primary — Queue and Secondary — Escalations. A colored ruler strip is aligned only to the Primary grid, marking the target boundaries for SLA, Priority, and Owner.
 * Both grids share the same resize affordances and similar columns. No numeric widths are displayed on screen. The Primary grid starts close to, but not on, the ruler targets; the Secondary grid is fully resizable but irrelevant.
 *
 * Success Trigger: SLA 144px, Priority 112px, Owner 196px each within ±5px (matches reference mui_primary_queue_ruler_v2). Correct instance: Primary — Queue.
 * require_confirm: false
 *
 * Theme: light, Spacing: compact, Layout: dashboard_panel, Placement: top_right
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';
import { allWidthsMatch } from '../../types';

const RULER_SLA = 144;
const RULER_PRIORITY = 112;
const RULER_OWNER = 196;

const primaryRows = [
  { id: 1, ticket: 'Q-501', sla: 'P1', priority: 'High', owner: 'N. Rao', updated: '10:02' },
  { id: 2, ticket: 'Q-502', sla: 'P2', priority: 'Med', owner: 'L. Cho', updated: '09:55' },
];

const secondaryRows = [
  { id: 1, ticket: 'E-901', sla: 'P1', priority: 'High', owner: 'K. Wu', updated: '08:12' },
  { id: 2, ticket: 'E-902', sla: 'P3', priority: 'Low', owner: 'M. Ito', updated: '07:40' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [primaryWidths, setPrimaryWidths] = useState<Record<string, number>>({
    ticket: 96,
    sla: 135,
    priority: 105,
    owner: 188,
    updated: 120,
  });
  const [secondaryWidths, setSecondaryWidths] = useState<Record<string, number>>({
    ticket: 96,
    sla: 150,
    priority: 150,
    owner: 150,
    updated: 120,
  });
  const successFired = useRef(false);

  const ticketLead = primaryWidths.ticket ?? 96;
  const slaW = primaryWidths.sla ?? 135;
  const priorityW = primaryWidths.priority ?? 105;
  const ownerW = primaryWidths.owner ?? 188;

  useEffect(() => {
    const targets = { sla: RULER_SLA, priority: RULER_PRIORITY, owner: RULER_OWNER };
    const actual = { sla: slaW, priority: priorityW, owner: ownerW };
    if (!successFired.current && allWidthsMatch(actual, targets, 5)) {
      successFired.current = true;
      onSuccess();
    }
  }, [slaW, priorityW, ownerW, onSuccess]);

  const primaryColumns: GridColDef[] = [
    { field: 'ticket', headerName: 'Ticket', width: primaryWidths.ticket, resizable: true },
    { field: 'sla', headerName: 'SLA', width: primaryWidths.sla, resizable: true },
    { field: 'priority', headerName: 'Priority', width: primaryWidths.priority, resizable: true },
    { field: 'owner', headerName: 'Owner', width: primaryWidths.owner, resizable: true },
    { field: 'updated', headerName: 'Updated', width: primaryWidths.updated, resizable: true },
  ];

  const secondaryColumns: GridColDef[] = [
    { field: 'ticket', headerName: 'Ticket', width: secondaryWidths.ticket, resizable: true },
    { field: 'sla', headerName: 'SLA', width: secondaryWidths.sla, resizable: true },
    { field: 'priority', headerName: 'Priority', width: secondaryWidths.priority, resizable: true },
    { field: 'owner', headerName: 'Owner', width: secondaryWidths.owner, resizable: true },
    { field: 'updated', headerName: 'Updated', width: secondaryWidths.updated, resizable: true },
  ];

  return (
    <Card sx={{ width: 820, maxWidth: '100%' }} variant="outlined" data-testid="rc-dashboard-queue-ruler">
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="caption" color="text.secondary" textTransform="uppercase">
          Queue dashboard
        </Typography>

        <Box sx={{ mt: 1.5 }} data-testid="rc-grid-primary-queue">
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Primary — Queue
          </Typography>
          <Box
            sx={{
              display: 'flex',
              mb: 0.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
              width: '100%',
            }}
            data-testid="rc-reference-strip-mui-primary-queue-ruler-v2"
          >
            <Box
              sx={{
                width: ticketLead,
                flexShrink: 0,
                bgcolor: 'grey.100',
                borderRight: '1px solid',
                borderColor: 'divider',
              }}
            />
            <Box
              sx={{
                width: RULER_SLA,
                bgcolor: '#e3f2fd',
                py: 0.75,
                px: 1,
                borderRight: '1px solid',
                borderColor: 'primary.light',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              SLA
            </Box>
            <Box
              sx={{
                width: RULER_PRIORITY,
                bgcolor: '#e8f5e9',
                py: 0.75,
                px: 1,
                borderRight: '1px solid',
                borderColor: 'success.light',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Priority
            </Box>
            <Box
              sx={{
                width: RULER_OWNER,
                bgcolor: '#fff3e0',
                py: 0.75,
                px: 1,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Owner
            </Box>
          </Box>
          <Box sx={{ height: 220, width: '100%' }}>
            <DataGrid
              density="compact"
              rows={primaryRows}
              columns={primaryColumns}
              disableRowSelectionOnClick
              hideFooter
              onColumnWidthChange={(params) => {
                setPrimaryWidths((prev) => ({
                  ...prev,
                  [params.colDef.field]: params.width,
                }));
              }}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 2 }} data-testid="rc-grid-secondary-escalations">
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Secondary — Escalations
          </Typography>
          <Box sx={{ height: 220, width: '100%' }}>
            <DataGrid
              density="compact"
              rows={secondaryRows}
              columns={secondaryColumns}
              disableRowSelectionOnClick
              hideFooter
              onColumnWidthChange={(params) => {
                setSecondaryWidths((prev) => ({
                  ...prev,
                  [params.colDef.field]: params.width,
                }));
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
