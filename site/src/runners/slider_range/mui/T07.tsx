'use client';

/**
 * slider_range-mui-T07: Scroll to find Buffer range in settings panel
 * 
 * Layout: settings_panel with multiple stacked sections (Account, Notifications, Privacy, Playback, Streaming).
 * The page height exceeds the viewport; the "Streaming" section is below the fold and requires scrolling to reach.
 * In the Streaming section there is one MUI range Slider labeled "Buffer range (seconds)".
 * - Slider configuration: min=0, max=10, step=1, range via value array.
 * - Initial state: 1-10 with readout "Selected: 1 - 10".
 * The rest of the page includes realistic clutter: toggles, text fields, and help text, but none affect success.
 * Changes to the slider apply immediately (no Save button).
 * 
 * Success: Target range is set to 2-6 s (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider, Switch, TextField, Divider, Paper } from '@mui/material';
import type { TaskComponentProps } from '../types';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      {children}
      <Divider sx={{ mt: 3 }} />
    </Box>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [bufferRange, setBufferRange] = useState<number[]>([1, 10]);

  useEffect(() => {
    if (bufferRange[0] === 2 && bufferRange[1] === 6) {
      onSuccess();
    }
  }, [bufferRange, onSuccess]);

  const handleBufferChange = (_event: Event, newValue: number | number[]) => {
    setBufferRange(newValue as number[]);
  };

  return (
    <Paper sx={{ width: 500, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Settings
      </Typography>

      <Section title="Account">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Username" defaultValue="user123" size="small" fullWidth />
          <TextField label="Email" defaultValue="user@example.com" size="small" fullWidth />
        </Box>
      </Section>

      <Section title="Notifications">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography>Email notifications</Typography>
          <Switch defaultChecked />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Push notifications</Typography>
          <Switch />
        </Box>
      </Section>

      <Section title="Privacy">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography>Profile visibility</Typography>
          <Switch defaultChecked />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Activity status</Typography>
          <Switch defaultChecked />
        </Box>
      </Section>

      <Section title="Playback">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography>Autoplay</Typography>
          <Switch defaultChecked />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>HD quality</Typography>
          <Switch />
        </Box>
      </Section>

      <Section title="Streaming">
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Buffer range (seconds)
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={bufferRange}
            onChange={handleBufferChange}
            min={0}
            max={10}
            step={1}
            valueLabelDisplay="auto"
            data-testid="buffer-range"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selected: {bufferRange[0]} - {bufferRange[1]}
        </Typography>
      </Section>
    </Paper>
  );
}
