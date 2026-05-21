'use client';

/**
 * segmented_control-mui-T03: Project visibility → Private
 *
 * Layout: isolated card centered titled "Sharing".
 * One ToggleButtonGroup labeled "Project visibility" is shown with two options:
 * "Public" and "Private".
 *
 * Initial state: "Public" is selected.
 * Selecting an option immediately updates the visibility state (no Save button).
 *
 * Success: The "Project visibility" ToggleButtonGroup selected value = Private.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = ['Public', 'Private'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('Public');

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value !== null) {
      setSelected(value);
      if (value === 'Private') {
        onSuccess();
      }
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Sharing</Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Project visibility
        </Typography>
        <ToggleButtonGroup
          data-testid="project-visibility"
          data-canonical-type="segmented_control"
          data-selected-value={selected}
          value={selected}
          exclusive
          onChange={handleChange}
          aria-label="Project visibility"
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
