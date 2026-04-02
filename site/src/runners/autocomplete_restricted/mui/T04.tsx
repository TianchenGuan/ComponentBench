'use client';

/**
 * autocomplete_restricted-mui-T04: Search and select a country (form section)
 *
 * setup_description:
 * The page shows a "Billing details" **form section** with several fields (realistic clutter):
 * - Name (text input)
 * - Email (text input)
 * - **Country** (Material UI Autocomplete)  ← target
 * - VAT ID (text input)
 *
 * Country Autocomplete details:
 * - Theme: light; spacing: comfortable; size: default.
 * - Restricted (freeSolo=false).
 * - Initial state: empty; placeholder "Start typing…".
 * - Options: ~30 countries, including United States, United Arab Emirates, United Kingdom, Uruguay, Uganda, etc.
 * - Because of similar prefixes ("United …"), selecting the correct one requires paying attention.
 * - Selection commits immediately; no Save required.
 *
 * Other inputs are distractors and do not affect success.
 *
 * Success: The "Country" Autocomplete has selected value "United Kingdom".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import type { TaskComponentProps } from '../types';

const countries = [
  'Afghanistan', 'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada',
  'China', 'Colombia', 'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Greece',
  'India', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Netherlands', 'Norway', 'Poland',
  'Portugal', 'Spain', 'Sweden', 'Switzerland', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Venezuela',
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'United Kingdom') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Billing details
        </Typography>
        <Stack spacing={2}>
          <div>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Name</Typography>
            <TextField size="small" fullWidth placeholder="Enter your name" />
          </div>

          <div>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Email</Typography>
            <TextField size="small" fullWidth placeholder="Enter your email" />
          </div>

          <div>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Country</Typography>
            <Autocomplete
              data-testid="country-autocomplete"
              options={countries}
              value={value}
              onChange={handleChange}
              renderInput={(params) => (
                <TextField {...params} placeholder="Start typing…" size="small" />
              )}
              freeSolo={false}
            />
          </div>

          <div>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>VAT ID</Typography>
            <TextField size="small" fullWidth placeholder="Optional" />
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
