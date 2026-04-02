'use client';

/**
 * inline_editable_text-mui-v2-T07: High-contrast owner label in compact ops strip
 *
 * High-contrast theme with compact horizontal "Ops strip" near bottom-left.
 * Three inline editable rows: "Owner label" (OPS / US-1), "Queue label" (Q / sev2),
 * "Pager label" (pager-main). Each row: Typography + tiny pencil → narrow TextField
 * with end-adornment Save/Cancel icons. Nearby chips and icon buttons add clutter.
 *
 * Success: "Owner label" committed value equals "OPS / EMEA-2", display mode,
 * other rows unchanged, committed via Save.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, TextField, IconButton, InputAdornment,
  Paper, Chip, Stack,
  createTheme, ThemeProvider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { TaskComponentProps } from '../../types';

const highContrastTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#000', paper: '#1a1a1a' },
    text: { primary: '#fff', secondary: '#ccc' },
    primary: { main: '#ffeb3b' },
  },
});

interface RowState {
  label: string;
  value: string;
  editing: boolean;
  draft: string;
}

function DenseEditRow({
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
    <Box sx={{ py: 0.5 }} data-testid={`row-${row.label}`} data-mode={row.editing ? 'editing' : 'display'} data-value={row.value}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>{row.label}</Typography>
      {row.editing ? (
        <TextField
          inputRef={inputRef}
          value={row.draft}
          onChange={(e) => onDraftChange(e.target.value)}
          size="small"
          variant="outlined"
          sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={onSave} aria-label="Save" data-testid={`save-${row.label}`} sx={{ p: 0.25 }}>
                  <CheckIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <IconButton size="small" onClick={onCancel} aria-label="Cancel" sx={{ p: 0.25 }}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }, borderRadius: 0.5, py: 0.25, px: 0.5 }}
          onClick={onEdit}
        >
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.value}</Typography>
          <IconButton size="small" sx={{ ml: 'auto', p: 0.25 }}><EditIcon sx={{ fontSize: 14 }} /></IconButton>
        </Box>
      )}
    </Box>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowState[]>([
    { label: 'Owner label', value: 'OPS / US-1', editing: false, draft: 'OPS / US-1' },
    { label: 'Queue label', value: 'Q / sev2', editing: false, draft: 'Q / sev2' },
    { label: 'Pager label', value: 'pager-main', editing: false, draft: 'pager-main' },
  ]);
  const successFired = useRef(false);

  const updateRow = useCallback((idx: number, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const owner = rows.find((r) => r.label === 'Owner label');
    const queue = rows.find((r) => r.label === 'Queue label');
    const pager = rows.find((r) => r.label === 'Pager label');
    if (
      owner && !owner.editing && owner.value === 'OPS / EMEA-2' &&
      queue && queue.value === 'Q / sev2' &&
      pager && pager.value === 'pager-main'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  return (
    <ThemeProvider theme={highContrastTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 2, display: 'flex', alignItems: 'flex-end' }}>
        <Box sx={{ maxWidth: 340 }}>
          {/* Clutter: icon buttons and chips */}
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip label="sev2" size="small" color="primary" />
            <Chip label="APAC" size="small" variant="outlined" />
            <IconButton size="small"><NotificationsIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
            <IconButton size="small"><RefreshIcon sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
          </Stack>

          <Paper sx={{ p: 1.5 }} data-testid="ops-strip">
            <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>Ops strip</Typography>
            {rows.map((row, idx) => (
              <DenseEditRow
                key={row.label}
                row={row}
                onEdit={() => updateRow(idx, { editing: true, draft: row.value })}
                onSave={() => updateRow(idx, { value: row.draft, editing: false })}
                onCancel={() => updateRow(idx, { editing: false, draft: row.value })}
                onDraftChange={(v) => updateRow(idx, { draft: v })}
              />
            ))}
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
