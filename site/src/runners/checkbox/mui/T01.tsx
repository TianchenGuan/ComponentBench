'use client';

/**
 * checkbox-mui-T01: Enable sound effects (single checkbox)
 *
 * Layout: isolated card centered in the viewport.
 * The card title is "Audio". It contains one Material UI Checkbox with a FormControlLabel reading "Enable sound effects".
 * Initial state: unchecked. There is no Save/Apply button; the checked state is applied immediately.
 * Distractors: none.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControlLabel, Checkbox } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Audio
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={handleChange}
              data-testid="cb-sound-effects"
            />
          }
          label="Enable sound effects"
        />
      </CardContent>
    </Card>
  );
}
