'use client';

/**
 * stepper-mui-T10: Dashboard (MUI): match Provisioning step to preview
 *
 * Layout: dashboard with multiple cards.
 * Three MUI Steppers: "Provisioning" (TARGET), "Deployment", "Incident workflow".
 * Provisioning steps: "Request" → "Allocate" → "Configure" → "Verify" → "Finalize".
 * A preview widget shows which step to match (e.g., "Configure").
 * Initial state: Provisioning activeStep = 0 ("Request").
 * Success: Provisioning active step matches preview (index 2 "Configure").
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
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const provisioningSteps = ['Request', 'Allocate', 'Configure', 'Verify', 'Finalize'];
const deploymentSteps = ['Build', 'Test', 'Review', 'Deploy'];
const incidentSteps = ['Detect', 'Assess', 'Resolve', 'Review'];

const TARGET_STEP_INDEX = 2;
const TARGET_STEP_LABEL = 'Configure';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [provisioningStep, setProvisioningStep] = useState(0);
  const [deploymentStep, setDeploymentStep] = useState(1);
  const [incidentStep, setIncidentStep] = useState(2);

  const handleProvisioningStep = (step: number) => {
    setProvisioningStep(step);
    if (step === TARGET_STEP_INDEX) {
      onSuccess();
    }
  };

  return (
    <Box sx={{ width: 900 }}>
      {/* Preview widget */}
      <Card
        sx={{ mb: 2 }}
        data-testid="provisioning-preview"
        data-target-step={TARGET_STEP_LABEL}
      >
        <CardHeader title="Target step preview" />
        <CardContent>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {provisioningSteps.map((step, idx) => (
              <Box
                key={step}
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: idx === TARGET_STEP_INDEX ? '#1976d2' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  color: idx === TARGET_STEP_INDEX ? '#fff' : '#666',
                }}
              >
                {idx + 1}
              </Box>
            ))}
            <Typography variant="body2" sx={{ ml: 2 }}>
              Target: <strong>{TARGET_STEP_LABEL}</strong>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Dashboard grid */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left column */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ mb: 2 }} data-testid="stepper-provisioning">
            <CardHeader title="Provisioning" />
            <CardContent>
              <Stepper nonLinear activeStep={provisioningStep}>
                {provisioningSteps.map((label, index) => (
                  <Step key={label}>
                    <StepButton onClick={() => handleProvisioningStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          <Card data-testid="stepper-deployment">
            <CardHeader title="Deployment" />
            <CardContent>
              <Stepper nonLinear activeStep={deploymentStep}>
                {deploymentSteps.map((label, index) => (
                  <Step key={label}>
                    <StepButton onClick={() => setDeploymentStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Box>

        {/* Right column */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ mb: 2 }} data-testid="stepper-incident">
            <CardHeader title="Incident workflow" />
            <CardContent>
              <Stepper nonLinear activeStep={incidentStep}>
                {incidentSteps.map((label, index) => (
                  <Step key={label}>
                    <StepButton onClick={() => setIncidentStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          {/* Dense table */}
          <Card sx={{ mb: 2 }}>
            <CardHeader title="Recent Activity" />
            <CardContent sx={{ p: 0 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Event</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Deploy started</TableCell>
                    <TableCell>2m ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Build completed</TableCell>
                    <TableCell>5m ago</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small">Run</Button>
            <Button size="small">Pause</Button>
            <Button size="small">Export</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
