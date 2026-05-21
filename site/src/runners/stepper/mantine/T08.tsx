'use client';

/**
 * stepper-mantine-T08: Finish wizard (Mantine): reach Completed panel
 *
 * Layout: settings_panel with moderate clutter.
 * Component: Mantine Stepper configured as sequential wizard.
 * allowNextStepsSelect={false} so future steps cannot be selected directly.
 * Steps: "Details" → "Verification" → "Confirm" → "Issue".
 * After last step, Stepper shows <Stepper.Completed> panel.
 * Navigation via "Back" and "Next step" / "Finish" buttons.
 * Initial state: active = 0 ("Details").
 * Success: Stepper is in Completed state (active index = 4).
 */

import React, { useState } from 'react';
import { Stepper, Card, Text, Button, Group, Switch, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const stepLabels = ['Details', 'Verification', 'Confirm', 'Issue'];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    const nextStep = active + 1;
    setActive(nextStep);
    if (nextStep === 4) {
      onSuccess();
    }
  };

  const handleBack = () => {
    setActive(active - 1);
  };

  const isLastStep = active === stepLabels.length - 1;
  const isCompleted = active >= stepLabels.length;

  return (
    <Box style={{ width: 600, display: 'flex', gap: 24 }}>
      {/* Sidebar-like list (non-interactive placeholders) */}
      <Box style={{ width: 150, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <Text size="xs" fw={500} mb="sm">Settings</Text>
        <Text size="xs" c="dimmed" mb="xs">General</Text>
        <Text size="xs" c="dimmed" mb="xs">Security</Text>
        <Text size="xs" c="dimmed" mb="xs">Certificates</Text>
        <Text size="xs" c="dimmed" mb="xs">Integrations</Text>
      </Box>

      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
        <Text fw={600} size="lg" mb="md">
          Certificate Wizard
        </Text>
        <Stepper
          active={active}
          allowNextStepsSelect={false}
          data-testid="mantine-stepper-certificate"
        >
          <Stepper.Step label="Details">
            <Text mt="md" size="sm">Enter certificate details.</Text>
          </Stepper.Step>
          <Stepper.Step label="Verification">
            <Text mt="md" size="sm">Verify your domain ownership.</Text>
          </Stepper.Step>
          <Stepper.Step label="Confirm">
            <Text mt="md" size="sm">Confirm the certificate request.</Text>
          </Stepper.Step>
          <Stepper.Step label="Issue">
            <Text mt="md" size="sm">Issue the certificate.</Text>
          </Stepper.Step>
          <Stepper.Completed>
            <Text mt="md" size="sm" data-testid="stepper-completed">
              Completed! Your certificate has been issued.
            </Text>
          </Stepper.Completed>
        </Stepper>

        <Group mt="xl">
          <Button
            variant="default"
            disabled={active === 0 || isCompleted}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={isCompleted}
            data-testid="mantine-next"
          >
            {isLastStep ? 'Finish' : 'Next step'}
          </Button>
        </Group>

        {/* Distractors */}
        <Box mt="xl" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Switch size="sm" label="Send email notification" />
          <Switch size="sm" label="Create audit log entry" />
        </Box>
      </Card>
    </Box>
  );
}
