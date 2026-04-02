'use client';

/**
 * stepper-mui-T05: Vertical (MUI): disclose Permissions step
 *
 * Layout: isolated_card anchored near top-left (placement=top_left).
 * Component: MUI Stepper in vertical orientation with StepContent panels.
 * Steps: "Profile" → "Security" → "Permissions" → "Notifications".
 * StepButton enables clicking a header to expand its content.
 * Initial state: activeStep = 0 ("Profile").
 * Success: Active step label is "Permissions" (step 3, index 2).
 */

import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepButton,
  StepContent,
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const steps = [
  { label: 'Profile', content: 'Configure your profile settings.' },
  { label: 'Security', content: 'Set up security options.' },
  { label: 'Permissions', content: 'Manage permissions and access levels.' },
  { label: 'Notifications', content: 'Choose your notification preferences.' },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step: number) => {
    setActiveStep(step);
    if (step === 2) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardHeader title="Setup" />
      <CardContent>
        <Stepper
          nonLinear
          activeStep={activeStep}
          orientation="vertical"
          data-testid="mui-stepper-setup-vertical"
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepButton onClick={() => handleStep(index)}>
                {step.label}
              </StepButton>
              <StepContent>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {step.content}
                </Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {/* Static code snippet block */}
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, fontFamily: 'monospace', fontSize: 12 }}>
          <div style={{ color: '#666' }}>// Config sample</div>
          <div>{"{ active: " + activeStep + " }"}</div>
        </Box>
      </CardContent>
    </Card>
  );
}
