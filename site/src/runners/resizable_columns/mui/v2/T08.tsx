'use client';

/**
 * Task ID: resizable_columns-mui-v2-T08
 * Task Name: Drawer audit history: off-screen Failure reason with apply
 *
 * Setup Description:
 * Layout uses drawer_flow with compact spacing and medium clutter. The page contains an audit card and a button labeled Audit columns. Clicking it opens a MUI right drawer with one wide DataGrid preview. The preview is narrower than the total column width and has a visible horizontal scrollbar.
 * The target header Failure reason begins off-screen to the right, after Status and before Recovery hint. A persistent monitor line inside the drawer reads `Failure reason width: ###px`. Failure reason starts at 224px. Width changes remain draft-only until Apply widths is pressed; Cancel discards them.
 *
 * Success Trigger: Failure reason width within ±4px of 288px and Apply widths clicked (committed layout).
 * require_confirm: true (Apply widths)
 *
 * Theme: light, Spacing: compact, Layout: drawer_flow, Placement: off_center
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Drawer,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

const summaryRows = [
  { id: 1, line: 'Job J-12 failed preflight', detail: 'See drawer for column tools' },
  { id: 2, line: 'Retry scheduled', detail: 'Operator notified' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [committed, setCommitted] = useState<Record<string, number>>({
    job: 100,
    status: 110,
    failureReason: 224,
    recoveryHint: 200,
    owner: 120,
  });
  const [draft, setDraft] = useState<Record<string, number>>(committed);
  const successFired = useRef(false);

  const openDrawer = () => {
    setDraft({ ...committed });
    setDrawerOpen(true);
  };

  const previewColumns: GridColDef[] = [
    { field: 'job', headerName: 'Job', width: draft.job, resizable: true },
    { field: 'status', headerName: 'Status', width: draft.status, resizable: true },
    { field: 'failureReason', headerName: 'Failure reason', width: draft.failureReason, resizable: true },
    { field: 'recoveryHint', headerName: 'Recovery hint', width: draft.recoveryHint, resizable: true },
    { field: 'owner', headerName: 'Owner', width: draft.owner, resizable: true },
  ];

  const failureW = draft.failureReason ?? 224;

  return (
    <Card sx={{ width: 520, maxWidth: '100%' }} variant="outlined" data-testid="rc-drawer-audit-columns">
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Audit history
        </Typography>
        <Stack spacing={0.75} sx={{ mb: 1.5 }}>
          {summaryRows.map((r) => (
            <Typography key={r.id} variant="body2" color="text.secondary">
              {r.line} — {r.detail}
            </Typography>
          ))}
        </Stack>
        <Button variant="contained" size="small" onClick={openDrawer} data-testid="rc-open-audit-columns">
          Audit columns
        </Button>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Committed Failure reason width: {committed.failureReason}px
        </Typography>
      </CardContent>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 440 } }}>
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Column widths
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} data-testid="rc-width-failure-reason">
            Failure reason width: {failureW}px
          </Typography>
          <Box sx={{ flex: 1, minHeight: 280, width: '100%' }}>
            <DataGrid
              density="compact"
              rows={[{ id: 1, job: 'J-12', status: 'Failed', failureReason: 'TLS handshake timeout', recoveryHint: 'Retry with TLS 1.2', owner: 'cron' }]}
              columns={previewColumns}
              disableRowSelectionOnClick
              hideFooter
              onColumnWidthChange={(params) => {
                setDraft((prev) => ({
                  ...prev,
                  [params.colDef.field]: params.width,
                }));
              }}
            />
          </Box>
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              onClick={() => {
                setDraft({ ...committed });
                setDrawerOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                const next = { ...draft };
                setCommitted(next);
                setDrawerOpen(false);
                if (!successFired.current && isWithinTolerance(next.failureReason, 288, 4)) {
                  successFired.current = true;
                  onSuccess();
                }
              }}
              data-testid="rc-apply-audit-widths"
            >
              Apply widths
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Card>
  );
}
