'use client';

/**
 * select_with_search-mui-T05: Set Reporting currency to EUR (two Autocompletes)
 *
 * Layout: settings_panel centered titled "Currency settings" with two columns.
 * Two MUI Autocomplete components appear with identical styling:
 *  - "Default currency" (left) (initial value: USD - US Dollar)
 *  - "Reporting currency" (right) ← TARGET (initial value: empty)
 * Each Autocomplete supports searching by typing; the options list appears under the focused input.
 * Options: a medium list of currencies (~25) formatted as "CODE - Name" (e.g., USD - US Dollar, EUR - Euro, GBP - British Pound, JPY - Japanese Yen, CAD - Canadian Dollar).
 * Clutter (low): the panel also contains non-target toggles (e.g., "Show currency symbol"), but toggles do not affect success.
 * Feedback: selecting a currency fills the input with the chosen label and closes the listbox.
 *
 * Success: The selected value of the "Reporting currency" Autocomplete equals "EUR - Euro".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Grid, FormControlLabel, Switch } from '@mui/material';
import type { TaskComponentProps } from '../types';

const currencyOptions = [
  'USD - US Dollar',
  'EUR - Euro',
  'GBP - British Pound',
  'JPY - Japanese Yen',
  'CAD - Canadian Dollar',
  'AUD - Australian Dollar',
  'CHF - Swiss Franc',
  'CNY - Chinese Yuan',
  'INR - Indian Rupee',
  'MXN - Mexican Peso',
  'BRL - Brazilian Real',
  'KRW - South Korean Won',
  'SGD - Singapore Dollar',
  'HKD - Hong Kong Dollar',
  'NOK - Norwegian Krone',
  'SEK - Swedish Krona',
  'DKK - Danish Krone',
  'NZD - New Zealand Dollar',
  'ZAR - South African Rand',
  'RUB - Russian Ruble',
  'PLN - Polish Zloty',
  'THB - Thai Baht',
  'MYR - Malaysian Ringgit',
  'IDR - Indonesian Rupiah',
  'PHP - Philippine Peso',
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [defaultCurrency, setDefaultCurrency] = useState<string | null>('USD - US Dollar');
  const [reportingCurrency, setReportingCurrency] = useState<string | null>(null);
  const [showSymbol, setShowSymbol] = useState(true);

  const handleReportingChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setReportingCurrency(newValue);
    if (newValue === 'EUR - Euro') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Currency settings</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Autocomplete
              data-testid="default-currency-autocomplete"
              options={currencyOptions}
              value={defaultCurrency}
              onChange={(_e, v) => setDefaultCurrency(v)}
              renderInput={(params) => (
                <TextField {...params} label="Default currency" />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              data-testid="reporting-currency-autocomplete"
              options={currencyOptions}
              value={reportingCurrency}
              onChange={handleReportingChange}
              renderInput={(params) => (
                <TextField {...params} label="Reporting currency" placeholder="Select currency" />
              )}
            />
          </Grid>
        </Grid>

        <FormControlLabel
          control={<Switch checked={showSymbol} onChange={(e) => setShowSymbol(e.target.checked)} />}
          label="Show currency symbol"
          sx={{ mt: 2 }}
        />
      </CardContent>
    </Card>
  );
}
