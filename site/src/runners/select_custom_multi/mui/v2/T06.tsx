'use client';

/**
 * select_custom_multi-mui-v2-T06: Access labels modal with freeSolo commit
 *
 * Modal/Dialog flow, compact spacing, medium clutter. A policy card opens a MUI Dialog
 * titled "Edit access labels". One Autocomplete field labeled "Access labels"
 * (multiple, freeSolo). Existing options: Critical, Customer-facing, Customer-visible,
 * Internal, On-call, Pager.
 * Initial: [Critical, Internal]. Target: [Critical, Customer-facing, on-call-only].
 * "on-call-only" is custom (must be typed + committed). Dialog footer: Cancel / Apply labels.
 *
 * Success: Access labels = {Critical, Customer-facing, on-call-only}, Apply labels clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Autocomplete, TextField, Chip, Button, Typography, Paper, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const labelOptions = ['Critical', 'Customer-facing', 'Customer-visible', 'Internal', 'On-call', 'Pager'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [accessLabels, setAccessLabels] = useState<string[]>(['Critical', 'Internal']);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && setsEqual(accessLabels, ['Critical', 'Customer-facing', 'on-call-only'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, accessLabels, onSuccess]);

  const handleApply = () => {
    setCommitted(true);
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ maxWidth: 460, mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Access Policy</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Current policy: default-read-only. Labels control escalation routing and audit visibility.
          </Typography>
          <Button variant="outlined" onClick={() => setDialogOpen(true)}>Edit access labels</Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit access labels</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Autocomplete
              multiple
              freeSolo
              options={labelOptions}
              value={accessLabels}
              onChange={(_, v) => { setAccessLabels(v); setCommitted(false); }}
              renderTags={(value, getTagProps) =>
                value.map((opt, i) => <Chip size="small" label={opt} {...getTagProps({ index: i })} key={opt} />)
              }
              renderInput={(params) => <TextField {...params} label="Access labels" size="small" />}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApply}>Apply labels</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
