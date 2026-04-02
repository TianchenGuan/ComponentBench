'use client';

/**
 * select_custom_single-mui-T03: Choose Medium from an already-open Size menu
 *
 * Layout: centered isolated card titled "T-shirt order".
 * The card contains one MUI Select labeled "T-shirt size".
 *
 * Configuration: the Select uses defaultOpen=true (uncontrolled) so the menu is already open when the page loads.
 * The list of MenuItems is visible immediately.
 *
 * Initial state: no size selected yet (the closed-field display is blank/empty-state, but the menu is open).
 * Options shown: XS, Small, Medium, Large, XL.
 *
 * Selecting an option applies immediately and may close the menu; closing is acceptable as long as the final value is correct.
 * No other inputs are present.
 *
 * Success: The MUI Select labeled "T-shirt size" has selected value exactly "Medium".
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { TaskComponentProps } from '../types';

const sizes = ['XS', 'Small', 'Medium', 'Large', 'XL'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (newValue === 'Medium') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>T-shirt order</Typography>
        <FormControl fullWidth>
          <InputLabel id="tshirt-size-label">T-shirt size</InputLabel>
          <Select
            labelId="tshirt-size-label"
            id="tshirt-size-select"
            data-testid="tshirt-size-select"
            value={value}
            label="T-shirt size"
            onChange={handleChange}
            defaultOpen
          >
            {sizes.map((size) => (
              <MenuItem key={size} value={size}>{size}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}
