'use client';

/**
 * stepper-mantine-T01: Account setup (Mantine): select Verify email
 *
 * Layout: isolated_card centered on the page.
 * Component: Mantine Stepper with clickable step headers (onStepClick enabled).
 * Steps: "Create account" → "Verify email" → "Get full access".
 * Initial state: active = 0 ("Create account").
 * Success: Active step label is "Verify email" (step 2, index 1).
 */

import React, { useState } from 'react';
import { Stepper, Card, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [active, setActive] = useState(0);

  const handleStepClick = (step: number) => {
    setActive(step);
    if (step === 1) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">
        Account Setup
      </Text>
      <Stepper
        active={active}
        onStepClick={handleStepClick}
        data-testid="mantine-stepper-account"
      >
        <Stepper.Step label="Create account" description="Sign up" />
        <Stepper.Step label="Verify email" description="Confirm email" />
        <Stepper.Step label="Get full access" description="Complete setup" />
      </Stepper>
      <Text mt="lg" c="dimmed" size="sm">
        {task.ui_copy}
      </Text>
    </Card>
  );
}
