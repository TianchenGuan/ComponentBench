'use client';

/**
 * select_native-mui-v2-T24: Reference flag — set Shipping region to Japan and apply
 *
 * Settings card with two MUI NativeSelect controls: "Shipping region" (starts Singapore)
 * and "Content locale" (starts en-US, must stay). A reference chip shows the Japan flag 🇯🇵
 * without country name text. "Apply region settings" commits; "Cancel" discards.
 *
 * Success: Shipping region = "JP"/"Japan", Content locale = "en-US", Apply clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, Button, Box, Chip, FormHelperText,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const regionOptions = [
  { label: 'Singapore', value: 'SG' },
  { label: 'Japan', value: 'JP' },
  { label: 'South Korea', value: 'KR' },
  { label: 'Australia', value: 'AU' },
  { label: 'India', value: 'IN' },
  { label: 'United States', value: 'US' },
];

const localeOptions = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'English (UK)', value: 'en-GB' },
  { label: 'Japanese', value: 'ja-JP' },
  { label: 'Korean', value: 'ko-KR' },
];

export default function T24({ onSuccess }: TaskComponentProps) {
  const [shippingRegion, setShippingRegion] = useState('SG');
  const [contentLocale, setContentLocale] = useState('en-US');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && shippingRegion === 'JP' && contentLocale === 'en-US') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, shippingRegion, contentLocale, onSuccess]);

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
      <Card sx={{ maxWidth: 440 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Region Settings</Typography>

          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Reference:</Typography>
            <Chip
              label="🇯🇵"
              size="medium"
              variant="outlined"
              aria-label="Flag of Japan"
              sx={{ fontSize: '1.5rem' }}
            />
          </Box>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel variant="standard" htmlFor="shipping-region">Shipping region</InputLabel>
            <NativeSelect
              data-testid="shipping-region"
              data-canonical-type="select_native"
              data-selected-value={shippingRegion}
              value={shippingRegion}
              onChange={(e) => { setShippingRegion(e.target.value); setApplied(false); }}
              inputProps={{ name: 'shipping-region', id: 'shipping-region' }}
            >
              {regionOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </NativeSelect>
            <FormHelperText>Select the region matching the reference flag</FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel variant="standard" htmlFor="content-locale">Content locale</InputLabel>
            <NativeSelect
              data-testid="content-locale"
              data-canonical-type="select_native"
              data-selected-value={contentLocale}
              value={contentLocale}
              onChange={(e) => { setContentLocale(e.target.value); setApplied(false); }}
              inputProps={{ name: 'content-locale', id: 'content-locale' }}
            >
              {localeOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </NativeSelect>
          </FormControl>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Shipping rates and delivery times depend on the selected region.
          </Typography>

          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={() => setApplied(true)}>Apply region settings</Button>
            <Button variant="outlined" onClick={() => { setShippingRegion('SG'); setContentLocale('en-US'); setApplied(false); }}>Cancel</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
