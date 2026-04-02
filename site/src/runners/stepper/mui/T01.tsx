'use client';

/**
 * stepper-mui-T01: Checkout (MUI): advance to Shipping
 *
 * Layout: isolated_card centered on the page.
 * Component: MUI Stepper in linear horizontal configuration.
 * Steps: "Cart" → "Shipping" → "Payment".
 * Step headers use StepLabel (not StepButton) - not clickable.
 * Navigation via "Back" (disabled on first) and "Next" buttons.
 * Initial state: activeStep = 0 ("Cart").
 * Success: Active step label is "Shipping" (step 2, index 1).
 */

import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const steps = ['Cart', 'Shipping', 'Payment'];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    if (nextStep === 1) {
      onSuccess();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader title="Checkout" />
      <CardContent>
        <Stepper activeStep={activeStep} data-testid="mui-stepper-checkout">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography>Step content: {steps[activeStep]}</Typography>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep >= steps.length - 1}
            data-testid="next"
          >
            Next
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
