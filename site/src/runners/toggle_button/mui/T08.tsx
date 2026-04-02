'use client';

/**
 * toggle_button-mui-T18: Enable Do Not Disturb in dark compact dashboard (3 toggles)
 *
 * Layout: dashboard with the main "Quick controls" card centered. Theme is dark and component scale is small.
 * Spacing remains comfortable to avoid extreme crowding. Clutter is medium.
 *
 * The "Quick controls" card contains three MUI ToggleButtons laid out in a row:
 * - "Wi‑Fi"
 * - "Bluetooth"
 * - "Do Not Disturb"  ← target
 *
 * Each uses MUI selected state (aria-pressed) and shows a filled background when On.
 * Initial state: Wi‑Fi is On, Bluetooth is On, Do Not Disturb is Off.
 *
 * The buttons are visually similar and smaller than default, making acquisition and disambiguation harder.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Paper } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import WifiIcon from '@mui/icons-material/Wifi';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import CheckIcon from '@mui/icons-material/Check';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [dnd, setDnd] = useState(false);

  const handleWifi = () => setWifi(!wifi);
  const handleBluetooth = () => setBluetooth(!bluetooth);
  const handleDnd = () => {
    const newDnd = !dnd;
    setDnd(newDnd);
    if (newDnd) {
      onSuccess();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Status tiles (clutter) */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Paper sx={{ p: 1.5, minWidth: 100 }} variant="outlined">
          <Typography variant="caption" color="text.secondary">Battery</Typography>
          <Typography variant="body2">78%</Typography>
        </Paper>
        <Paper sx={{ p: 1.5, minWidth: 100 }} variant="outlined">
          <Typography variant="caption" color="text.secondary">Storage</Typography>
          <Typography variant="body2">45 GB</Typography>
        </Paper>
      </Box>

      {/* Quick controls card */}
      <Card sx={{ width: 450 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick controls
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <ToggleButton
              value="wifi"
              selected={wifi}
              onChange={handleWifi}
              aria-pressed={wifi}
              aria-label="Wi‑Fi"
              data-testid="wifi-toggle"
              size="small"
              color="primary"
            >
              {wifi ? <CheckIcon fontSize="small" sx={{ mr: 0.5 }} /> : <WifiIcon fontSize="small" sx={{ mr: 0.5 }} />}
              Wi‑Fi
            </ToggleButton>

            <ToggleButton
              value="bluetooth"
              selected={bluetooth}
              onChange={handleBluetooth}
              aria-pressed={bluetooth}
              aria-label="Bluetooth"
              data-testid="bluetooth-toggle"
              size="small"
              color="primary"
            >
              {bluetooth ? <CheckIcon fontSize="small" sx={{ mr: 0.5 }} /> : <BluetoothIcon fontSize="small" sx={{ mr: 0.5 }} />}
              Bluetooth
            </ToggleButton>

            <ToggleButton
              value="dnd"
              selected={dnd}
              onChange={handleDnd}
              aria-pressed={dnd}
              aria-label="Do Not Disturb"
              data-testid="dnd-toggle"
              size="small"
              color="primary"
            >
              {dnd ? <CheckIcon fontSize="small" sx={{ mr: 0.5 }} /> : <DoNotDisturbIcon fontSize="small" sx={{ mr: 0.5 }} />}
              Do Not Disturb
            </ToggleButton>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Do Not Disturb: {dnd ? 'On' : 'Off'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
