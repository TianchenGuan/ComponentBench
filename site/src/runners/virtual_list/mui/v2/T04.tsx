'use client';

/**
 * virtual_list-mui-v2-T04
 * Entitlements dialog: exact five-row selection and apply
 *
 * MUI Dialog with a dense virtualized checkbox list. Agent must check exactly
 * ENT-011, ENT-019, ENT-027, ENT-043, ENT-050 and click "Apply entitlements".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Checkbox, Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../../types';

interface EntItem { key: string; code: string; label: string; }

const entLabels = [
  'Read invoices', 'Export invoices', 'Edit invoices', 'Manage users', 'Billing access',
  'View templates', 'Create templates', 'Delete templates', 'Audit logs', 'API tokens',
  'Webhook config', 'SSO settings', 'Role admin', 'Data import', 'Schema edit',
  'Bulk operations', 'View reports', 'Dashboard access', 'Notification config', 'Cert management',
];

function buildEnts(): EntItem[] {
  return Array.from({ length: 500 }, (_, i) => ({
    key: `ent-${String(i).padStart(3, '0')}`,
    code: `ENT-${String(i).padStart(3, '0')}`,
    label: entLabels[i % entLabels.length],
  }));
}

const ents = buildEnts();
const TARGET_KEYS = new Set(['ent-011', 'ent-019', 'ent-027', 'ent-043', 'ent-050']);

export default function T04({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (saved && checked.size === TARGET_KEYS.size && Array.from(TARGET_KEYS).every(k => checked.has(k))) {
      successRef.current = true;
      onSuccess();
    }
  }, [saved, checked, onSuccess]);

  const toggle = (key: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setSaved(false);
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = ents[index];
    return (
      <ListItemButton style={style} dense onClick={() => toggle(item.key)} data-item-key={item.key}
        sx={{ bgcolor: checked.has(item.key) ? 'action.selected' : 'transparent' }}>
        <ListItemIcon sx={{ minWidth: 36 }}>
          <Checkbox edge="start" checked={checked.has(item.key)} size="small" disableRipple />
        </ListItemIcon>
        <ListItemText primary={`${item.code} ${item.label}`} primaryTypographyProps={{ fontSize: 13 }} />
      </ListItemButton>
    );
  };

  return (
    <Box sx={{ p: 2, maxWidth: 480 }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2">Account entitlements</Typography>
        <Typography variant="body2" color="text.secondary">Manage access controls for this account.</Typography>
      </Paper>

      <Button variant="outlined" onClick={() => { setOpen(true); setChecked(new Set()); setSaved(false); }}>
        Edit entitlements
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit entitlements</DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, pt: 1, display: 'block' }}>
            Selected: {checked.size}
          </Typography>
          <FixedSizeList height={360} width="100%" itemSize={42} itemCount={ents.length} overscanCount={5}>
            {Row}
          </FixedSizeList>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setSaved(true)}>Apply entitlements</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
