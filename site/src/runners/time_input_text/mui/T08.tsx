'use client';

/**
 * time_input_text-mui-T08: Scroll to find a time field in a dark settings panel
 * 
 * Layout: settings_panel in dark theme. The page is a vertically scrollable settings view with many sections.
 * - Above the fold: multiple toggles, dropdowns, and buttons (distractors).
 * - Near the bottom (requires scrolling): a section titled "Maintenance window" containing a MUI X TimeField labeled "Maintenance start time".
 * TimeField configuration: format='HH:mm', clearable=false.
 * Initial state: Maintenance start time is 01:00.
 * Clutter=high due to many unrelated settings controls; however only the Maintenance start time value determines success.
 * 
 * Success: The TimeField labeled "Maintenance start time" has value 02:30 (24-hour).
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, Switch, FormControlLabel, 
  Select, MenuItem, Button, Divider, FormControl, InputLabel 
} from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T08({ onSuccess }: TaskComponentProps) {
  const [maintenanceTime, setMaintenanceTime] = useState<Dayjs | null>(dayjs('01:00', 'HH:mm'));

  useEffect(() => {
    if (maintenanceTime && maintenanceTime.isValid() && maintenanceTime.format('HH:mm') === '02:30') {
      onSuccess();
    }
  }, [maintenanceTime, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={darkTheme}>
        <Card sx={{ width: 450, maxHeight: 500, overflow: 'auto', bgcolor: 'background.paper' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>Settings</Typography>
            
            {/* Distractor sections */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>General</Typography>
              <FormControlLabel control={<Switch defaultChecked />} label="Enable notifications" />
              <FormControlLabel control={<Switch />} label="Dark mode" />
              <FormControlLabel control={<Switch defaultChecked />} label="Auto-save" />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Language & Region</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Language</InputLabel>
                <Select defaultValue="en" label="Language">
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Timezone</InputLabel>
                <Select defaultValue="utc" label="Timezone">
                  <MenuItem value="utc">UTC</MenuItem>
                  <MenuItem value="est">EST</MenuItem>
                  <MenuItem value="pst">PST</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Privacy</Typography>
              <FormControlLabel control={<Switch />} label="Share usage data" />
              <FormControlLabel control={<Switch defaultChecked />} label="Enable cookies" />
              <Button variant="outlined" size="small" sx={{ mt: 1 }}>Manage permissions</Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Notification quiet hours</Typography>
              <FormControlLabel control={<Switch />} label="Enable quiet hours" />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Target section - requires scrolling */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Maintenance window</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                System maintenance occurs during this time window.
              </Typography>
              <Box>
                <Typography component="label" htmlFor="maintenance-time" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                  Maintenance start time
                </Typography>
                <TimeField
                  value={maintenanceTime}
                  onChange={(newValue) => setMaintenanceTime(newValue)}
                  format="HH:mm"
                  slotProps={{
                    textField: {
                      id: 'maintenance-time',
                      fullWidth: true,
                      size: 'small',
                      inputProps: {
                        'data-testid': 'maintenance-start-time',
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
