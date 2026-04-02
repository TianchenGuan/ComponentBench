'use client';

/**
 * select_custom_single-mui-v2-T11: Reset only Alert level to None and save preferences
 *
 * Compact settings panel in a crowded admin page. Three MUI Select controls:
 * "Alert level" (High → None), "Digest cadence" (Daily, must stay), "Channel" (Email, must stay).
 * Alert level menu: None, Low, Medium, High. None is the explicit cleared state.
 * Panel footer: "Save preferences" / "Cancel".
 *
 * Success: Alert level = "None", Digest cadence still "Daily", Channel still "Email",
 * "Save preferences" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Card, CardContent, CardActions, Typography, Button, Select,
  MenuItem, FormControl, InputLabel, Chip, Divider,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const alertOptions = ['None', 'Low', 'Medium', 'High'];
const cadenceOptions = ['Hourly', 'Daily', 'Weekly', 'Monthly'];
const channelOpts = ['Email', 'Slack', 'SMS', 'In-app'];

export default function T11({ onSuccess }: TaskComponentProps) {
  const [alertLevel, setAlertLevel] = useState('High');
  const [digestCadence, setDigestCadence] = useState('Daily');
  const [channel, setChannel] = useState('Email');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && alertLevel === 'None' && digestCadence === 'Daily' && channel === 'Email') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, alertLevel, digestCadence, channel, onSuccess]);

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-start' }}>
      <Box sx={{ maxWidth: 420 }}>
        <Typography variant="h5" gutterBottom>Admin Settings</Typography>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Notification Preferences</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel>Alert level</InputLabel>
                  <Select value={alertLevel} label="Alert level" onChange={(e) => { setAlertLevel(e.target.value); setSaved(false); }}>
                    {alertOptions.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ flex: 1 }}>
                  <InputLabel>Digest cadence</InputLabel>
                  <Select value={digestCadence} label="Digest cadence" onChange={(e) => { setDigestCadence(e.target.value); setSaved(false); }}>
                    {cadenceOptions.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>

              <FormControl size="small" fullWidth>
                <InputLabel>Channel</InputLabel>
                <Select value={channel} label="Channel" onChange={(e) => { setChannel(e.target.value); setSaved(false); }}>
                  {channelOpts.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="Team: Engineering" size="small" variant="outlined" />
              <Chip label="Escalation: Auto" size="small" variant="outlined" />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
            <Button onClick={() => { setAlertLevel('High'); setSaved(false); }}>Cancel</Button>
            <Button variant="contained" onClick={() => setSaved(true)}>Save preferences</Button>
          </CardActions>
        </Card>

        <Card>
          <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
            <Typography variant="caption" color="text.secondary">
              Audit log: 142 events · Last change: 4h ago · Retention: 90 days
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
