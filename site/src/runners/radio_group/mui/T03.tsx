'use client';

/**
 * radio_group-mui-T03: Avatar settings: match shape to the preview
 *
 * A centered isolated card titled "Avatar" shows a non-interactive preview image of the desired avatar silhouette (a rounded square) on the left.
 * To the right is a MUI RadioGroup labeled "Avatar shape" with three options. Each option shows a small icon next to the label:
 * - Circle
 * - Square
 * - Rounded square
 * Initial state: Circle is selected.
 * When the selection changes, the preview silhouette updates instantly to match. No Save button is present.
 *
 * Success: The "Avatar shape" RadioGroup selected value equals "rounded_square" (label "Rounded square").
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, Box
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';
import RoundedCornerIcon from '@mui/icons-material/RoundedCorner';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Circle', value: 'circle', icon: <CircleIcon fontSize="small" /> },
  { label: 'Square', value: 'square', icon: <SquareIcon fontSize="small" /> },
  { label: 'Rounded square', value: 'rounded_square', icon: <RoundedCornerIcon fontSize="small" /> },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('circle');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'rounded_square') {
      onSuccess();
    }
  };

  const getPreviewStyles = () => {
    const base = {
      width: 80,
      height: 80,
      backgroundColor: '#e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
    switch (selected) {
      case 'circle': return { ...base, borderRadius: '50%' };
      case 'square': return { ...base, borderRadius: 0 };
      case 'rounded_square': return { ...base, borderRadius: 12 };
      default: return base;
    }
  };

  return (
    <Card sx={{ width: 420 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Avatar</Typography>
        
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          {/* Preview (shows target: rounded square) */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Target shape
            </Typography>
            <Box sx={{ 
              width: 80, 
              height: 80, 
              backgroundColor: '#1976d2',
              borderRadius: 3,
              opacity: 0.3
            }} />
          </Box>

          {/* Current selection preview */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Current
            </Typography>
            <Box sx={getPreviewStyles()} />
          </Box>

          {/* Radio group */}
          <FormControl component="fieldset" data-canonical-type="radio_group" data-selected-value={selected}>
            <FormLabel component="legend">Avatar shape</FormLabel>
            <RadioGroup value={selected} onChange={handleChange}>
              {options.map(option => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.icon}
                      {option.label}
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
}
