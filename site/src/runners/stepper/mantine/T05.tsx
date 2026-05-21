'use client';

/**
 * stepper-mantine-T05: Locked future steps (Mantine): reach Review via Next
 *
 * Layout: isolated_card centered on the page.
 * Component: Mantine Stepper with allowNextStepsSelect={false} (future steps locked).
 * Steps: "Start" → "Details" → "Review" → "Done" → Completed.
 * Navigation via "Back" and "Next step" buttons.
 * Initial state: active = 0 ("Start").
 * Success: Active step label is "Review" (step 3, index 2).
 */

import React, { useState } from 'react';
import { Stepper, Card, Text, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    const nextStep = active + 1;
    setActive(nextStep);
    if (nextStep === 2) {
      onSuccess();
    }
  };

  const handleBack = () => {
    setActive(active - 1);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={600} size="lg" mb="md">
        Wizard
      </Text>
      <Stepper
        active={active}
        allowNextStepsSelect={false}
        data-testid="mantine-stepper-locked"
      >
        <Stepper.Step label="Start">
          <Text mt="md">Step 1: Getting started.</Text>
        </Stepper.Step>
        <Stepper.Step label="Details">
          <Text mt="md">Step 2: Fill in details.</Text>
        </Stepper.Step>
        <Stepper.Step label="Review">
          <Text mt="md">Step 3: Review your information.</Text>
        </Stepper.Step>
        <Stepper.Step label="Done">
          <Text mt="md">Step 4: Final confirmation.</Text>
        </Stepper.Step>
        <Stepper.Completed>
          <Text mt="md">All steps completed!</Text>
        </Stepper.Completed>
      </Stepper>
      <Group mt="xl">
        <Button variant="default" disabled={active === 0} onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={active > 3} data-testid="mantine-next">
          Next step
        </Button>
      </Group>
    </Card>
  );
}
