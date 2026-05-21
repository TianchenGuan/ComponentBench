'use client';

/**
 * inline_editable_text-mui-v2-T03: Service slug with helper-text validation among three rows
 *
 * Dark settings panel ("Routing labels") near bottom-right with three inline editable rows:
 * "Region tag" (apac), "Service slug" (svc-payments-01), "Escalation tag" (sev2).
 * Each row: Typography + pencil IconButton → TextField with helper text
 * "lowercase letters, digits, and hyphens only" + Save/Cancel IconButtons.
 * Save is disabled when input contains invalid characters.
 *
 * Success: "Service slug" committed value equals "svc-payments-02", display mode,
 * other rows unchanged, committed via Save.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, TextField, IconButton, Paper, Chip, Switch,
  FormControlLabel, Select, MenuItem, Stack, Divider,
  createTheme, ThemeProvider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const SLUG_RE = /^[a-z0-9-]*$/;

interface RowState {
  label: string;
  value: string;
  editing: boolean;
  draft: string;
}

function ValidatedEditRow({
  row, onEdit, onSave, onCancel, onDraftChange,
}: {
  row: RowState;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDraftChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isValid = SLUG_RE.test(row.draft);

  useEffect(() => {
    if (row.editing) inputRef.current?.focus();
  }, [row.editing]);

  return (
    <Box sx={{ py: 1 }} data-testid={`row-${row.label}`} data-mode={row.editing ? 'editing' : 'display'} data-value={row.value}>
      <Typography variant="caption" color="text.secondary">{row.label}</Typography>
      {row.editing ? (
        <Stack direction="row" spacing={0.5} alignItems="flex-start">
          <TextField
            inputRef={inputRef}
            value={row.draft}
            onChange={(e) => onDraftChange(e.target.value)}
            size="small"
            fullWidth
            error={!isValid}
            helperText="lowercase letters, digits, and hyphens only"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isValid) onSave();
              if (e.key === 'Escape') onCancel();
            }}
          />
          <IconButton size="small" onClick={onSave} disabled={!isValid} aria-label="Save" data-testid={`save-${row.label}`}>
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

export default function T03({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowState[]>([
    { label: 'Region tag', value: 'apac', editing: false, draft: 'apac' },
    { label: 'Service slug', value: 'svc-payments-01', editing: false, draft: 'svc-payments-01' },
    { label: 'Escalation tag', value: 'sev2', editing: false, draft: 'sev2' },
  ]);
  const successFired = useRef(false);

  const updateRow = useCallback((idx: number, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const slug = rows.find((r) => r.label === 'Service slug');
    const region = rows.find((r) => r.label === 'Region tag');
    const esc = rows.find((r) => r.label === 'Escalation tag');
    if (
      slug && !slug.editing && slug.value === 'svc-payments-02' &&
      region && region.value === 'apac' &&
      esc && esc.value === 'sev2'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <Paper sx={{ p: 2, width: 380 }}>
          {/* Clutter: toggles and status */}
          <Stack spacing={1} sx={{ mb: 2 }}>
            <FormControlLabel control={<Switch defaultChecked size="small" />} label={<Typography variant="body2">Auto-route</Typography>} />
            <Stack direction="row" spacing={1}>
              <Chip label="Healthy" color="success" size="small" />
              <Chip label="Region: APAC" size="small" />
            </Stack>
            <Select size="small" value="default" sx={{ width: 160 }}>
              <MenuItem value="default">Default pipeline</MenuItem>
              <MenuItem value="fast">Fast pipeline</MenuItem>
            </Select>
          </Stack>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Routing labels</Typography>
          {rows.map((row, idx) => (
            <ValidatedEditRow
              key={row.label}
              row={row}
              onEdit={() => updateRow(idx, { editing: true, draft: row.value })}
              onSave={() => updateRow(idx, { value: row.draft, editing: false })}
              onCancel={() => updateRow(idx, { editing: false, draft: row.value })}
              onDraftChange={(v) => updateRow(idx, { draft: v })}
            />
          ))}
          <Divider sx={{ mt: 1, mb: 1 }} />
          <Chip label="Status: nominal" size="small" variant="outlined" />
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
