'use client';

/**
 * segmented_control-mui-T07: Chart scale → Log (scroll to find)
 *
 * Layout: settings panel with many stacked sections.
 * The target control is a ToggleButtonGroup labeled "Chart scale" with options:
 * "Linear" and "Log".
 *
 * Initial state: "Linear" is selected.
 *
 * The "Chart scale" control appears under an "Advanced chart settings" section that is below the fold,
 * so scrolling is required.
 *
 * Clutter (medium): other unrelated settings (switches for gridlines, a color dropdown, numeric inputs) appear nearby.
 * Changes apply immediately; no confirmation.
 *
 * Success: The "Chart scale" ToggleButtonGroup selected value = Log.
 */

import React, { useState } from 'react';
import {
  Box, Typography, TextField, Switch, FormControlLabel, Select, MenuItem,
  ToggleButton, ToggleButtonGroup, Divider
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const scaleOptions = ['Linear', 'Log'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [chartScale, setChartScale] = useState<string>('Linear');

  const handleScaleChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value !== null) {
      setChartScale(value);
      if (value === 'Log') {
        onSuccess();
      }
    }
  };

  return (
    <Box
      sx={{
        width: 450,
        maxHeight: 350,
        overflowY: 'auto',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: '1px solid #e0e0e0',
      }}
    >
      {/* General Settings Section */}
      <Typography variant="h6" gutterBottom>General Settings</Typography>
      <Box sx={{ mb: 2 }}>
        <TextField fullWidth size="small" label="Chart title" defaultValue="My Chart" sx={{ mb: 1 }} />
        <TextField fullWidth size="small" label="Subtitle" defaultValue="" />
      </Box>
      <Divider sx={{ my: 2 }} />

      {/* Display Section */}
      <Typography variant="h6" gutterBottom>Display</Typography>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel control={<Switch defaultChecked />} label="Show legend" />
        <FormControlLabel control={<Switch defaultChecked />} label="Show tooltips" />
      </Box>
      <Divider sx={{ my: 2 }} />

      {/* Colors Section */}
      <Typography variant="h6" gutterBottom>Colors</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Color scheme</Typography>
        <Select size="small" defaultValue="default" fullWidth>
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="warm">Warm</MenuItem>
          <MenuItem value="cool">Cool</MenuItem>
        </Select>
      </Box>
      <Divider sx={{ my: 2 }} />

      {/* Advanced Chart Settings Section - Target */}
      <Typography variant="h6" gutterBottom id="advanced-chart-settings">Advanced chart settings</Typography>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel control={<Switch />} label="Show gridlines" />
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Chart scale</Typography>
          <ToggleButtonGroup
            data-testid="chart-scale"
            data-canonical-type="segmented_control"
            data-selected-value={chartScale}
            value={chartScale}
            exclusive
            onChange={handleScaleChange}
            aria-label="Chart scale"
            size="small"
          >
            {scaleOptions.map(option => (
              <ToggleButton key={option} value={option} aria-label={option}>
                {option}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField size="small" label="Max data points" type="number" defaultValue={100} />
        </Box>
      </Box>
    </Box>
  );
}
