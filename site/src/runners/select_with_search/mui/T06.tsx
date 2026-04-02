'use client';

/**
 * select_with_search-mui-T06: Match the shipping icon in dark mode
 *
 * Theme: dark mode (dark surface, light text).
 * Layout: isolated_card centered titled "Delivery".
 * Guidance: mixed. A small reference line above the input shows "✈️ Air".
 * Component: one MUI Autocomplete labeled "Shipping method". Options render as icon + label:
 *  - 🚚 Ground
 *  - ✈️ Air ← target
 *  - 🏬 Pickup
 *  - 🛸 Drone
 * Initial state: "Ground" is selected.
 * Interaction: clicking the input shows the listbox; typing filters by label text; selecting an option updates the input immediately.
 *
 * Success: The selected value of the "Shipping method" Autocomplete equals "Air".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

interface ShippingOption {
  value: string;
  label: string;
  icon: string;
}

const shippingOptions: ShippingOption[] = [
  { value: 'Ground', label: 'Ground', icon: '🚚' },
  { value: 'Air', label: 'Air', icon: '✈️' },
  { value: 'Pickup', label: 'Pickup', icon: '🏬' },
  { value: 'Drone', label: 'Drone', icon: '🛸' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<ShippingOption | null>(shippingOptions[0]); // Ground

  const handleChange = (_event: React.SyntheticEvent, newValue: ShippingOption | null) => {
    setValue(newValue);
    if (newValue?.value === 'Air') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Delivery</Typography>
        
        {/* Reference */}
        <Box sx={{ 
          mb: 2, 
          p: 1.5, 
          bgcolor: 'action.hover', 
          borderRadius: 1,
          textAlign: 'center'
        }}>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            Reference
          </Typography>
          <Typography variant="body1">✈️ Air</Typography>
        </Box>

        <Autocomplete
          data-testid="shipping-autocomplete"
          options={shippingOptions}
          value={value}
          onChange={handleChange}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, val) => option.value === val.value}
          renderOption={(props, option) => {
            const { key, ...restProps } = props;
            return (
              <Box component="li" key={key} {...restProps} sx={{ display: 'flex', gap: 1 }}>
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Shipping method"
              InputProps={{
                ...params.InputProps,
                startAdornment: value ? <span style={{ marginRight: 8 }}>{value.icon}</span> : null,
              }}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}
