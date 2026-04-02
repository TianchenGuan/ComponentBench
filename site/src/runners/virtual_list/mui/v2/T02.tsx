'use client';

/**
 * virtual_list-mui-v2-T02
 * Primary keys panel: filter, activate result, then apply
 *
 * Two side-by-side cards ("Primary keys" / "Archived keys"). Agent must filter
 * Primary to KEY-7F2A Analytics, select it, and click "Apply keys".
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Paper, Typography, TextField, Button, Box, Chip, Stack, ListItemButton, ListItemText } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../../types';

interface KeyItem { key: string; code: string; label: string; }

const cats = ['Analytics', 'Platform', 'Billing', 'Security', 'Infra', 'DevOps', 'ML', 'QA'];

function buildKeys(prefix: string, count: number): KeyItem[] {
  return Array.from({ length: count }, (_, i) => {
    const hex = i.toString(16).toUpperCase().padStart(4, '0');
    return { key: `${prefix.toLowerCase()}-${hex.toLowerCase()}`, code: `${prefix}-${hex}`, label: cats[i % cats.length] };
  });
}

const primaryKeys = buildKeys('KEY', 800);
primaryKeys.splice(523, 0, { key: 'key-7f2a', code: 'KEY-7F2A', label: 'Analytics' });
const archivedKeys = buildKeys('ARC', 600);

export default function T02({ onSuccess }: TaskComponentProps) {
  const [pFilter, setPFilter] = useState('');
  const [aFilter, setAFilter] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successRef = useRef(false);

  const filteredP = useMemo(
    () => pFilter ? primaryKeys.filter(i => `${i.code} — ${i.label}`.toLowerCase().includes(pFilter.toLowerCase())) : primaryKeys,
    [pFilter],
  );
  const filteredA = useMemo(
    () => aFilter ? archivedKeys.filter(i => `${i.code} — ${i.label}`.toLowerCase().includes(aFilter.toLowerCase())) : archivedKeys,
    [aFilter],
  );

  useEffect(() => {
    if (successRef.current) return;
    if (saved && selected === 'key-7f2a') { successRef.current = true; onSuccess(); }
  }, [saved, selected, onSuccess]);

  const PRow = ({ index, style }: ListChildComponentProps) => {
    const item = filteredP[index];
    return (
      <ListItemButton style={style} selected={selected === item.key}
        onClick={() => { setSelected(item.key); setSaved(false); }} data-item-key={item.key}>
        <ListItemText primary={`${item.code} — ${item.label}`} primaryTypographyProps={{ fontSize: 13 }} />
      </ListItemButton>
    );
  };

  const ARow = ({ index, style }: ListChildComponentProps) => {
    const item = filteredA[index];
    return (
      <ListItemButton style={style} disabled data-item-key={item.key}>
        <ListItemText primary={`${item.code} — ${item.label}`} primaryTypographyProps={{ fontSize: 13 }} />
      </ListItemButton>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Chip label="Env: Production" size="small" />
        <Chip label="Rotation: 90d" size="small" color="warning" />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Paper elevation={1} sx={{ flex: 1, p: 1.5, maxWidth: 380 }} data-testid="primary-card">
          <Typography variant="subtitle2" gutterBottom>Primary keys</Typography>
          <TextField size="small" fullWidth placeholder="Filter primary..." value={pFilter}
            onChange={e => { setPFilter(e.target.value); setSaved(false); }} sx={{ mb: 1 }} data-testid="primary-filter" />
          <Paper variant="outlined">
            <FixedSizeList height={280} width="100%" itemSize={44} itemCount={filteredP.length} overscanCount={5}>
              {PRow}
            </FixedSizeList>
          </Paper>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Selected: {selected ?? 'none'}
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ flex: 1, p: 1.5, maxWidth: 380 }} data-testid="archived-card">
          <Typography variant="subtitle2" gutterBottom>Archived keys</Typography>
          <TextField size="small" fullWidth placeholder="Filter archived..." value={aFilter}
            onChange={e => setAFilter(e.target.value)} sx={{ mb: 1 }} data-testid="archived-filter" />
          <Paper variant="outlined">
            <FixedSizeList height={280} width="100%" itemSize={44} itemCount={filteredA.length} overscanCount={5}>
              {ARow}
            </FixedSizeList>
          </Paper>
        </Paper>
      </Stack>

      <Button variant="contained" onClick={() => setSaved(true)} disabled={!selected}>Apply keys</Button>
    </Box>
  );
}
