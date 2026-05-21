'use client';

/**
 * checkbox_group-mui-T06: Match Target alerts reference
 *
 * Scene: light theme; comfortable spacing; a single isolated card centered in the viewport.
 * Material UI isolated card titled "Team alerts".
 * The card has two columns:
 * - Left: a FormGroup labeled "Alerts to send" with five checkbox options: Outage, Deployment, Security, Billing, Usage.
 * - Right: a "Target alerts" reference box showing two pill chips with icons and text labels.
 * Initial state: Outage is checked by default; all other options are unchecked.
 * Success: The 'Alerts to send' checkbox group matches the Target alerts reference (Security and Billing only).
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, FormControl, FormLabel, 
  FormGroup, FormControlLabel, Checkbox, Box, Chip, Stack
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ReceiptIcon from '@mui/icons-material/Receipt';
import type { TaskComponentProps } from '../types';

const options = ['Outage', 'Deployment', 'Security', 'Billing', 'Usage'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    Outage: true,
    Deployment: false,
    Security: false,
    Billing: false,
    Usage: false,
  });

  useEffect(() => {
    const targetSet = new Set(['Security', 'Billing']);
    const checkedItems = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
    const currentSet = new Set(checkedItems);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected({ ...selected, [name]: event.target.checked });
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Team alerts</Typography>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Left: Checkbox group */}
          <Box sx={{ flex: 1 }}>
            <FormControl component="fieldset" data-testid="cg-alerts-to-send">
              <FormLabel component="legend">Alerts to send</FormLabel>
              <FormGroup>
                {options.map(option => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox 
                        checked={selected[option]} 
                        onChange={handleChange(option)}
                        name={option}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>

          {/* Right: Target reference */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Target alerts
            </Typography>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'grey.100', 
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'grey.300'
            }}>
              <Stack direction="row" spacing={1}>
                <Chip 
                  icon={<SecurityIcon />} 
                  label="Security" 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
                <Chip 
                  icon={<ReceiptIcon />} 
                  label="Billing" 
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
