'use client';

/**
 * checkbox_tristate-mui-T07: Dark panel: disable Share anonymized data
 *
 * Layout: settings_panel in dark theme (dark surfaces, light text).
 * The panel contains one MUI tri-state checkbox labeled "Share anonymized data"
 * with a short helper line below it ("Used to improve recommendations").
 * Initial state: Indeterminate.
 *
 * Clutter: medium. Nearby are two MUI switches ("Email notifications", "Crash reports"),
 * but they are standard two-state switches, not tri-state checkboxes.
 * No confirm button; state updates instantly.
 * 
 * Success: checkbox is Unchecked.
 */

import React, { useState } from 'react';
import { Card, CardContent, FormControlLabel, Checkbox, Switch, Typography, Box } from '@mui/material';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('indeterminate');
  const [emailNotif, setEmailNotif] = useState(true);
  const [crashReports, setCrashReports] = useState(false);

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'unchecked') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state === 'checked'}
                  indeterminate={state === 'indeterminate'}
                  onClick={handleClick}
                  data-testid="share-anonymized-data-checkbox"
                />
              }
              label="Share anonymized data"
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
              Used to improve recommendations
            </Typography>
          </Box>

          <FormControlLabel
            control={<Switch checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />}
            label="Email notifications"
          />

          <FormControlLabel
            control={<Switch checked={crashReports} onChange={(e) => setCrashReports(e.target.checked)} />}
            label="Crash reports"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
