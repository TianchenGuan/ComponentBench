'use client';

/**
 * inline_editable_text-mui-v2-T08: Customer badge exact match inside left drawer
 *
 * A left-anchored MUI Drawer opened by an "Edit badge" button. Inside the drawer:
 * a reference badge showing "ON-CALL / APAC", two inline editable rows
 * "Display badge" (PENDING) and "Internal badge" (staff-only), and a drawer-level
 * "Apply badge" button.
 *
 * Success: "Display badge" committed value equals "ON-CALL / APAC", display mode,
 * "Internal badge" remains "staff-only", committed via "Apply badge".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, TextField, IconButton, Paper, Button, Chip,
  Drawer, Stack, Divider,
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
  row, onEdit, onSave, onCancel, onDraftChange,
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
        <Stack direction="row" spacing={0.5} alignItems="center">
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
          />
          <IconButton size="small" onClick={onSave} aria-label="Save">
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onCancel} aria-label="Cancel">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      ) : (
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, borderRadius: 1, py: 0.5, px: 1, ml: -1 }}
          onClick={onEdit}
        >
          <Typography variant="body2">{row.value}</Typography>
          <IconButton size="small" sx={{ ml: 'auto' }}><EditIcon fontSize="small" /></IconButton>
        </Box>
      )}
    </Box>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState<RowState[]>([
    { label: 'Display badge', value: 'PENDING', editing: false, draft: 'PENDING' },
    { label: 'Internal badge', value: 'staff-only', editing: false, draft: 'staff-only' },
  ]);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  const updateRow = useCallback((idx: number, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }, []);

  const handleApply = useCallback(() => {
    setRows((prev) => prev.map((r) => ({ ...r, editing: false, value: r.editing ? r.draft : r.value })));
    setApplied(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !applied) return;
    const display = rows.find((r) => r.label === 'Display badge');
    const internal = rows.find((r) => r.label === 'Internal badge');
    if (
      display && !display.editing && display.value === 'ON-CALL / APAC' &&
      internal && internal.value === 'staff-only'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, applied, onSuccess]);

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      <Stack spacing={2} sx={{ maxWidth: 500, mx: 'auto' }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Customer management</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Manage customer badges, tiers, and preferences.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip label="Tier: Gold" size="small" color="warning" />
            <Chip label="Active" size="small" color="success" />
          </Stack>
        </Paper>
        <Button variant="outlined" onClick={() => setDrawerOpen(true)} data-testid="open-drawer">
          Edit badge
        </Button>
      </Stack>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 360, p: 3 } }}>
        <Typography variant="h6" gutterBottom>Customer badge</Typography>

        {/* Reference badge */}
        <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: '#e8f5e9', borderColor: '#43a047' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Reference badge
          </Typography>
          <Chip
            label="ON-CALL / APAC"
            sx={{ fontWeight: 700, color: '#1b5e20', bgcolor: '#a5d6a7', fontSize: '0.85rem' }}
            data-testid="reference-badge"
          />
        </Paper>

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

        <Divider sx={{ my: 2 }} />
        <Button variant="contained" onClick={handleApply} fullWidth data-testid="apply-badge">
          Apply badge
        </Button>
      </Drawer>
    </Box>
  );
}
