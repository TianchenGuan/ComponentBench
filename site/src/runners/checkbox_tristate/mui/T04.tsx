'use client';

/**
 * checkbox_tristate-mui-T04: Clear Product updates (Unchecked)
 *
 * Layout: form_section titled "Notification preferences".
 * There are two MUI tri-state checkboxes (FormControlLabel) stacked with short descriptions:
 * - "Marketing emails"
 * - "Product updates" (target)
 *
 * Initial state:
 * - Marketing emails: Indeterminate
 * - Product updates: Checked
 *
 * Clutter: low. Beneath them is a non-required text field "Preferred send time".
 * No Save button; checkbox changes apply immediately.
 * 
 * Success: "Product updates" is Unchecked.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, FormControlLabel, Checkbox, TextField, Box } from '@mui/material';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [marketingState, setMarketingState] = useState<TristateValue>('indeterminate');
  const [productState, setProductState] = useState<TristateValue>('checked');

  const handleMarketingClick = () => {
    setMarketingState(cycleTristateValue(marketingState));
  };

  const handleProductClick = () => {
    const newState = cycleTristateValue(productState);
    setProductState(newState);
    if (newState === 'unchecked') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Notification preferences" titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={marketingState === 'checked'}
                indeterminate={marketingState === 'indeterminate'}
                onClick={handleMarketingClick}
                data-testid="marketing-emails-checkbox"
              />
            }
            label="Marketing emails"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={productState === 'checked'}
                indeterminate={productState === 'indeterminate'}
                onClick={handleProductClick}
                data-testid="product-updates-checkbox"
              />
            }
            label="Product updates"
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField
            label="Preferred send time"
            size="small"
            fullWidth
            placeholder="e.g., 9:00 AM"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
