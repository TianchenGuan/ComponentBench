'use client';

/**
 * stepper-mui-T04: Alternative label (MUI): choose Review order
 *
 * Layout: form_section with header and helper text.
 * Component: MUI Stepper with alternativeLabel (labels below icons).
 * StepButton makes step labels clickable.
 * Steps: "Address" → "Delivery" → "Payment" → "Review order".
 * Initial state: activeStep = 1 ("Delivery").
 * Success: Active step label is "Review order" (step 4, index 3).
 */

import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepButton,
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const steps = ['Address', 'Delivery', 'Payment', 'Review order'];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [activeStep, setActiveStep] = useState(1); // Start at "Delivery"

  const handleStep = (step: number) => {
    setActiveStep(step);
    if (step === 3) {
      onSuccess();
    }
  };

  return (
    <Box sx={{ width: 600 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Checkout
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
        Complete all steps to place your order.
      </Typography>

      <Card>
        <CardContent>
          <Stepper
            nonLinear
            activeStep={activeStep}
            alternativeLabel
            data-testid="mui-stepper-checkout-alt"
          >
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

          {/* Distractors */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <TextField
              label="Promo code"
              size="small"
              disabled
              sx={{ width: 150 }}
            />
            <TextField
              label="Gift message"
              size="small"
              disabled
              sx={{ width: 200 }}
            />
          </Box>
          <Button disabled sx={{ mt: 2 }}>
            Save for later
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
