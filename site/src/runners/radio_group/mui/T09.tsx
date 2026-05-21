'use client';

/**
 * radio_group-mui-T09: Dark settings: scroll to Email digest frequency and set Weekly
 *
 * A dark-themed settings_panel fills the center of the viewport and is internally scrollable.
 * The panel includes several sections with distractor controls (toggle switches, a Select dropdown, and text fields) under headers like "General", "Privacy", and "Notifications".
 * The target MUI RadioGroup labeled "Email digest frequency" is in the "Notifications" section near the bottom.
 * Options: Off, Daily, Weekly, Monthly. Initial state: Daily.
 * When the selection changes, a snackbar appears at the bottom of the panel for a moment ("Saved"). There is no Apply button.
 * Dark theme + multiple sections increase the chance of scrolling past or confusing similar headings.
 *
 * Success: The "Email digest frequency" RadioGroup selected value equals "weekly" (label "Weekly").
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, Switch, Select, MenuItem,
  TextField, Box, Divider, Snackbar, Alert
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [frequency, setFrequency] = useState<string>('daily');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFrequency(value);
    setSnackbarOpen(true);
    if (value === 'weekly') {
      onSuccess();
    }
  };

  const cardStyles = {
    width: 380,
    maxHeight: 420,
    bgcolor: '#1e1e1e',
    color: '#fff',
  };

  const labelStyles = { color: '#b0b0b0' };
  const headingStyles = { color: '#fff', mb: 2 };

  return (
    <>
      <Card sx={cardStyles}>
        <CardContent sx={{ p: 0 }}>
          <Box
            data-testid="settings-scroll"
            sx={{ 
              height: 380, 
              overflowY: 'auto', 
              p: 2,
              '&::-webkit-scrollbar': { width: 8 },
              '&::-webkit-scrollbar-track': { bgcolor: '#2a2a2a' },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#555', borderRadius: 4 },
            }}
          >
            <Typography variant="h6" sx={{ ...headingStyles, mb: 3 }}>Settings</Typography>

            {/* General section */}
            <Typography variant="subtitle2" sx={headingStyles}>General</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={labelStyles}>Dark mode</Typography>
              <Switch defaultChecked sx={{ '& .MuiSwitch-thumb': { bgcolor: '#90caf9' } }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={labelStyles}>Auto-update</Typography>
              <Switch sx={{ '& .MuiSwitch-thumb': { bgcolor: '#90caf9' } }} />
            </Box>

            <Divider sx={{ bgcolor: '#424242', my: 2 }} />

            {/* Privacy section */}
            <Typography variant="subtitle2" sx={headingStyles}>Privacy</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ ...labelStyles, mb: 0.5, fontSize: 13 }}>Data retention</Typography>
              <Select 
                defaultValue="1year" 
                size="small" 
                fullWidth
                sx={{ 
                  bgcolor: '#2a2a2a', 
                  color: '#fff',
                  '& .MuiSelect-icon': { color: '#888' }
                }}
              >
                <MenuItem value="30days">30 days</MenuItem>
                <MenuItem value="90days">90 days</MenuItem>
                <MenuItem value="1year">1 year</MenuItem>
              </Select>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ ...labelStyles, mb: 0.5, fontSize: 13 }}>Display name</Typography>
              <TextField 
                size="small" 
                fullWidth 
                defaultValue="User123"
                sx={{ 
                  '& .MuiOutlinedInput-root': { bgcolor: '#2a2a2a', color: '#fff' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#424242' }
                }}
              />
            </Box>

            <Divider sx={{ bgcolor: '#424242', my: 2 }} />

            {/* Notifications section (target) */}
            <Typography variant="subtitle2" sx={headingStyles}>Notifications</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={labelStyles}>Push notifications</Typography>
              <Switch defaultChecked sx={{ '& .MuiSwitch-thumb': { bgcolor: '#90caf9' } }} />
            </Box>
            
            <FormControl component="fieldset" data-canonical-type="radio_group" data-selected-value={frequency}>
              <FormLabel component="legend" sx={{ ...labelStyles, fontSize: 13 }}>Email digest frequency</FormLabel>
              <RadioGroup value={frequency} onChange={handleChange}>
                <FormControlLabel 
                  value="off" 
                  control={<Radio size="small" sx={{ color: '#888', '&.Mui-checked': { color: '#90caf9' } }} />} 
                  label="Off" 
                  sx={{ '& .MuiFormControlLabel-label': { color: '#ccc' } }}
                />
                <FormControlLabel 
                  value="daily" 
                  control={<Radio size="small" sx={{ color: '#888', '&.Mui-checked': { color: '#90caf9' } }} />} 
                  label="Daily" 
                  sx={{ '& .MuiFormControlLabel-label': { color: '#ccc' } }}
                />
                <FormControlLabel 
                  value="weekly" 
                  control={<Radio size="small" sx={{ color: '#888', '&.Mui-checked': { color: '#90caf9' } }} />} 
                  label="Weekly" 
                  sx={{ '& .MuiFormControlLabel-label': { color: '#ccc' } }}
                />
                <FormControlLabel 
                  value="monthly" 
                  control={<Radio size="small" sx={{ color: '#888', '&.Mui-checked': { color: '#90caf9' } }} />} 
                  label="Monthly" 
                  sx={{ '& .MuiFormControlLabel-label': { color: '#ccc' } }}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Saved
        </Alert>
      </Snackbar>
    </>
  );
}
