'use client';

/**
 * dialog_modal-mui-T07: Navigate to a specific step inside a dialog
 *
 * Layout: form_section centered. The page looks like a simple onboarding card.
 *
 * Clicking "Start onboarding" opens a Material UI Dialog titled "Onboarding".
 * Inside the dialog there are three steps: "Details" → "Preferences" → "Review".
 * At the bottom there are "Back" and "Next" buttons.
 *
 * Initial state: Dialog is closed. If opened, it starts on step "Details".
 * Success: The 'Onboarding' dialog is open and on step 'Review'.
 */

import React, { useState, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const steps = ['Details', 'Preferences', 'Review'];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const successCalledRef = useRef(false);

  const handleOpen = () => {
    setOpen(true);
    setActiveStep(0);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Onboarding',
      step: 'Details',
    };
  };

  const handleClose = () => {
    setOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Onboarding',
      step: null,
    };
  };

  const handleNext = () => {
    const newStep = activeStep + 1;
    setActiveStep(newStep);
    const stepName = steps[newStep];
    
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Onboarding',
      step: stepName,
    };
    
    // Success when reaching Review step
    if (stepName === 'Review' && !successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleBack = () => {
    const newStep = activeStep - 1;
    setActiveStep(newStep);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Onboarding',
      step: steps[newStep],
    };
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return 'Enter your basic details to get started.';
      case 1:
        return 'Configure your preferences for the best experience.';
      case 2:
        return 'Review your choices and confirm to proceed.';
      default:
        return '';
    }
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardHeader title="Welcome" />
        <CardContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Complete the onboarding process to set up your account.
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpen}
            data-testid="cb-start-onboarding"
          >
            Start onboarding
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="onboarding-dialog-title"
        data-testid="dialog-onboarding"
        data-step={steps[activeStep]}
      >
        <DialogTitle id="onboarding-dialog-title">Onboarding</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ pt: 2, pb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Typography variant="h6" gutterBottom>
            {steps[activeStep]}
          </Typography>
          <Typography variant="body2">
            {getStepContent(activeStep)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            data-testid="cb-back"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
            data-testid="cb-next"
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
