'use client';

/**
 * stepper-mantine-T02: Account setup (Mantine): next to Verify email
 *
 * Layout: isolated_card centered on the page.
 * Component: Mantine Stepper with navigation buttons below.
 * Steps: "Create account" → "Verify email" → "Get full access" → Completed.
 * Step headers are also clickable, but instruction asks to use Next button.
 * Initial state: active = 0 ("Create account").
 * Success: Active step label is "Verify email" (step 2, index 1).
 */

import React, { useState } from 'react';
import { Stepper, Card, Text, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    const nextStep = active + 1;
    setActive(nextStep);
    if (nextStep === 1) {
      onSuccess();
    }
  };

  const handleBack = () => {
    setActive(active - 1);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={600} size="lg" mb="md">
        Account Setup
      </Text>
      <Stepper
        active={active}
        onStepClick={setActive}
        data-testid="mantine-stepper-account-nav"
      >
        <Stepper.Step label="Create account" description="Sign up">
          <Text mt="md">Step 1: Create your account.</Text>
        </Stepper.Step>
        <Stepper.Step label="Verify email" description="Confirm email">
          <Text mt="md">Step 2: Verify your email address.</Text>
        </Stepper.Step>
        <Stepper.Step label="Get full access" description="Complete setup">
          <Text mt="md">Step 3: Get full access.</Text>
        </Stepper.Step>
        <Stepper.Completed>
          <Text mt="md">Completed! You have full access.</Text>
        </Stepper.Completed>
      </Stepper>
      <Group mt="xl">
        <Button variant="default" disabled={active === 0} onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext} data-testid="mantine-next">
          Next step
        </Button>
      </Group>
    </Card>
  );
}
