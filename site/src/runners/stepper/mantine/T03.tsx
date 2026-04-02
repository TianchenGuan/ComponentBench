'use client';

/**
 * stepper-mantine-T03: Dark theme (Mantine): jump to Get full access
 *
 * Layout: isolated_card centered on the page.
 * Theme: Dark theme enabled.
 * Component: Mantine Stepper with onStepClick enabled.
 * Steps: "Create account" → "Verify email" → "Get full access".
 * Initial state: active = 0 ("Create account").
 * Success: Active step label is "Get full access" (step 3, index 2).
 */

import React, { useState } from 'react';
import { Stepper, Card, Text, Anchor } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [active, setActive] = useState(0);

  const handleStepClick = (step: number) => {
    setActive(step);
    if (step === 2) {
      onSuccess();
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      style={{ width: 500, background: '#1f1f1f', border: '1px solid #333' }}
    >
      <Text fw={600} size="lg" mb="md" c="white">
        Onboarding
      </Text>
      <Stepper
        active={active}
        onStepClick={handleStepClick}
        data-testid="mantine-stepper-dark"
      >
        <Stepper.Step label="Create account" />
        <Stepper.Step label="Verify email" />
        <Stepper.Step label="Get full access" />
      </Stepper>
      <Text mt="lg" c="dimmed" size="sm">
        Click on a step to navigate.
      </Text>
      <Anchor href="#" size="sm" c="dimmed" mt="md" style={{ pointerEvents: 'none' }}>
        Need help?
      </Anchor>
    </Card>
  );
}
