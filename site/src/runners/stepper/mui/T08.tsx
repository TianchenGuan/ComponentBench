'use client';

/**
 * stepper-mui-T08: Modal import wizard (MUI): set CSV step to Map columns
 *
 * Layout: modal_flow.
 * Toolbar button "Import data…" opens a Modal dialog "Import Wizard".
 * Two MUI Steppers in the modal: "CSV import" (TARGET) and "API import" (distractor).
 * CSV steps: "Upload file" → "Map columns" → "Review" → "Import".
 * API steps: "Connect" → "Choose source" → "Review" → "Import".
 * Initial state (modal): CSV activeStep = 0, API activeStep = 1.
 * Success: CSV import active step is "Map columns" (index 1).
 */

import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardHeader,
  Box,
  Alert,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const csvSteps = ['Upload file', 'Map columns', 'Review', 'Import'];
const apiSteps = ['Connect', 'Choose source', 'Review', 'Import'];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [csvStep, setCsvStep] = useState(0);
  const [apiStep, setApiStep] = useState(1);

  const handleCsvStep = (step: number) => {
    setCsvStep(step);
    if (step === 1) {
      onSuccess();
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Import data…
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        data-testid="import-wizard-modal"
      >
        <DialogTitle>Import Wizard</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Imports can take a few minutes to complete.
          </Alert>

          <Card sx={{ mb: 2 }} data-testid="stepper-csv-import">
            <CardHeader title="CSV import" />
            <CardContent>
              <Stepper nonLinear activeStep={csvStep}>
                {csvSteps.map((label, index) => (
                  <Step key={label}>
                    <StepButton onClick={() => handleCsvStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          <Card data-testid="stepper-api-import">
            <CardHeader title="API import" />
            <CardContent>
              <Stepper nonLinear activeStep={apiStep}>
                {apiSteps.map((label, index) => (
                  <Step key={label}>
                    <StepButton onClick={() => setApiStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained">Continue</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
