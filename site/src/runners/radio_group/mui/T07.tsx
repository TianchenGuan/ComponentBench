'use client';

/**
 * radio_group-mui-T07: Navigation: restore default landing page using Restore default
 *
 * A settings_panel card titled "Navigation" is centered. It contains one MUI RadioGroup labeled "Default landing page" with options:
 * - Dashboard
 * - Reports
 * - Projects
 * Initial state: "Reports" is selected.
 * Helper text under the group reads "Default: Dashboard".
 * To the right of the label row is a small outlined button labeled "Restore default". Clicking it sets the selection back to Dashboard and shows a snackbar "Restored to default".
 * The radio options are still clickable, but this task is specifically about using the Restore default control (the checker enforces that the reset control was used).
 *
 * Success: The "Default landing page" RadioGroup selected value equals "dashboard" (label "Dashboard").
 *          The "Restore default" control was invoked at least once.
 */

import React, { useState, useRef } from 'react';
import {
  Card, CardContent, Typography, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, Button, Box,
  Snackbar, Alert, FormHelperText
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Reports', value: 'reports' },
  { label: 'Projects', value: 'projects' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('reports');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const resetInvoked = useRef(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelected(value);
    // Only trigger success if reset was invoked and value is dashboard
    if (resetInvoked.current && value === 'dashboard') {
      onSuccess();
    }
  };

  const handleRestore = () => {
    resetInvoked.current = true;
    setSelected('dashboard');
    setSnackbarOpen(true);
    onSuccess();
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Navigation</Typography>

          <FormControl 
            component="fieldset" 
            data-canonical-type="radio_group" 
            data-selected-value={selected}
            data-last-action={resetInvoked.current ? 'restore_default' : undefined}
            fullWidth
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <FormLabel component="legend">Default landing page</FormLabel>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleRestore}
              >
                Restore default
              </Button>
            </Box>
            <RadioGroup value={selected} onChange={handleChange}>
              {options.map(option => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            <FormHelperText>Default: Dashboard</FormHelperText>
          </FormControl>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Restored to default
        </Alert>
      </Snackbar>
    </>
  );
}
