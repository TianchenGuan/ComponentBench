'use client';

/**
 * autocomplete_restricted-mui-T03: Clear a selected shipping speed
 *
 * setup_description:
 * The UI is an isolated card titled "Checkout".
 *
 * It contains one Material UI Autocomplete labeled **Shipping speed**.
 * - Theme: light; spacing: comfortable; size: default.
 * - Initial state: the value **Standard (3–5 days)** is selected.
 * - The component shows the standard clear (X) icon when it has a value, plus a popup indicator.
 * - Options in the listbox: Standard (3–5 days), Expedited (2 days), Overnight (1 day).
 * - Restricted mode: the value must be one of these options.
 *
 * There is no submit button; success is only when the selection is cleared (empty).
 *
 * Success: The "Shipping speed" Autocomplete has no selected value (empty/cleared).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { TaskComponentProps } from '../types';

const shippingSpeeds = [
  'Standard (3–5 days)',
  'Expedited (2 days)',
  'Overnight (1 day)',
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Standard (3–5 days)');
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === null) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Checkout
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Shipping speed
        </Typography>
        <Autocomplete
          data-testid="shipping-speed-autocomplete"
          options={shippingSpeeds}
          value={value}
          onChange={(_event, newValue) => setValue(newValue)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select shipping" size="small" />
          )}
          freeSolo={false}
        />
      </CardContent>
    </Card>
  );
}
