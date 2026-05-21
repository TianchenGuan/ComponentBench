'use client';

/**
 * autocomplete_restricted-mui-v2-T01
 *
 * Settings panel with two MUI Autocomplete controls side by side:
 * Shipping channel (Email) and Billing channel (SMS). High clutter with switches and helper text.
 * Success: Billing channel cleared to null, Shipping channel remains Email, Save channels clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import type { TaskComponentProps } from '../../types';

const channelOptions = ['Email', 'SMS', 'Push', 'Slack', 'Webhook'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [shipping, setShipping] = useState<string | null>('Email');
  const [billing, setBilling] = useState<string | null>('SMS');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && billing === null && shipping === 'Email') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, billing, shipping, onSuccess]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 3 }}>
      <Paper sx={{ p: 2, width: 440 }}>
        <Typography variant="h6" gutterBottom>Channels</Typography>

        <FormControlLabel control={<Switch defaultChecked size="small" />} label="Enable notifications" />
        <FormControlLabel control={<Switch size="small" />} label="Batch delivery" />
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
          Batched delivery groups messages into 15-minute windows.
        </Typography>

        <FormControl size="small" fullWidth sx={{ mb: 2 }}>
          <InputLabel>Priority</InputLabel>
          <Select defaultValue="normal" label="Priority">
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Autocomplete
            size="small"
            options={channelOptions}
            value={shipping}
            onChange={(_, v) => { setShipping(v); setSaved(false); }}
            renderInput={(params) => <TextField {...params} label="Shipping channel" />}
            sx={{ flex: 1 }}
            freeSolo={false}
            disableClearable={false}
          />
          <Autocomplete
            size="small"
            options={channelOptions}
            value={billing}
            onChange={(_, v) => { setBilling(v); setSaved(false); }}
            renderInput={(params) => <TextField {...params} label="Billing channel" />}
            sx={{ flex: 1 }}
            freeSolo={false}
            disableClearable={false}
          />
        </Box>

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          Leave a channel empty to disable that notification path.
        </Typography>

        <Button variant="contained" size="small" onClick={() => setSaved(true)}>
          Save channels
        </Button>
      </Paper>
    </Box>
  );
}
