'use client';

/**
 * radio_group-mui-T05: Plan drawer: upgrade to Pro and apply
 *
 * The main page shows a centered card titled "Plan" with a button labeled "Change plan".
 * Clicking the button opens a right-side drawer (drawer_flow) that slides in and occupies the right third of the viewport (placement perceived as bottom-right due to anchor).
 * Inside the drawer is one RadioGroup labeled "Plan tier" with options:
 * - Starter
 * - Pro
 * - Business
 * Initial state: Starter is selected.
 * At the bottom of the drawer is a sticky footer with two buttons: "Close" and a primary "Apply".
 * The plan shown on the main card only updates after pressing "Apply"; closing the drawer without applying discards changes.
 *
 * Success: Persisted plan tier equals "pro" (label "Pro").
 *          Clicking the "Apply" button in the drawer is required.
 */

import React, { useState, useRef } from 'react';
import {
  Card, CardContent, Typography, Button, Drawer, Box,
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Starter', value: 'starter' },
  { label: 'Pro', value: 'pro' },
  { label: 'Business', value: 'business' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [persistedValue, setPersistedValue] = useState<string>('starter');
  const [tempValue, setTempValue] = useState<string>('starter');
  const hasSucceeded = useRef(false);

  const handleOpenDrawer = () => {
    setTempValue(persistedValue);
    setDrawerOpen(true);
  };

  const handleApply = () => {
    setPersistedValue(tempValue);
    setDrawerOpen(false);
    if (tempValue === 'pro' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  const handleClose = () => {
    setTempValue(persistedValue);
    setDrawerOpen(false);
  };

  const persistedLabel = options.find(o => o.value === persistedValue)?.label || '';

  return (
    <>
      <Card sx={{ width: 360 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Plan</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current plan: {persistedLabel}
          </Typography>
          <Button variant="contained" onClick={handleOpenDrawer}>
            Change plan
          </Button>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleClose}
      >
        <Box sx={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>Change plan</Typography>
            
            <FormControl component="fieldset" data-canonical-type="radio_group" data-selected-value={tempValue}>
              <FormLabel component="legend">Plan tier</FormLabel>
              <RadioGroup 
                value={tempValue} 
                onChange={(e) => setTempValue(e.target.value)}
              >
                {options.map(option => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleClose}>Close</Button>
            <Button variant="contained" onClick={handleApply} data-testid="btn-apply">Apply</Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
