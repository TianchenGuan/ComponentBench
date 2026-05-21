'use client';

/**
 * switch-mui-T07: Units form: enable metric units
 *
 * Layout: form_section centered in the viewport with heading "Units & formatting".
 * The section includes multiple controls as realistic clutter: a TextField labeled "Date format", a Select labeled "Temperature", and a Switch row.
 * The target switch is labeled "Use metric units" with a short description ("km, kg, °C").
 * Initial state: the switch is OFF.
 * Clutter: medium — nearby fields and helper text can attract attention, but they are not required for success.
 * Feedback: toggling the switch updates immediately (no Save button).
 */

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [metricChecked, setMetricChecked] = useState(false);
  const [temperature, setTemperature] = useState('celsius');

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setMetricChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Units & formatting
        </Typography>
        
        <TextField
          label="Date format"
          defaultValue="MM/DD/YYYY"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Temperature</InputLabel>
          <Select
            value={temperature}
            label="Temperature"
            onChange={(e) => setTemperature(e.target.value)}
          >
            <MenuItem value="celsius">Celsius (°C)</MenuItem>
            <MenuItem value="fahrenheit">Fahrenheit (°F)</MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={metricChecked}
                onChange={handleSwitchChange}
                data-testid="metric-units-switch"
                inputProps={{ 'aria-checked': metricChecked }}
              />
            }
            label="Use metric units"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            km, kg, °C
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
