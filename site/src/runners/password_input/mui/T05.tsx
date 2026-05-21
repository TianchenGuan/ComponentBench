'use client';

/**
 * password_input-mui-T05: Update VPN password (two password fields)
 * 
 * A "Network settings" form section contains two MUI TextFields configured as password inputs:
 * - "Wi‑Fi password" (top)
 * - "VPN password" (bottom)
 * Both start empty and have similar helper text and identical styling. No Save button is present.
 * Other non-interactive toggles ("Auto-connect", "Use proxy") appear below as light clutter.
 * 
 * Success: The password field labeled "VPN password" has value exactly "Tunnel-5!A".
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, FormControlLabel, Switch, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [wifiPassword, setWifiPassword] = useState('');
  const [vpnPassword, setVpnPassword] = useState('');

  useEffect(() => {
    if (vpnPassword === 'Tunnel-5!A') {
      onSuccess();
    }
  }, [vpnPassword, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Network settings
        </Typography>
        <TextField
          label="Wi‑Fi password"
          type="password"
          variant="outlined"
          fullWidth
          value={wifiPassword}
          onChange={(e) => setWifiPassword(e.target.value)}
          helperText="Enter your Wi-Fi network password"
          sx={{ mb: 2 }}
          inputProps={{ 'data-testid': 'wifi-password-input' }}
          data-cb-instance="wifi"
        />
        <TextField
          label="VPN password"
          type="password"
          variant="outlined"
          fullWidth
          value={vpnPassword}
          onChange={(e) => setVpnPassword(e.target.value)}
          helperText="Enter your VPN connection password"
          sx={{ mb: 2 }}
          inputProps={{ 'data-testid': 'vpn-password-input' }}
          data-cb-instance="vpn"
        />
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Auto-connect"
          />
          <FormControlLabel
            control={<Switch />}
            label="Use proxy"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
