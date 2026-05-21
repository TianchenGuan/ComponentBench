'use client';

/**
 * select_custom_multi-mui-v2-T05: Primary groups panel with hidden-overflow chips
 *
 * Settings panel, dark theme, compact spacing, high clutter, bottom-left placement.
 * Stack of unrelated toggles/dropdowns above two MUI Autocomplete fields
 * (multiple, disableCloseOnSelect, filterSelectedOptions, limitTags=2):
 *   - "Primary groups" ← TARGET (initial: Platform Legacy, Risk)
 *   - "Fallback groups" (initial: Billing, must stay)
 * Options: Fraud Ops, Fraud Ops (shadow), Platform, Platform Legacy, Customer Success,
 *          Customer Support, Security Review, Security Ops, Risk, Billing, Growth.
 * Target: {Fraud Ops, Platform, Customer Success, Security Review}.
 * Panel button "Save groups" commits the final state.
 *
 * Success: Primary groups = {Fraud Ops, Platform, Customer Success, Security Review},
 *          Fallback groups unchanged = {Billing}, Save groups clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Autocomplete, TextField, Chip, Button, Typography, Paper, Box, Switch,
  FormControlLabel, ThemeProvider, createTheme, CssBaseline, Divider,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const groupOptions = [
  'Fraud Ops', 'Fraud Ops (shadow)', 'Platform', 'Platform Legacy',
  'Customer Success', 'Customer Support', 'Security Review', 'Security Ops',
  'Risk', 'Billing', 'Growth',
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryGroups, setPrimaryGroups] = useState<string[]>(['Platform Legacy', 'Risk']);
  const [fallbackGroups, setFallbackGroups] = useState<string[]>(['Billing']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      setsEqual(primaryGroups, ['Fraud Ops', 'Platform', 'Customer Success', 'Security Review']) &&
      setsEqual(fallbackGroups, ['Billing'])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, primaryGroups, fallbackGroups, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 2, minHeight: '100vh' }}>
        <Paper sx={{ p: 2, maxWidth: 440 }}>
          <Typography variant="h6" gutterBottom>Routing Settings</Typography>

          <FormControlLabel control={<Switch defaultChecked />} label="Auto-escalate" />
          <FormControlLabel control={<Switch />} label="Weekends only" />
          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ mb: 2 }}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              filterSelectedOptions
              limitTags={2}
              options={groupOptions}
              value={primaryGroups}
              onChange={(_, v) => { setPrimaryGroups(v); setSaved(false); }}
              renderTags={(value, getTagProps) =>
                value.map((opt, i) => <Chip size="small" label={opt} {...getTagProps({ index: i })} key={opt} />)
              }
              renderInput={(params) => <TextField {...params} label="Primary groups" size="small" />}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              filterSelectedOptions
              limitTags={2}
              options={groupOptions}
              value={fallbackGroups}
              onChange={(_, v) => { setFallbackGroups(v); setSaved(false); }}
              renderTags={(value, getTagProps) =>
                value.map((opt, i) => <Chip size="small" label={opt} {...getTagProps({ index: i })} key={opt} />)
              }
              renderInput={(params) => <TextField {...params} label="Fallback groups" size="small" />}
            />
          </Box>

          <Button variant="contained" fullWidth onClick={() => setSaved(true)}>Save groups</Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
