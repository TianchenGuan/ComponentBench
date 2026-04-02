'use client';

/**
 * stepper-mui-T02: Non-linear (MUI): jump to Payment
 *
 * Layout: isolated_card centered on the page.
 * Component: MUI Stepper in non-linear horizontal configuration with StepButton.
 * Steps: "Details" → "Address" → "Payment" → "Review".
 * StepButton makes each step label clickable.
 * Initial state: activeStep = 0 ("Details").
 * Success: Active step label is "Payment" (step 3, index 2).
 */

import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepButton,
  Button,
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const steps = ['Details', 'Address', 'Payment', 'Review'];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step: number) => {
    setActiveStep(step);
    if (step === 2) {
      onSuccess();
    }
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Card sx={{ width: 550 }}>
      <CardHeader title="Order Setup" />
      <CardContent>
        <Stepper nonLinear activeStep={activeStep} data-testid="mui-stepper-order">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton onClick={() => handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography>Step content: {steps[activeStep]}</Typography>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep >= steps.length - 1}
          >
            Next
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
