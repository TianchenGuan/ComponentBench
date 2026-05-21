'use client';

/**
 * select_native-mui-T15: Match shipping region to flag reference (Japan)
 *
 * Layout: an isolated card in the top-right of the viewport. Theme: dark.
 * At the top of the card is a "Reference" card that shows only a flag icon (e.g., 🇯🇵) with no plain-text country name.
 * The flag element exposes an aria-label with the country name for accessibility (e.g., aria-label="Japan").
 *
 * Below, there are TWO native selects (same styling) implemented with MUI NativeSelect:
 * 1) "Shipping region"  ← TARGET
 * 2) "Content locale" (distractor select with similar options)
 *
 * Both selects share similar region options (label → value):
 * - Japan → JP  ← TARGET (matches 🇯🇵)
 * - China → CN
 * - South Korea → KR
 * - Singapore → SG
 * - Thailand → TH
 * - Taiwan → TW
 *
 * Initial state:
 * - Shipping region: Singapore
 * - Content locale: Japan
 *
 * Clutter: low — short explanatory text and a disabled "Continue" button.
 * Feedback: immediate, no Apply/Save.
 *
 * Success: The target native select labeled "Shipping region" has selected option value 'JP' (label 'Japan').
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, Box, Button
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const regionOptions = [
  { label: 'Japan', value: 'JP' },
  { label: 'China', value: 'CN' },
  { label: 'South Korea', value: 'KR' },
  { label: 'Singapore', value: 'SG' },
  { label: 'Thailand', value: 'TH' },
  { label: 'Taiwan', value: 'TW' },
];

export default function T15({ onSuccess }: TaskComponentProps) {
  const [shippingRegion, setShippingRegion] = useState<string>('SG');
  const [contentLocale, setContentLocale] = useState<string>('JP');

  const handleShippingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setShippingRegion(value);
    if (value === 'JP') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 380, bgcolor: '#1f1f1f', color: '#fff' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Region Settings</Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mb: 1 }}>
            Reference
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1.5,
              border: '1px solid #444',
              borderRadius: 1,
              background: '#2a2a2a',
              fontSize: 32,
            }}
            aria-label="Japan"
            role="img"
          >
            🇯🇵
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
          Configure your shipping and content settings to match your target region.
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel 
            variant="standard" 
            htmlFor="shipping-region-select"
            sx={{ color: '#aaa' }}
          >
            Shipping region
          </InputLabel>
          <NativeSelect
            data-testid="shipping-region"
            data-canonical-type="select_native"
            data-selected-value={shippingRegion}
            value={shippingRegion}
            onChange={handleShippingChange}
            inputProps={{ id: 'shipping-region-select' }}
            sx={{ color: '#fff', '& option': { color: '#000' } }}
          >
            {regionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel 
            variant="standard" 
            htmlFor="content-locale-select"
            sx={{ color: '#aaa' }}
          >
            Content locale
          </InputLabel>
          <NativeSelect
            data-testid="content-locale"
            data-canonical-type="select_native"
            data-selected-value={contentLocale}
            value={contentLocale}
            onChange={(e) => setContentLocale(e.target.value)}
            inputProps={{ id: 'content-locale-select' }}
            sx={{ color: '#fff', '& option': { color: '#000' } }}
          >
            {regionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </FormControl>

        <Button variant="contained" disabled fullWidth>
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
