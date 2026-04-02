'use client';

/**
 * checkbox-mui-T05: Enable line numbers (compact + small checkbox)
 *
 * Layout: isolated card centered in the viewport titled "Editor".
 * Spacing mode is compact and the checkbox uses Material UI's smaller size variant (reduced icon and tighter label spacing).
 * The card contains a single checkbox labeled "Show line numbers" (initially unchecked). No Save/Apply button is present.
 * Distractors: none.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControlLabel, Checkbox } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontSize: 14, fontWeight: 600 }}>
          Editor
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={handleChange}
              size="small"
              data-testid="cb-show-line-numbers"
            />
          }
          label={<Typography sx={{ fontSize: 13 }}>Show line numbers</Typography>}
          sx={{ marginLeft: -0.5 }}
        />
      </CardContent>
    </Card>
  );
}
