'use client';

/**
 * meter-mui-T07: Scroll to Daily Usage meter and set to 60% (MUI)
 *
 * Setup Description:
 * A settings_panel layout shows a vertically scrollable page with multiple sections (General, Notifications, Usage).
 * - Layout: settings_panel; the page content exceeds the viewport height.
 * - Placement: center (standard page flow).
 * - Clutter: medium (many toggles and text fields across sections).
 * - Component: one MUI LinearProgress meter labeled "Daily Usage" located in the "Usage" section near the bottom.
 * - Spacing/scale: comfortable, default.
 * - Instances: 1 meter on the page.
 * - Initial state: 35%.
 * - Interaction: click on the meter bar to set the value; the percent label is shown to the right.
 * - Feedback: immediate; no Apply. A small inline helper text "Daily target: 60%" appears near the meter 
 *   label (this is guidance text, not a control).
 *
 * Success: Daily Usage meter value is 60% (±2 percentage points).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress, TextField, Switch, FormControlLabel, Divider } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(35);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(value - 60) <= 2 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Box sx={{ maxHeight: 400, overflowY: 'auto', width: 500 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* General Section */}
        <Typography variant="h6" gutterBottom>
          General
        </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField label="Display name" defaultValue="User" size="small" fullWidth sx={{ mb: 2 }} />
          <TextField label="Email" defaultValue="user@example.com" size="small" fullWidth sx={{ mb: 2 }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Enable dark mode" />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Notifications Section */}
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel control={<Switch defaultChecked />} label="Email notifications" />
          <FormControlLabel control={<Switch />} label="Push notifications" />
          <FormControlLabel control={<Switch defaultChecked />} label="Weekly digest" />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Privacy Section (distractor) */}
        <Typography variant="h6" gutterBottom>
          Privacy
        </Typography>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel control={<Switch defaultChecked />} label="Show online status" />
          <FormControlLabel control={<Switch />} label="Allow analytics" />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Usage Section - target meter */}
        <Typography variant="h6" gutterBottom>
          Usage
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
            Daily Usage
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Daily target: 60%
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              onClick={handleClick}
              sx={{ flex: 1, cursor: 'pointer' }}
              data-testid="meter-daily-usage"
              data-meter-value={value}
              role="meter"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Daily Usage"
            >
              <LinearProgress variant="determinate" value={value} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
              {value}%
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
