'use client';

/**
 * checkbox_tristate-mui-T03: Bottom-right card: enable Location access
 *
 * Layout: isolated card anchored near the bottom-right of the viewport
 * (slightly away from the edges).
 * The card contains a single MUI tri-state checkbox labeled "Location access"
 * with helper text ("Allow precise location").
 * Initial state: Unchecked.
 * No other controls are required. A small "Learn more" link is present as a distractor.
 * 
 * Success: checkbox is Checked.
 */

import React, { useState } from 'react';
import { Card, CardContent, FormControlLabel, Checkbox, Typography, Link, Box } from '@mui/material';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('unchecked');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'checked') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={state === 'checked'}
              indeterminate={state === 'indeterminate'}
              onClick={handleClick}
              data-testid="location-access-checkbox"
            />
          }
          label="Location access"
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, ml: 4 }}>
          Allow precise location
        </Typography>
        <Box sx={{ mt: 2, ml: 4 }}>
          <Link href="#" variant="caption" underline="hover">
            Learn more
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}
