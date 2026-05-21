'use client';

/**
 * select_native-mui-T14: Set default currency to Euro and Apply
 *
 * Layout: a billing settings dashboard panel with multiple tiles (invoices, payment methods, taxes) shown as distractors.
 * The target tile is "Default currency" and contains:
 * - A native select (MUI Select with native=true) labeled "Default currency"
 * - Two buttons under it: "Apply changes" and "Revert"
 *
 * Currency options (label → value):
 * - US Dollar (USD) → USD
 * - Euro (EUR) → EUR  ← TARGET
 * - British Pound (GBP) → GBP
 * - Japanese Yen (JPY) → JPY
 * - Canadian Dollar (CAD) → CAD
 *
 * Initial state: USD is selected.
 * Feedback dynamics: selecting an option updates a small preview text ("Prices will be shown in …"), but it is NOT committed until "Apply changes" is clicked.
 * Clicking "Apply changes" shows a toast "Saved".
 * Clutter: medium — other tiles have buttons and links, but they are unrelated.
 *
 * Success: The target native select has selected option value 'EUR' AND user clicks 'Apply changes'.
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  Select, Box, Button, Grid, Link, Snackbar, Alert
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const currencyOptions = [
  { label: 'US Dollar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'British Pound (GBP)', value: 'GBP' },
  { label: 'Japanese Yen (JPY)', value: 'JPY' },
  { label: 'Canadian Dollar (CAD)', value: 'CAD' },
];

export default function T14({ onSuccess }: TaskComponentProps) {
  const [currency, setCurrency] = useState<string>('USD');
  const [showToast, setShowToast] = useState(false);

  const handleApply = () => {
    setShowToast(true);
    if (currency === 'EUR') {
      onSuccess();
    }
  };

  const handleRevert = () => {
    setCurrency('USD');
  };

  const selectedLabel = currencyOptions.find(c => c.value === currency)?.label || '';

  return (
    <>
      <Card sx={{ width: 600 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Billing Settings</Typography>

          <Grid container spacing={2}>
            {/* Distractor tile: Invoices */}
            <Grid item xs={6}>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Invoices</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  3 unpaid invoices
                </Typography>
                <Link href="#" onClick={(e) => e.preventDefault()} sx={{ fontSize: 13 }}>
                  View all invoices
                </Link>
              </Box>
            </Grid>

            {/* Distractor tile: Payment methods */}
            <Grid item xs={6}>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Payment methods</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Visa ending in 4242
                </Typography>
                <Button variant="text" size="small">Manage</Button>
              </Box>
            </Grid>

            {/* TARGET tile: Default currency */}
            <Grid item xs={6}>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Default currency</Typography>
                
                <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                  <InputLabel variant="standard" htmlFor="currency-select">
                    Default currency
                  </InputLabel>
                  <Select
                    native
                    data-testid="default-currency-select"
                    data-canonical-type="select_native"
                    data-selected-value={currency}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as string)}
                    inputProps={{ id: 'currency-select' }}
                  >
                    {currencyOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Prices will be shown in {selectedLabel}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" size="small" onClick={handleApply}>
                    Apply changes
                  </Button>
                  <Button variant="outlined" size="small" onClick={handleRevert}>
                    Revert
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Distractor tile: Taxes */}
            <Grid item xs={6}>
              <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Taxes</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Tax ID not configured
                </Typography>
                <Button variant="text" size="small">Add tax ID</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar 
        open={showToast} 
        autoHideDuration={2000} 
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowToast(false)}>
          Saved
        </Alert>
      </Snackbar>
    </>
  );
}
