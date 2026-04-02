'use client';

/**
 * combobox_editable_single-mui-T04: Search and select San Francisco
 *
 * A shipping form section is shown with several standard inputs.
 * The "City" field is an editable combobox implemented with MUI Autocomplete.
 * - Scene: form_section layout, center placement, light theme, comfortable spacing, default scale.
 * - Target component: "City" Autocomplete.
 * - Options (~20) with similar "San …" entries.
 * - Initial state: empty.
 * - Distractors: Name, Street inputs, checkbox, disabled Continue button.
 *
 * Success: The "City" combobox value equals "San Francisco".
 */

import React, { useState } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Checkbox, FormControlLabel, Button, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const cities = [
  'San Francisco', 'San Jose', 'San Diego', 'San Mateo', 'Santa Cruz', 'Santa Rosa',
  'Sacramento', 'Seattle', 'Portland', 'Phoenix', 'Denver', 'Dallas', 'Austin',
  'Chicago', 'Boston', 'Miami', 'Atlanta', 'Nashville', 'Orlando', 'Tampa',
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [city, setCity] = useState<string | null>(null);

  const handleCityChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setCity(newValue);
    if (newValue === 'San Francisco') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Shipping form</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Name</Typography>
          <TextField fullWidth size="small" placeholder="Full name" />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Street</Typography>
          <TextField fullWidth size="small" placeholder="Street address" />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>City</Typography>
          <Autocomplete
            data-testid="city-autocomplete"
            freeSolo
            options={cities}
            value={city}
            onChange={handleCityChange}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select city" size="small" />
            )}
          />
        </Box>

        <FormControlLabel
          control={<Checkbox size="small" />}
          label="Use as default address"
          sx={{ mb: 2 }}
        />

        <Button variant="contained" disabled fullWidth>
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
