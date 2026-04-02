'use client';

/**
 * switch-mui-T04: Choose the correct toggle: SMS alerts
 *
 * Layout: isolated_card centered in the viewport titled "Alerts".
 * Two MUI Switches are shown in a vertical FormGroup with FormControlLabel:
 *   • "Email alerts"
 *   • "SMS alerts" (target)
 * Initial state: "Email alerts" is ON; "SMS alerts" is OFF.
 * The two switches have identical styling and are close together, increasing the chance of toggling the wrong one.
 * Feedback: toggling either switch updates immediately; no snackbar and no Save button.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, FormGroup, FormControlLabel, Switch } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [emailChecked, setEmailChecked] = useState(true);
  const [smsChecked, setSmsChecked] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailChecked(event.target.checked);
  };

  const handleSmsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setSmsChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Alerts
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={emailChecked}
                onChange={handleEmailChange}
                data-testid="email-alerts-switch"
                inputProps={{ 'aria-checked': emailChecked }}
              />
            }
            label="Email alerts"
          />
          <FormControlLabel
            control={
              <Switch
                checked={smsChecked}
                onChange={handleSmsChange}
                data-testid="sms-alerts-switch"
                inputProps={{ 'aria-checked': smsChecked }}
              />
            }
            label="SMS alerts"
          />
        </FormGroup>
      </CardContent>
    </Card>
  );
}
