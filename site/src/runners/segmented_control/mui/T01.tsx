'use client';

/**
 * segmented_control-mui-T01: Calendar view → Week
 *
 * Layout: isolated card centered on the page titled "Calendar".
 * The card contains a Material UI ToggleButtonGroup (exclusive) labeled "Calendar view".
 * - Options: "Day", "Week", "Month" (text labels on the buttons)
 * - Initial state: "Day" is selected.
 * - Default size and comfortable spacing.
 *
 * There is no Apply button; selecting an option immediately updates the selected state.
 *
 * Success: The ToggleButtonGroup labeled "Calendar view" has selected value = Week.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = ['Day', 'Week', 'Month'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('Day');

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value !== null) {
      setSelected(value);
      if (value === 'Week') {
        onSuccess();
      }
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Calendar</Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Calendar view
        </Typography>
        <ToggleButtonGroup
          data-testid="calendar-view"
          data-canonical-type="segmented_control"
          data-selected-value={selected}
          value={selected}
          exclusive
          onChange={handleChange}
          aria-label="Calendar view"
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
