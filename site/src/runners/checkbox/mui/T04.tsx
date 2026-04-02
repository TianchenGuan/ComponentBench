'use client';

/**
 * checkbox-mui-T04: Enable timestamps (bottom-left placement)
 *
 * Layout: isolated card anchored near the bottom-left corner of the viewport.
 * The card title is "Time display" and it contains two Material UI checkboxes:
 *   - "Show timestamps" (initially unchecked)  ← target
 *   - "Show time zone" (initially unchecked)
 * No Save/Apply button is present; toggling updates immediately.
 * Distractors: none outside the card.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [timestampsChecked, setTimestampsChecked] = useState(false);
  const [timezoneChecked, setTimezoneChecked] = useState(false);

  const handleTimestampsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setTimestampsChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Time display
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={timestampsChecked}
                onChange={handleTimestampsChange}
                data-testid="cb-show-timestamps"
              />
            }
            label="Show timestamps"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={timezoneChecked}
                onChange={(e) => setTimezoneChecked(e.target.checked)}
                data-testid="cb-show-timezone"
              />
            }
            label="Show time zone"
          />
        </FormGroup>
      </CardContent>
    </Card>
  );
}
