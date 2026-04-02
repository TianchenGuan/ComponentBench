'use client';

/**
 * inline_editable_text-mui-v2-T01: Fallback alias in right drawer with end-adornment save
 *
 * A right-anchored MUI Drawer titled "Aliases" contains three inline editable rows:
 * "Primary alias" (Router Core), "Fallback alias" (Router Backup), and "Billing alias"
 * (Billing North). Each row shows Typography + pencil IconButton; editing swaps into
 * a TextField whose end adornment has Save (check) and Cancel (close) IconButtons.
 *
 * Success: "Fallback alias" committed value equals "Router East", component in display
 * mode, other rows unchanged, committed via Save check icon.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, TextField, IconButton, InputAdornment,
  Drawer, Button, Paper, Chip, Stack, Divider,
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

function InlineEditRow({
  row,
  onEdit,
  onSave,
  onCancel,
  onDraftChange,
}: {
  row: RowState;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDraftChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (row.editing) inputRef.current?.focus();
  }, [row.editing]);

  return (
    <Box sx={{ py: 1 }} data-testid={`row-${row.label}`} data-mode={row.editing ? 'editing' : 'display'} data-value={row.value}>
      <Typography variant="caption" color="text.secondary">{row.label}</Typography>
      {row.editing ? (
        <TextField
          inputRef={inputRef}
          value={row.draft}
          onChange={(e) => onDraftChange(e.target.value)}
          size="small"
          fullWidth
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={onSave} aria-label="Save" data-testid={`save-${row.label}`}>
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={onCancel} aria-label="Cancel">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, borderRadius: 1, py: 0.5, px: 1, ml: -1 }}
          onClick={onEdit}
        >
          <Typography variant="body2">{row.value}</Typography>
          <IconButton size="small" sx={{ ml: 'auto' }} aria-label={`Edit ${row.label}`}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState<RowState[]>([
    { label: 'Primary alias', value: 'Router Core', editing: false, draft: 'Router Core' },
    { label: 'Fallback alias', value: 'Router Backup', editing: false, draft: 'Router Backup' },
    { label: 'Billing alias', value: 'Billing North', editing: false, draft: 'Billing North' },
  ]);
  const successFired = useRef(false);

  const updateRow = useCallback((idx: number, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const fallback = rows.find((r) => r.label === 'Fallback alias');
    const primary = rows.find((r) => r.label === 'Primary alias');
    const billing = rows.find((r) => r.label === 'Billing alias');
    if (
      fallback && !fallback.editing && fallback.value === 'Router East' &&
      primary && primary.value === 'Router Core' &&
      billing && billing.value === 'Billing North'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      {/* Background dashboard clutter */}
      <Stack spacing={2} sx={{ maxWidth: 600, mx: 'auto' }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Dashboard</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip label="Active" color="success" size="small" />
            <Chip label="3 alerts" color="warning" size="small" />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Recent activity: 2 deployments today</Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">Profile</Typography>
          <Typography variant="body2" color="text.secondary">Team: Infrastructure · Role: Admin</Typography>
        </Paper>
        <Button variant="outlined" onClick={() => setDrawerOpen(true)} data-testid="open-drawer">
          Open Aliases
        </Button>
      </Stack>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 360, p: 3 } }}>
        <Typography variant="h6" gutterBottom>Aliases</Typography>
        <Divider sx={{ mb: 2 }} />
        {rows.map((row, idx) => (
          <InlineEditRow
            key={row.label}
            row={row}
            onEdit={() => updateRow(idx, { editing: true, draft: row.value })}
            onSave={() => updateRow(idx, { value: row.draft, editing: false })}
            onCancel={() => updateRow(idx, { editing: false, draft: row.value })}
            onDraftChange={(v) => updateRow(idx, { draft: v })}
          />
        ))}
      </Drawer>
    </Box>
  );
}
