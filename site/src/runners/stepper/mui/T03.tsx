'use client';

/**
 * stepper-mui-T03: Dark theme (MUI): select Security
 *
 * Layout: isolated_card centered on the page, dark theme.
 * Component: MUI Stepper with StepButton (clickable).
 * Steps: "Account" → "Security" → "Recovery".
 * Initial state: activeStep = 0 ("Account").
 * Success: Active step label is "Security" (step 2, index 1).
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
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const steps = ['Account', 'Security', 'Recovery'];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step: number) => {
    setActiveStep(step);
    if (step === 1) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450, bgcolor: '#1f1f1f', color: '#fff' }}>
      <CardHeader
        title="Security Setup"
        sx={{
          color: '#fff',
          borderBottom: '1px solid #333',
        }}
      />
      <CardContent>
        <Stepper
          nonLinear
          activeStep={activeStep}
          data-testid="mui-stepper-security"
          sx={{
            '& .MuiStepLabel-label': { color: '#aaa' },
            '& .MuiStepLabel-label.Mui-active': { color: '#fff' },
            '& .MuiStepIcon-root': { color: '#555' },
            '& .MuiStepIcon-root.Mui-active': { color: '#1976d2' },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton onClick={() => handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: '#888' }}>
            Click on a step to navigate.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
