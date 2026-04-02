'use client';

/**
 * checkbox_tristate-mui-T01: Set Include attachments to Partial
 *
 * Layout: centered isolated card using Material UI styling.
 * The card contains one MUI Checkbox with a FormControlLabel reading "Include attachments".
 * The checkbox is configured as a tri-state control for this benchmark
 * and cycles through Unchecked → Partial (indeterminate) → Checked when activated.
 * Initial state: Unchecked.
 * A small caption under the control reads "Current: Off / Partial / On" and updates immediately.
 * 
 * Success: checkbox is Indeterminate.
 */

import React, { useState } from 'react';
import { Card, CardContent, FormControlLabel, Checkbox, Typography } from '@mui/material';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('unchecked');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'indeterminate') {
      onSuccess();
    }
  };

  const getDisplayState = () => {
    switch (state) {
      case 'unchecked': return 'Off';
      case 'indeterminate': return 'Partial';
      case 'checked': return 'On';
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={state === 'checked'}
              indeterminate={state === 'indeterminate'}
              onClick={handleClick}
              data-testid="include-attachments-checkbox"
            />
          }
          label="Include attachments"
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, ml: 4 }}>
          Current: {getDisplayState()}
        </Typography>
      </CardContent>
    </Card>
  );
}
