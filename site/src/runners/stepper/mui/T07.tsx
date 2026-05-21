'use client';

/**
 * stepper-mui-T07: Two steppers (MUI): set Mobile setup to Notifications
 *
 * Layout: settings_panel with two configuration cards stacked.
 * Two MUI Steppers: "Desktop setup" (distractor) and "Mobile setup" (TARGET).
 * Desktop steps: "Layout" → "Theme" → "Review".
 * Mobile steps: "Permissions" → "Notifications" → "Review".
 * Initial state: Desktop activeStep = 1 ("Theme"), Mobile activeStep = 0 ("Permissions").
 * Success: Mobile setup active step is "Notifications" (index 1).
 */

import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepButton,
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { TaskComponentProps } from '../types';

const desktopSteps = ['Layout', 'Theme', 'Review'];
const mobileSteps = ['Permissions', 'Notifications', 'Review'];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [desktopStep, setDesktopStep] = useState(1); // Start at "Theme"
  const [mobileStep, setMobileStep] = useState(0); // Start at "Permissions"

  const handleMobileStep = (step: number) => {
    setMobileStep(step);
    if (step === 1) {
      onSuccess();
    }
  };

  return (
    <Box sx={{ width: 550 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Settings
      </Typography>

      <Card sx={{ mb: 2 }} data-testid="stepper-desktop">
        <CardHeader
          title="Desktop setup"
          action={
            <IconButton size="small">
              <HelpOutlineIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Stepper nonLinear activeStep={desktopStep}>
            {desktopSteps.map((label, index) => (
              <Step key={label}>
                <StepButton onClick={() => setDesktopStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <Typography
            variant="body2"
            sx={{ mt: 2, color: '#1976d2', cursor: 'pointer' }}
          >
            Learn more
          </Typography>
        </CardContent>
      </Card>

      <Card data-testid="stepper-mobile">
        <CardHeader
          title="Mobile setup"
          action={
            <IconButton size="small">
              <HelpOutlineIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Stepper nonLinear activeStep={mobileStep}>
            {mobileSteps.map((label, index) => (
              <Step key={label}>
                <StepButton onClick={() => handleMobileStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <Typography
            variant="body2"
            sx={{ mt: 2, color: '#1976d2', cursor: 'pointer' }}
          >
            Learn more
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
