'use client';

/**
 * select_native-mui-T12: Set Product updates digest to Weekly (dark, compact, multi-instance)
 *
 * Layout: a small "Notification dashboard" card anchored near the bottom-left of the viewport.
 * Theme: dark. Spacing: compact. Scale: small. This makes controls denser and targets smaller.
 *
 * The card contains THREE native selects with very similar structure (all implemented via MUI Select native=true):
 * 1) "Marketing emails" (frequency)
 * 2) "Product updates" (frequency)  ← TARGET
 * 3) "Security alerts" (frequency)
 *
 * Each select has the same options (label → value):
 * - Never → never
 * - Daily → daily
 * - Weekly → weekly  ← TARGET OPTION
 * - Monthly → monthly
 *
 * Initial state:
 * - Marketing emails: Monthly
 * - Product updates: Daily
 * - Security alerts: Never
 *
 * Clutter: medium — there are also small inline descriptions and a "Reset all" button (button does not determine success).
 * Feedback: the selected value is visible in each select immediately; no Apply/Save.
 *
 * Success: The target native select labeled "Product updates" has selected option value 'weekly' (label 'Weekly').
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  Select, Box, Button
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const frequencyOptions = [
  { label: 'Never', value: 'never' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

export default function T12({ onSuccess }: TaskComponentProps) {
  const [marketing, setMarketing] = useState<string>('monthly');
  const [productUpdates, setProductUpdates] = useState<string>('daily');
  const [security, setSecurity] = useState<string>('never');

  const handleProductUpdatesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setProductUpdates(value);
    if (value === 'weekly') {
      onSuccess();
    }
  };

  const handleReset = () => {
    setMarketing('monthly');
    setProductUpdates('daily');
    setSecurity('never');
  };

  const selectStyle = { fontSize: 12, height: 28 };
  const labelStyle = { fontSize: 12 };

  return (
    <Card sx={{ width: 320, bgcolor: '#1f1f1f', color: '#fff' }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Notification dashboard
        </Typography>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small" sx={{ mb: 0.5 }}>
            <InputLabel 
              variant="standard" 
              htmlFor="marketing-select"
              sx={{ ...labelStyle, color: '#aaa' }}
            >
              Marketing emails
            </InputLabel>
            <Select
              native
              data-testid="marketing-emails"
              data-canonical-type="select_native"
              data-selected-value={marketing}
              value={marketing}
              onChange={(e) => setMarketing(e.target.value as string)}
              inputProps={{ id: 'marketing-select' }}
              sx={{ ...selectStyle, color: '#fff', '& option': { color: '#000' } }}
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
            Promotions and offers
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small" sx={{ mb: 0.5 }}>
            <InputLabel 
              variant="standard" 
              htmlFor="product-updates-select"
              sx={{ ...labelStyle, color: '#aaa' }}
            >
              Product updates
            </InputLabel>
            <Select
              native
              data-testid="product-updates"
              data-canonical-type="select_native"
              data-selected-value={productUpdates}
              value={productUpdates}
              onChange={handleProductUpdatesChange as any}
              inputProps={{ id: 'product-updates-select' }}
              sx={{ ...selectStyle, color: '#fff', '& option': { color: '#000' } }}
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
            New features and improvements
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small" sx={{ mb: 0.5 }}>
            <InputLabel 
              variant="standard" 
              htmlFor="security-select"
              sx={{ ...labelStyle, color: '#aaa' }}
            >
              Security alerts
            </InputLabel>
            <Select
              native
              data-testid="security-alerts"
              data-canonical-type="select_native"
              data-selected-value={security}
              value={security}
              onChange={(e) => setSecurity(e.target.value as string)}
              inputProps={{ id: 'security-select' }}
              sx={{ ...selectStyle, color: '#fff', '& option': { color: '#000' } }}
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
            Account and login activity
          </Typography>
        </Box>

        <Button 
          variant="outlined" 
          size="small" 
          onClick={handleReset}
          sx={{ color: '#aaa', borderColor: '#555', fontSize: 11 }}
        >
          Reset all
        </Button>
      </CardContent>
    </Card>
  );
}
