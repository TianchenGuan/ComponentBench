'use client';

/**
 * combobox_editable_single-mui-T07: Enter invoice ID INV-2048 in free text mode
 *
 * A billing settings panel contains one editable combobox labeled "Invoice ID"
 * implemented with MUI Autocomplete configured in free text mode (freeSolo).
 * - Scene: settings_panel layout, center placement, light theme, COMPACT spacing, default scale.
 * - Component behavior: Past invoice IDs appear as suggestions, but any text is accepted.
 * - Suggestions: INV-2045, INV-2046, INV-2047, INV-2049, INV-2148, INV-3048.
 * - Initial state: empty.
 * - Distractors: Currency select, Email receipts toggle.
 *
 * Success: The "Invoice ID" combobox value equals "INV-2048" exactly.
 */

import React, { useState } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Select, MenuItem, FormControlLabel, Switch, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const invoiceSuggestions = ['INV-2045', 'INV-2046', 'INV-2047', 'INV-2049', 'INV-2148', 'INV-3048'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    if (newInputValue === 'INV-2048') {
      onSuccess();
    }
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'INV-2048') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Billing settings</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" display="block" gutterBottom>Invoice ID</Typography>
          <Autocomplete
            data-testid="invoice-id"
            freeSolo
            options={invoiceSuggestions}
            value={value}
            onChange={handleChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            size="small"
            renderInput={(params) => (
              <TextField {...params} placeholder="Enter invoice ID" />
            )}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Goal: INV-2048
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" display="block" gutterBottom>Currency</Typography>
          <Select size="small" fullWidth defaultValue="USD">
            <MenuItem value="USD">USD - US Dollar</MenuItem>
            <MenuItem value="EUR">EUR - Euro</MenuItem>
            <MenuItem value="GBP">GBP - British Pound</MenuItem>
          </Select>
        </Box>

        <FormControlLabel
          control={<Switch size="small" />}
          label={<Typography variant="body2">Email receipts</Typography>}
        />
      </CardContent>
    </Card>
  );
}
