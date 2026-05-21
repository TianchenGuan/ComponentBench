'use client';

/**
 * inline_editable_text-mui-v2-T04: Reference chip exact match for banner tag
 *
 * Dashboard panel "Banner tags" with two inline editable rows: "Banner tag" (PENDING)
 * and "Internal tag" (ops-only). A reference card on the right shows a bold blue chip
 * with the target text "LATENCY / APAC". A card-level "Apply tags" button commits.
 *
 * Success: "Banner tag" committed value equals "LATENCY / APAC", display mode,
 * "Internal tag" remains "ops-only", committed via "Apply tags".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, TextField, IconButton, Paper, Button, Chip, Stack, Divider,
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

export default function T04({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowState[]>([
    { label: 'Banner tag', value: 'PENDING', editing: false, draft: 'PENDING' },
    { label: 'Internal tag', value: 'ops-only', editing: false, draft: 'ops-only' },
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
    const banner = rows.find((r) => r.label === 'Banner tag');
    const internal = rows.find((r) => r.label === 'Internal tag');
    if (
      banner && !banner.editing && banner.value === 'LATENCY / APAC' &&
      internal && internal.value === 'ops-only'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [rows, applied, onSuccess]);

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      <Box sx={{ position: 'relative', top: 24, left: 40, maxWidth: 520 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Banner tags</Typography>
          <Stack direction="row" spacing={3}>
            <Box sx={{ flex: 1 }}>
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
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Reference
              </Typography>
              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#e3f2fd', borderColor: '#1976d2' }}>
                <Chip
                  label="LATENCY / APAC"
                  sx={{ fontWeight: 700, color: '#1565c0', bgcolor: '#bbdefb', fontSize: '0.85rem' }}
                  data-testid="reference-chip"
                />
              </Paper>
            </Box>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'right' }}>
            <Button variant="contained" onClick={handleApply} data-testid="apply-tags">
              Apply tags
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
