'use client';

/**
 * select_custom_single-mui-T06: Reset Alert level to None
 *
 * Layout: form_section titled "Notification settings".
 * The form has comfortable spacing and default-sized controls.
 *
 * The target is a single MUI Select labeled "Alert level".
 * Initial state: the Select currently shows "High".
 *
 * The menu options are: None, Low, Medium, High.
 * "None" is the explicit reset state (value = empty/none in app logic, but shown as the word "None" in the UI).
 *
 * Clutter: the form section also includes a text field "Email address" and a checkbox "Send SMS".
 * These are distractors and do not affect success.
 *
 * Feedback: selecting an option updates the displayed value immediately. No Save/Apply button is required.
 *
 * Success: The MUI Select labeled "Alert level" has selected value exactly "None".
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
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { TaskComponentProps } from '../types';

const alertLevels = ['None', 'Low', 'Medium', 'High'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [alertLevel, setAlertLevel] = useState<string>('High');

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setAlertLevel(newValue);
    if (newValue === 'None') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Notification settings</Typography>
        
        <TextField
          fullWidth
          label="Email address"
          placeholder="you@example.com"
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="alert-level-label">Alert level</InputLabel>
          <Select
            labelId="alert-level-label"
            id="alert-level-select"
            data-testid="alert-level-select"
            value={alertLevel}
            label="Alert level"
            onChange={handleChange}
          >
            {alertLevels.map((level) => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <FormControlLabel control={<Checkbox />} label="Send SMS" />
        </Box>
      </CardContent>
    </Card>
  );
}
