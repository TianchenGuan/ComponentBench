'use client';

/**
 * switch-mui-T03: Visual match: Location access
 *
 * Layout: isolated_card centered in the viewport with two stacked blocks.
 * The top block labeled "Desired" shows a non-interactive MUI Switch used purely as a visual reference (no ON/OFF text).
 * The bottom block labeled "Your setting" contains the interactive target switch labeled "Location access".
 * Initial state: the reference switch is ON, while the "Location access" switch starts OFF.
 * There is no confirmation button; toggling the target switch changes its state immediately.
 * Clutter: none — no other inputs appear on the page.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControlLabel, Switch, Box, Divider } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);
  const referenceState = true; // Reference is ON

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    if (newChecked === referenceState) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Desired
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Switch
              checked={referenceState}
              disabled
              data-state={referenceState ? 'on' : 'off'}
              inputProps={{ 'aria-checked': referenceState }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
            Reference
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Your setting
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                onChange={handleChange}
                data-testid="location-access-switch"
                inputProps={{ 'aria-checked': checked }}
              />
            }
            label="Location access"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
