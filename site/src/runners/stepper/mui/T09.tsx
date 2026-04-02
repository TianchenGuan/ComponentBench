'use client';

/**
 * stepper-mui-T09: Compact scroll (MUI): find Advanced settings step
 *
 * Layout: isolated_card centered on the page.
 * Spacing/scale: spacing=compact and scale=small.
 * Component: MUI Stepper with 10 steps in horizontal overflow.
 * Steps: "Intro" → "Basics" → "Permissions" → "Notifications" → "Integrations" →
 *        "Billing" → "Logs" → "Advanced settings" → "Review" → "Done".
 * StepButton for clickable steps.
 * Initial state: activeStep = 0 ("Intro").
 * Success: Active step label is "Advanced settings" (step 8, index 7).
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

const steps = [
  'Intro',
  'Basics',
  'Permissions',
  'Notifications',
  'Integrations',
  'Billing',
  'Logs',
  'Advanced settings',
  'Review',
  'Done',
];

const TARGET_STEP_INDEX = 7;
const TARGET_STEP_LABEL = 'Advanced settings';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step: number) => {
    setActiveStep(step);
    if (step === TARGET_STEP_INDEX) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader
        title="Compact Stepper"
        subheader="Scroll right to find more steps"
      />
      <CardContent sx={{ p: 1.5 }}>
        {/* Mini-map reference */}
        <Box
          sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}
          data-testid="stepper-minimap"
        >
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', mb: 1 }}>
            {steps.map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: idx === TARGET_STEP_INDEX ? '#1976d2' : '#ccc',
                }}
              />
            ))}
          </Box>
          <Typography variant="caption" sx={{ color: '#666' }}>
            Target: <strong>{TARGET_STEP_LABEL}</strong>
          </Typography>
        </Box>

        {/* Scrollable stepper header */}
        <Box
          sx={{ overflowX: 'auto', pb: 1 }}
          data-testid="stepper-header-scroll"
        >
          <Stepper
            nonLinear
            activeStep={activeStep}
            sx={{ minWidth: 1200 }}
            data-testid="mui-stepper-compact"
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton onClick={() => handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ mt: 2, p: 1.5, bgcolor: '#fafafa', borderRadius: 1 }}>
          <Typography variant="body2">
            Current step: {steps[activeStep]}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
