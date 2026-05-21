'use client';

/**
 * icon_button-mui-T02: Toggle Mute microphone On
 *
 * Layout: isolated_card centered in the viewport.
 * A card titled "Call controls" contains one control row labeled "Mute microphone".
 * 
 * Success: The "Mute microphone" IconButton has aria-pressed="true".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [muted, setMuted] = useState(false);

  const handleToggle = () => {
    const newState = !muted;
    setMuted(newState);
    if (newState) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Call controls
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="body1">
            Mute microphone: {muted ? 'On' : 'Off'}
          </Typography>
          <IconButton
            onClick={handleToggle}
            aria-label="Mute microphone"
            aria-pressed={muted}
            data-testid="mui-icon-btn-mute"
            color={muted ? 'primary' : 'default'}
          >
            {muted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
