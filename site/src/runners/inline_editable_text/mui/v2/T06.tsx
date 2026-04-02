'use client';

/**
 * inline_editable_text-mui-v2-T06: Two-line escalation note with confirm dialog
 *
 * "Escalation note" card with two inline editable rows: "Primary note" (Owner: ops)
 * and "Secondary note" (Owner: finance). Multiline TextField. Clicking Save opens
 * a confirmation dialog "Apply text change?" with Cancel and Confirm buttons.
 *
 * Success: "Primary note" committed value equals "Owner: support\nQueue: sev2-eu",
 * display mode, dialog closed, "Secondary note" remains "Owner: finance",
 * committed via Confirm.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, TextField, IconButton, Paper, Chip, Stack,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../../types';

interface RowState {
  label: string;
  value: string;
  editing: boolean;
  draft: string;
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowState[]>([
    { label: 'Primary note', value: 'Owner: ops', editing: false, draft: 'Owner: ops' },
    { label: 'Secondary note', value: 'Owner: finance', editing: false, draft: 'Owner: finance' },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingSaveIdx, setPendingSaveIdx] = useState<number | null>(null);
  const successFired = useRef(false);
  const inputRefs = useRef<(HTMLTextAreaElement | null)[]>([null, null]);

  const updateRow = useCallback((idx: number, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }, []);

  useEffect(() => {
    rows.forEach((r, i) => {
      if (r.editing) inputRefs.current[i]?.focus();
    });
  }, [rows]);

  useEffect(() => {
    if (successFired.current) return;
    const primary = rows.find((r) => r.label === 'Primary note');
    const secondary = rows.find((r) => r.label === 'Secondary note');
    if (
      !dialogOpen &&
      primary && !primary.editing && primary.value === 'Owner: support\nQueue: sev2-eu' &&
      secondary && secondary.value === 'Owner: finance'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, dialogOpen, onSuccess]);

  const handleSaveClick = (idx: number) => {
    setPendingSaveIdx(idx);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (pendingSaveIdx !== null) {
      const row = rows[pendingSaveIdx];
      updateRow(pendingSaveIdx, { value: row.draft, editing: false });
    }
    setDialogOpen(false);
    setPendingSaveIdx(null);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setPendingSaveIdx(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ maxWidth: 480, width: '100%' }}>
        {/* Surrounding clutter */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label="Status: open" color="warning" size="small" />
          <Chip label="Audit: pending" size="small" variant="outlined" />
        </Stack>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Escalation note</Typography>
          {rows.map((row, idx) => (
            <Box key={row.label} sx={{ py: 1.5 }} data-testid={`row-${row.label}`} data-mode={row.editing ? 'editing' : 'display'} data-value={row.value}>
              <Typography variant="caption" color="text.secondary">{row.label}</Typography>
              {row.editing ? (
                <Stack spacing={0.5}>
                  <TextField
                    inputRef={(el) => { inputRefs.current[idx] = el; }}
                    value={row.draft}
                    onChange={(e) => updateRow(idx, { draft: e.target.value })}
                    size="small"
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={4}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') updateRow(idx, { editing: false, draft: row.value });
                    }}
                  />
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={() => handleSaveClick(idx)} aria-label="Save" data-testid={`save-${row.label}`}>
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => updateRow(idx, { editing: false, draft: row.value })} aria-label="Cancel">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              ) : (
                <Box
                  sx={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, borderRadius: 1, py: 0.5, px: 1, ml: -1 }}
                  onClick={() => updateRow(idx, { editing: true, draft: row.value })}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line', flex: 1 }}>{row.value}</Typography>
                  <IconButton size="small" sx={{ ml: 1 }}><EditIcon fontSize="small" /></IconButton>
                </Box>
              )}
            </Box>
          ))}
        </Paper>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Last updated 3 minutes ago · Audit log #4821
        </Typography>
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogCancel} data-testid="confirm-dialog">
        <DialogTitle>Apply text change?</DialogTitle>
        <DialogContent>
          <DialogContentText>This will update the escalation note permanently.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" data-testid="confirm-button">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
