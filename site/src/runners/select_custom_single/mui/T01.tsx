'use client';

/**
 * select_custom_single-mui-T01: Set Favorite color to Blue
 *
 * Layout: centered isolated card titled "Profile".
 * The card contains one MUI (Material) Select labeled "Favorite color" inside a FormControl with an InputLabel.
 * The Select is default size with comfortable spacing.
 *
 * Initial state: the selected value shown in the closed select is "Green".
 * When opened, the menu appears below the control as a popover with 4 MenuItems.
 * Each MenuItem is custom-rendered with a small colored dot icon on the left and the color name as text on the right:
 * Red, Green, Blue, Purple.
 *
 * Feedback: selecting an item immediately updates the closed Select display; no Apply/OK button.
 * No other selects or interactive controls are present.
 *
 * Success: The MUI Select labeled "Favorite color" has selected value exactly "Blue".
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Circle } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import type { TaskComponentProps } from '../types';

const colors = [
  { label: 'Red', value: 'Red', color: '#f44336' },
  { label: 'Green', value: 'Green', color: '#4caf50' },
  { label: 'Blue', value: 'Blue', color: '#2196f3' },
  { label: 'Purple', value: 'Purple', color: '#9c27b0' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('Green');

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (newValue === 'Blue') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Profile</Typography>
        <FormControl fullWidth>
          <InputLabel id="favorite-color-label">Favorite color</InputLabel>
          <Select
            labelId="favorite-color-label"
            id="favorite-color-select"
            data-testid="favorite-color-select"
            value={value}
            label="Favorite color"
            onChange={handleChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Circle sx={{ fontSize: 16, color: colors.find(c => c.value === selected)?.color }} />
                {selected}
              </Box>
            )}
          >
            {colors.map((color) => (
              <MenuItem key={color.value} value={color.value}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Circle sx={{ fontSize: 16, color: color.color }} />
                </ListItemIcon>
                <ListItemText>{color.label}</ListItemText>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}
