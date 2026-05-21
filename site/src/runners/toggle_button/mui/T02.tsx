'use client';

/**
 * toggle_button-mui-T12: Follow button on (single toggle)
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 *
 * The card is titled "Profile". It contains one MUI ToggleButton labeled "Follow".
 * - Off = not selected (outlined)
 * - On = selected (filled) and aria-pressed becomes true
 *
 * Initial state: Follow is Off. There are no other controls.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState(false);

  const handleChange = () => {
    const newSelected = !selected;
    setSelected(newSelected);
    if (newSelected) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Profile
        </Typography>
        
        <ToggleButton
          value="follow"
          selected={selected}
          onChange={handleChange}
          aria-pressed={selected}
          data-testid="follow-toggle"
          color="primary"
        >
          {selected ? <CheckIcon sx={{ mr: 0.5 }} /> : <PersonAddIcon sx={{ mr: 0.5 }} />}
          Follow
        </ToggleButton>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Follow: {selected ? 'On' : 'Off'}
        </Typography>
      </CardContent>
    </Card>
  );
}
