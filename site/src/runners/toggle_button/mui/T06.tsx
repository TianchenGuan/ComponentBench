'use client';

/**
 * toggle_button-mui-T16: Match Sound toggle to target preview
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale. Guidance is visual.
 *
 * The card title is "Notifications". At the top of the card there is a "Target preview" panel that visually shows the desired state:
 * - A small speaker icon with a badge: either a green check (ON) or a gray slash (OFF).
 * - For this task, the preview shows the OFF state (speaker with slash).
 *
 * Below the preview is the interactive MUI ToggleButton labeled "Sound".
 * - Selected state corresponds to Sound ON (aria-pressed=true).
 * - Unselected corresponds to Sound OFF.
 *
 * Initial state: Sound is ON (selected). The agent must match the preview (OFF).
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState(true); // Initial: ON
  const targetState = false; // Target is OFF

  const handleChange = () => {
    const newSelected = !selected;
    setSelected(newSelected);
    if (newSelected === targetState) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        
        {/* Target preview */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Target preview:
          </Typography>
          <Chip
            icon={targetState ? <VolumeUpIcon /> : <VolumeOffIcon />}
            label={targetState ? 'ON' : 'OFF'}
            variant={targetState ? 'filled' : 'outlined'}
            color={targetState ? 'success' : 'default'}
            size="small"
          />
        </Box>

        {/* Interactive toggle */}
        <ToggleButton
          value="sound"
          selected={selected}
          onChange={handleChange}
          aria-pressed={selected}
          data-testid="sound-toggle"
          color="primary"
        >
          {selected ? <VolumeUpIcon sx={{ mr: 0.5 }} /> : <VolumeOffIcon sx={{ mr: 0.5 }} />}
          Sound
        </ToggleButton>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Sound: {selected ? 'On' : 'Off'}
        </Typography>
      </CardContent>
    </Card>
  );
}
