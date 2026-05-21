'use client';

/**
 * select_native-mui-v2-T23: Notification dashboard — set Product updates to Weekly and save
 *
 * Small dark dashboard card anchored bottom-left. Three MUI NativeSelect controls:
 * "Marketing emails" (Monthly), "Product updates" (Daily → Weekly), "Security alerts" (Never).
 * "Save notification settings" commits; "Reset all" discards.
 *
 * Success: Product updates = "weekly", others unchanged, Save clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, Button, Box, ThemeProvider, createTheme,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const frequencyOptions = [
  { label: 'Never', value: 'never' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

export default function T23({ onSuccess }: TaskComponentProps) {
  const [marketing, setMarketing] = useState('monthly');
  const [productUpdates, setProductUpdates] = useState('daily');
  const [security, setSecurity] = useState('never');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && productUpdates === 'weekly' && marketing === 'monthly' && security === 'never') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, productUpdates, marketing, security, onSuccess]);

  const handleSave = () => setSaved(true);
  const handleReset = () => {
    setMarketing('monthly');
    setProductUpdates('daily');
    setSecurity('never');
    setSaved(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', minHeight: '80vh' }}>
        <Card sx={{ width: 340 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Notifications</Typography>

            <FormControl fullWidth sx={{ mt: 1 }} size="small">
              <InputLabel variant="standard" htmlFor="marketing-emails">Marketing emails</InputLabel>
              <NativeSelect
                data-testid="marketing-emails"
                data-canonical-type="select_native"
                data-selected-value={marketing}
                value={marketing}
                onChange={(e) => { setMarketing(e.target.value); setSaved(false); }}
                inputProps={{ name: 'marketing-emails', id: 'marketing-emails' }}
              >
                {frequencyOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </NativeSelect>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }} size="small">
              <InputLabel variant="standard" htmlFor="product-updates">Product updates</InputLabel>
              <NativeSelect
                data-testid="product-updates"
                data-canonical-type="select_native"
                data-selected-value={productUpdates}
                value={productUpdates}
                onChange={(e) => { setProductUpdates(e.target.value); setSaved(false); }}
                inputProps={{ name: 'product-updates', id: 'product-updates' }}
              >
                {frequencyOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </NativeSelect>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }} size="small">
              <InputLabel variant="standard" htmlFor="security-alerts">Security alerts</InputLabel>
              <NativeSelect
                data-testid="security-alerts"
                data-canonical-type="select_native"
                data-selected-value={security}
                value={security}
                onChange={(e) => { setSecurity(e.target.value); setSaved(false); }}
                inputProps={{ name: 'security-alerts', id: 'security-alerts' }}
              >
                {frequencyOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </NativeSelect>
            </FormControl>

            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" onClick={handleSave}>Save notification settings</Button>
              <Button variant="outlined" size="small" onClick={handleReset}>Reset all</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
