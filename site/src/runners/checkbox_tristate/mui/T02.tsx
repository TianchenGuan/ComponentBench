'use client';

/**
 * checkbox_tristate-mui-T02: Match Compress output to desired preview (Checked)
 *
 * Layout: centered isolated card titled "Export options".
 * Left side: one MUI tri-state checkbox labeled "Compress output".
 * Right side: a static "Desired state" preview, rendered as a small non-interactive checkbox icon
 * (MUI icon styling) with no click handler. For this task, the preview shows the checkmark (Checked).
 * Initial state of "Compress output": Indeterminate (dash icon).
 * 
 * Success: checkbox is Checked.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, FormControlLabel, Checkbox, Box, Typography } from '@mui/material';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('indeterminate');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'checked') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardHeader title="Export options" titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={state === 'checked'}
                indeterminate={state === 'indeterminate'}
                onClick={handleClick}
                data-testid="compress-output-checkbox"
              />
            }
            label="Compress output"
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} aria-hidden="true">
            <Checkbox checked disabled sx={{ pointerEvents: 'none' }} />
            <Typography variant="caption" color="text.secondary">
              Desired state
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
