'use client';

/**
 * select_custom_multi-mui-v2-T08: Enabled metrics drawer with sibling preservation
 *
 * Drawer flow, compact spacing, top-right placement, medium clutter.
 * Revenue dashboard in background. "Metric visibility" opens a MUI Drawer with two
 * Autocomplete (multiple, disableCloseOnSelect) fields:
 *   - "Enabled metrics" ← TARGET (initial: ARR, Revenue Growth)
 *   - "Muted metrics" (initial: Churned Accounts, must stay)
 * Options: MRR, ARR, Net Revenue, Revenue Growth, Gross Margin, Margin %,
 *          Active Accounts, Active Trials, Churned Accounts.
 * Target: {MRR, Net Revenue, Gross Margin, Active Accounts}.
 * Drawer-local "Save visibility" commits the final state.
 *
 * Success: Enabled metrics = {MRR, Net Revenue, Gross Margin, Active Accounts},
 *          Muted metrics unchanged = {Churned Accounts}, Save visibility clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Autocomplete, TextField, Chip, Button, Typography, Paper, Box, Drawer, Divider,
  Card, CardContent, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../../types';

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const metricOptions = [
  'MRR', 'ARR', 'Net Revenue', 'Revenue Growth', 'Gross Margin', 'Margin %',
  'Active Accounts', 'Active Trials', 'Churned Accounts',
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [enabledMetrics, setEnabledMetrics] = useState<string[]>(['ARR', 'Revenue Growth']);
  const [mutedMetrics, setMutedMetrics] = useState<string[]>(['Churned Accounts']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      setsEqual(enabledMetrics, ['MRR', 'Net Revenue', 'Gross Margin', 'Active Accounts']) &&
      setsEqual(mutedMetrics, ['Churned Accounts'])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, enabledMetrics, mutedMetrics, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Revenue Dashboard</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Card sx={{ flex: 1 }}><CardContent><Typography variant="caption" color="text.secondary">MRR</Typography><Typography variant="h5">$142K</Typography></CardContent></Card>
        <Card sx={{ flex: 1 }}><CardContent><Typography variant="caption" color="text.secondary">ARR</Typography><Typography variant="h5">$1.7M</Typography></CardContent></Card>
        <Card sx={{ flex: 1 }}><CardContent><Typography variant="caption" color="text.secondary">Growth</Typography><Typography variant="h5">+12%</Typography></CardContent></Card>
      </Box>

      <Button variant="outlined" onClick={() => setDrawerOpen(true)}>Metric visibility</Button>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 380, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Metric Visibility</Typography>
            <IconButton size="small" onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={metricOptions}
                value={enabledMetrics}
                onChange={(_, v) => { setEnabledMetrics(v); setSaved(false); }}
                renderTags={(value, getTagProps) =>
                  value.map((opt, i) => <Chip size="small" label={opt} {...getTagProps({ index: i })} key={opt} />)
                }
                renderInput={(params) => <TextField {...params} label="Enabled metrics" size="small" />}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={metricOptions}
                value={mutedMetrics}
                onChange={(_, v) => { setMutedMetrics(v); setSaved(false); }}
                renderTags={(value, getTagProps) =>
                  value.map((opt, i) => <Chip size="small" label={opt} {...getTagProps({ index: i })} key={opt} />)
                }
                renderInput={(params) => <TextField {...params} label="Muted metrics" size="small" />}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save visibility</Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
