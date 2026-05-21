'use client';

/**
 * select_native-mui-v2-T19: Billing dashboard — set Default currency to Euro and apply
 *
 * A billing dashboard panel contains two MUI NativeSelect controls:
 * "Default currency" (starts USD) and "Settlement currency" (starts GBP, must stay).
 * Surrounded by billing tiles and invoice counters.
 * "Apply changes" commits; "Revert" discards.
 *
 * Success: Default currency committed to "EUR", Settlement currency still "GBP",
 * "Apply changes" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, FormHelperText, Button, Box, Grid, Chip,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const currencyOptions = [
  { label: 'US Dollar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'British Pound (GBP)', value: 'GBP' },
  { label: 'Japanese Yen (JPY)', value: 'JPY' },
  { label: 'Swiss Franc (CHF)', value: 'CHF' },
];

export default function T19({ onSuccess }: TaskComponentProps) {
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [settlementCurrency, setSettlementCurrency] = useState('GBP');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && defaultCurrency === 'EUR' && settlementCurrency === 'GBP') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, defaultCurrency, settlementCurrency, onSuccess]);

  const handleApply = () => setApplied(true);
  const handleRevert = () => {
    setDefaultCurrency('USD');
    setSettlementCurrency('GBP');
    setApplied(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Card variant="outlined"><CardContent>
            <Typography variant="caption" color="text.secondary">Outstanding invoices</Typography>
            <Typography variant="h5">$12,430</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={4}>
          <Card variant="outlined"><CardContent>
            <Typography variant="caption" color="text.secondary">Paid this month</Typography>
            <Typography variant="h5">$8,210</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={4}>
          <Card variant="outlined"><CardContent>
            <Typography variant="caption" color="text.secondary">Overdue</Typography>
            <Typography variant="h5">$1,850</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Card sx={{ maxWidth: 480 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Currency Settings</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label="Billing" size="small" />
            <Chip label="Multi-currency" size="small" variant="outlined" />
          </Box>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel variant="standard" htmlFor="default-currency">Default currency</InputLabel>
            <NativeSelect
              data-testid="default-currency"
              data-canonical-type="select_native"
              data-selected-value={defaultCurrency}
              value={defaultCurrency}
              onChange={(e) => { setDefaultCurrency(e.target.value); setApplied(false); }}
              inputProps={{ name: 'default-currency', id: 'default-currency' }}
            >
              {currencyOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </NativeSelect>
            <FormHelperText>Used for new invoices</FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel variant="standard" htmlFor="settlement-currency">Settlement currency</InputLabel>
            <NativeSelect
              data-testid="settlement-currency"
              data-canonical-type="select_native"
              data-selected-value={settlementCurrency}
              value={settlementCurrency}
              onChange={(e) => { setSettlementCurrency(e.target.value); setApplied(false); }}
              inputProps={{ name: 'settlement-currency', id: 'settlement-currency' }}
            >
              {currencyOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </NativeSelect>
            <FormHelperText>Used for payouts</FormHelperText>
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleApply}>Apply changes</Button>
            <Button variant="outlined" onClick={handleRevert}>Revert</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
