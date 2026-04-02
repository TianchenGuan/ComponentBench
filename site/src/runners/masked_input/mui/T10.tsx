'use client';

/**
 * masked_input-mui-T10: Enter IBAN after scrolling
 * 
 * Settings panel layout with multiple sections (Profile, Notifications, Security, Bank details) and many unrelated controls.
 * The "Bank details" section is below the fold and must be reached by scrolling.
 * Within that section there is one masked MUI TextField labeled "IBAN (DE)" using a fixed grouping mask with spaces, matching the common DE IBAN display style.
 * The placeholder resembles "DE__ ____ ____ ____ ____ __". The field starts empty and auto-capitalizes letters.
 * 
 * Success: The "IBAN (DE)" masked input value equals "DE89 3704 0044 0532 0130 00".
 */

import React, { useState, useEffect, forwardRef } from 'react';
import { 
  Box, Typography, TextField, Switch, Select, MenuItem, FormControlLabel, Divider, Paper
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const IBANMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
  function IBANMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="aa00 0000 0000 0000 0000 00"
        definitions={{
          'a': /[A-Za-z]/,
          '0': /[0-9]/,
        }}
        prepare={(str: string) => str.toUpperCase()}
        inputRef={ref}
        onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  }
);

export default function T10({ onSuccess }: TaskComponentProps) {
  const [ibanValue, setIbanValue] = useState('');

  useEffect(() => {
    if (ibanValue === 'DE89 3704 0044 0532 0130 00') {
      onSuccess();
    }
  }, [ibanValue, onSuccess]);

  return (
    <Paper 
      sx={{ width: 500, maxHeight: 400, overflowY: 'auto', p: 3 }} 
      data-testid="settings-panel"
    >
      {/* Profile Section */}
      <Typography variant="h6" gutterBottom>Profile</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>Display email in profile</Typography>
        <Switch defaultChecked />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>Profile visibility</Typography>
        <Select defaultValue="public" size="small" sx={{ width: 120 }}>
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="private">Private</MenuItem>
          <MenuItem value="friends">Friends only</MenuItem>
        </Select>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Notifications Section */}
      <Typography variant="h6" gutterBottom>Notifications</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>Email notifications</Typography>
        <Switch defaultChecked />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>Push notifications</Typography>
        <Switch />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>Notification frequency</Typography>
        <Select defaultValue="daily" size="small" sx={{ width: 120 }}>
          <MenuItem value="realtime">Real-time</MenuItem>
          <MenuItem value="daily">Daily digest</MenuItem>
          <MenuItem value="weekly">Weekly digest</MenuItem>
        </Select>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Security Section */}
      <Typography variant="h6" gutterBottom>Security</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>Two-factor authentication</Typography>
        <Switch />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>Login alerts</Typography>
        <Switch defaultChecked />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Bank Details Section - Target field is here */}
      <Typography variant="h6" gutterBottom>Bank details</Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="IBAN (DE)"
          placeholder="DE__ ____ ____ ____ ____ __"
          value={ibanValue}
          onChange={(e) => setIbanValue(e.target.value)}
          slotProps={{
            input: {
              inputComponent: IBANMaskCustom as any,
            },
          }}
          inputProps={{
            'data-testid': 'iban-de',
            style: { fontFamily: 'monospace' },
          }}
          helperText="Enter your German IBAN"
        />
      </Box>
    </Paper>
  );
}
