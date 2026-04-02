'use client';

/**
 * autocomplete_restricted-mui-T07: Dark theme notification sound selection
 *
 * setup_description:
 * The page is styled as a **settings panel** with a dark theme (dark background, light text), centered in the viewport.
 *
 * The panel contains several controls as realistic clutter:
 * - Toggle: Enable notifications (on)
 * - Slider: Volume (60%)
 * - **Notification sound** (Material UI Autocomplete)  ← target
 * - Button: Test sound
 *
 * Notification sound Autocomplete details:
 * - Theme: **dark**; spacing: comfortable; size: default.
 * - Restricted (freeSolo=false), options: Beep, Chime, Ding, Pop, Silent.
 * - Initial state: Beep selected.
 * - The popup indicator is visible; selecting an option commits immediately.
 *
 * No "Save changes" action is required for success; only the Autocomplete value matters.
 *
 * Success: The "Notification sound" Autocomplete has selected value "Chime".
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Switch,
  Slider,
  Button,
  FormControlLabel,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const sounds = ['Beep', 'Chime', 'Ding', 'Pop', 'Silent'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Beep');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [volume, setVolume] = useState(60);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Chime') {
      onSuccess();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Card sx={{ width: 400, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Settings
          </Typography>
          <Stack spacing={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
              }
              label="Enable notifications"
            />

            <div>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Volume ({volume}%)</Typography>
              <Slider
                value={volume}
                onChange={(_e, val) => setVolume(val as number)}
                aria-labelledby="volume-slider"
              />
            </div>

            <div>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Notification sound</Typography>
              <Autocomplete
                data-testid="notification-sound-autocomplete"
                options={sounds}
                value={value}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select sound" size="small" />
                )}
                freeSolo={false}
              />
            </div>

            <Button variant="outlined" size="small">
              Test sound
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
