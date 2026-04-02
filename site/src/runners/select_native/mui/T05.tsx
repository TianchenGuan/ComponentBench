'use client';

/**
 * select_native-mui-T05: Match plan to preview badge (mixed guidance)
 *
 * Layout: a centered isolated card titled "Subscription".
 * The card shows a "Preview" badge at the top that visually displays the target plan (a colored pill with text, e.g., "STANDARD").
 * Immediately below is a single MUI NativeSelect labeled "Plan".
 *
 * Options (label → value):
 * - Basic → basic
 * - Standard → standard
 * - Pro → pro
 * - Enterprise → enterprise
 *
 * Initial state: "Basic" is selected (value=basic).
 * Guidance: mixed — the Preview badge shows the plan visually and also includes the plan text in all-caps ("STANDARD").
 * Distractors: pricing text blocks under the select; these do not affect success.
 * Feedback: selecting an option updates the visible value immediately; no Apply/Save.
 *
 * Success: The target native select has selected option value 'standard' (label 'Standard').
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, Box, Chip
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Basic', value: 'basic' },
  { label: 'Standard', value: 'standard' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('basic');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'standard') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Subscription</Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Preview
          </Typography>
          <Chip 
            label="STANDARD" 
            color="primary" 
            sx={{ fontWeight: 600 }}
          />
        </Box>
        
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel variant="standard" htmlFor="plan-select">Plan</InputLabel>
          <NativeSelect
            data-testid="plan-select"
            data-canonical-type="select_native"
            data-selected-value={selected}
            value={selected}
            onChange={handleChange}
            inputProps={{
              name: 'plan',
              id: 'plan-select',
            }}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </FormControl>

        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
          <Typography variant="body2" color="text.secondary">
            Basic: Free forever
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Standard: $9.99/month
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pro: $19.99/month
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enterprise: Contact us
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
