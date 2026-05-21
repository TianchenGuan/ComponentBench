'use client';

/**
 * stepper-mui-T06: Non-linear (MUI): complete Connect then go to Confirm
 *
 * Layout: settings_panel with mild clutter.
 * Component: MUI Stepper in non-linear configuration with completion tracking.
 * Steps: "Connect" → "Configure" → "Confirm".
 * StepButton for clickable steps.
 * Content panel has "Complete step" button to mark current step completed.
 * Initial state: activeStep = 0 ("Connect"), no completed steps.
 * Success: "Connect" is completed AND activeStep is "Confirm" (index 2).
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const steps = ['Connect', 'Configure', 'Confirm'];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const handleStep = (step: number) => {
    setActiveStep(step);
    // Check success: Connect completed AND active is Confirm
    if (completed[0] && step === 2) {
      onSuccess();
    }
  };

  const handleCompleteStep = () => {
    const newCompleted = { ...completed, [activeStep]: true };
    setCompleted(newCompleted);
  };

  // Check if both conditions are met for success
  React.useEffect(() => {
    if (completed[0] && activeStep === 2) {
      onSuccess();
    }
  }, [completed, activeStep, onSuccess]);

  return (
    <Box sx={{ width: 550 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Integration Settings
      </Typography>

      <Card>
        <CardHeader title="Integration Wizard" />
        <CardContent>
          <Stepper nonLinear activeStep={activeStep} data-testid="mui-stepper-integration">
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton onClick={() => handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography sx={{ mb: 2 }}>
              Step content: {steps[activeStep]}
            </Typography>
            {!completed[activeStep] && (
              <Button
                variant="contained"
                onClick={handleCompleteStep}
                data-testid="complete-step"
              >
                Complete step
              </Button>
            )}
            {completed[activeStep] && (
              <Typography sx={{ color: 'green' }}>
                Step completed!
              </Typography>
            )}
          </Box>

          {/* Distractors */}
          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={<Switch size="small" />}
              label="Enable logging"
            />
            <FormControlLabel
              control={<Switch size="small" />}
              label="Send test event"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
