'use client';

/**
 * Task ID: resizable_columns-mui-v2-T05
 * Task Name: Customize-columns modal: resize Description and save the draft
 *
 * Setup Description:
 * Layout uses modal_flow with compact spacing and medium clutter. The page shows an audit table and a button labeled Customize columns. Clicking it opens a centered MUI Dialog with one DataGrid preview. Description is resizable; ID is explicitly not resizable and sits directly beside it, so the correct affordance is only on the Description edge.
 * The dialog shows a draft width monitor `Description width: ###px` and an Unsaved chip while the preview differs from the committed layout. Description starts at 278px. The footer buttons are Cancel and Save.
 *
 * Success Trigger: Description width is within ±5px of 318px and the required Save control has been clicked (committed layout).
 * require_confirm: true (Save)
 *
 * Theme: light, Spacing: compact, Layout: modal_flow, Placement: center
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

const auditRows = [
  { id: 1, action: 'Role changed', actor: 'admin@co', when: '09:12' },
  { id: 2, action: 'Export run', actor: 'cron', when: '08:40' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [committed, setCommitted] = useState({ id: 72, description: 278 });
  const [draft, setDraft] = useState({ id: 72, description: 278 });
  const successFired = useRef(false);

  const dirty = draft.description !== committed.description;

  const openDialog = () => {
    setDraft({ ...committed });
    setOpen(true);
  };

  const previewColumns: GridColDef[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: draft.id, resizable: false },
      { field: 'description', headerName: 'Description', width: draft.description, resizable: true },
    ],
    [draft.id, draft.description]
  );

  return (
    <Card sx={{ width: 560, maxWidth: '100%' }} variant="outlined" data-testid="rc-modal-customize-columns">
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Audit trail
        </Typography>
        <Box sx={{ height: 180, width: '100%', mb: 1.5 }}>
          <DataGrid
            density="compact"
            rows={auditRows}
            columns={[
              { field: 'action', headerName: 'Action', flex: 1, minWidth: 120 },
              { field: 'actor', headerName: 'Actor', width: 140 },
              { field: 'when', headerName: 'When', width: 90 },
            ]}
            disableRowSelectionOnClick
            hideFooter
          />
        </Box>
        <Button variant="contained" size="small" onClick={openDialog} data-testid="rc-open-customize-columns">
          Customize columns
        </Button>

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
          Committed Description width: {committed.description}px
        </Typography>
      </CardContent>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Customize columns</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" data-testid="rc-width-description-draft">
              Description width: {draft.description}px
            </Typography>
            {dirty && <Chip size="small" label="Unsaved" color="warning" variant="outlined" />}
          </Stack>
          <Box sx={{ height: 260, width: '100%' }}>
            <DataGrid
              density="compact"
              rows={[{ id: 1, description: 'Preview column layout for exports and viewers.' }]}
              columns={previewColumns}
              disableRowSelectionOnClick
              hideFooter
              onColumnWidthChange={(params) => {
                if (params.colDef.field === 'description') {
                  setDraft((d) => ({ ...d, description: params.width }));
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDraft({ ...committed });
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const next = { ...draft };
              setCommitted(next);
              setOpen(false);
              if (!successFired.current && isWithinTolerance(next.description, 318, 5)) {
                successFired.current = true;
                onSuccess();
              }
            }}
            data-testid="rc-save-customize-columns"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
