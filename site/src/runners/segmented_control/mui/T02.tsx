'use client';

/**
 * segmented_control-mui-T02: Text alignment → Center
 *
 * Layout: isolated card centered titled "Editor".
 * The card includes one ToggleButtonGroup labeled "Text alignment" with three text options:
 * "Left", "Center", "Right".
 *
 * Initial state: "Left" is selected.
 * No other controls are required; selection changes are immediate.
 *
 * Success: The "Text alignment" ToggleButtonGroup selected value = Center.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = ['Left', 'Center', 'Right'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('Left');

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value !== null) {
      setSelected(value);
      if (value === 'Center') {
        onSuccess();
      }
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Editor</Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Text alignment
        </Typography>
        <ToggleButtonGroup
          data-testid="text-alignment"
          data-canonical-type="segmented_control"
          data-selected-value={selected}
          value={selected}
          exclusive
          onChange={handleChange}
          aria-label="Text alignment"
        >
          {options.map(option => (
            <ToggleButton key={option} value={option} aria-label={option}>
              {option}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  );
}
