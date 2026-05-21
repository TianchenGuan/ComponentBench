'use client';

/**
 * inline_editable_text-mui-v2-T05: Footer disclaimer offscreen inside nested scroll
 *
 * Nested scroll layout: outer page scrolls, inner "Brand copy" panel scrolls independently.
 * Four inline editable rows with read-only notes between them: "Hero line" (Fast setup),
 * "Sidebar note" (Internal only), "Footer disclaimer" (Hours may change),
 * "Legal footer" (© 2026 Company). Footer disclaimer starts below the fold.
 *
 * Success: "Footer disclaimer" committed value equals "Support hours vary by region.",
 * display mode, committed via Save, all other rows unchanged.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, TextField, IconButton, Paper, Chip, Stack,
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
    <Box sx={{ py: 1.5 }} data-testid={`row-${row.label}`} data-mode={row.editing ? 'editing' : 'display'} data-value={row.value}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{row.label}</Typography>
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
          <IconButton size="small" onClick={onSave} aria-label="Save" data-testid={`save-${row.label}`}>
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

const NOTES = [
  'This line appears on the landing page hero section.',
  'Sidebar copy is used in the navigation panel.',
  'Footer disclaimers are shown across all pages below the fold.',
  'Legal text is required by compliance and cannot be omitted.',
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowState[]>([
    { label: 'Hero line', value: 'Fast setup', editing: false, draft: 'Fast setup' },
    { label: 'Sidebar note', value: 'Internal only', editing: false, draft: 'Internal only' },
    { label: 'Footer disclaimer', value: 'Hours may change', editing: false, draft: 'Hours may change' },
    { label: 'Legal footer', value: '© 2026 Company', editing: false, draft: '© 2026 Company' },
  ]);
  const successFired = useRef(false);

  const updateRow = useCallback((idx: number, patch: Partial<RowState>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const footer = rows.find((r) => r.label === 'Footer disclaimer');
    const hero = rows.find((r) => r.label === 'Hero line');
    const sidebar = rows.find((r) => r.label === 'Sidebar note');
    const legal = rows.find((r) => r.label === 'Legal footer');
    if (
      footer && !footer.editing && footer.value === 'Support hours vary by region.' &&
      hero && hero.value === 'Fast setup' &&
      sidebar && sidebar.value === 'Internal only' &&
      legal && legal.value === '© 2026 Company'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      {/* Outer scroll: nav chips and filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip label="Brand" color="primary" size="small" />
        <Chip label="Assets" variant="outlined" size="small" />
        <Chip label="Compliance" variant="outlined" size="small" />
      </Stack>

      <Paper
        sx={{
          maxWidth: 480,
          mx: 'auto',
          height: 340,
          overflow: 'auto',
          p: 2,
        }}
        data-testid="brand-copy-panel"
      >
        <Typography variant="h6" gutterBottom>Brand copy</Typography>
        {rows.map((row, idx) => (
          <React.Fragment key={row.label}>
            <InlineEditRow
              row={row}
              onEdit={() => updateRow(idx, { editing: true, draft: row.value })}
              onSave={() => updateRow(idx, { value: row.draft, editing: false })}
              onCancel={() => updateRow(idx, { editing: false, draft: row.value })}
              onDraftChange={(v) => updateRow(idx, { draft: v })}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 1, pb: 1 }}>
              {NOTES[idx]}
            </Typography>
          </React.Fragment>
        ))}
      </Paper>
    </Box>
  );
}
