'use client';

/**
 * stepper-mantine-T07: Compact scroll (Mantine): find Notifications step
 *
 * Layout: isolated_card anchored toward bottom-right (placement=bottom_right).
 * Spacing/scale: spacing=compact and scale=small.
 * Component: Mantine Stepper with many steps in constrained width.
 * Steps: "Intro" → "Profile" → "Security" → "Permissions" → "Notifications" →
 *        "Integrations" → "Review" → "Finish".
 * Step headers in horizontal row with overflow-x: auto.
 * Initial state: active = 0 ("Intro").
 * Success: Active step label is "Notifications" (step 5, index 4).
 */

import React, { useState } from 'react';
import { Stepper, Card, Text, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [active, setActive] = useState(0);

  const handleStepClick = (step: number) => {
    setActive(step);
    if (step === 4) {
      onSuccess();
    }
  };

  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      style={{ width: 400 }}
    >
      <Text fw={500} size="sm" mb="sm">
        Compact Wizard
      </Text>

      <Box
        style={{ overflowX: 'auto', paddingBottom: 8 }}
        data-testid="mantine-stepper-header-scroll"
      >
        <Stepper
          active={active}
          onStepClick={handleStepClick}
          size="xs"
          style={{ minWidth: 800 }}
          data-testid="mantine-stepper-compact"
        >
          <Stepper.Step label="Intro" />
          <Stepper.Step label="Profile" />
          <Stepper.Step label="Security" />
          <Stepper.Step label="Permissions" />
          <Stepper.Step label="Notifications" />
          <Stepper.Step label="Integrations" />
          <Stepper.Step label="Review" />
          <Stepper.Step label="Finish" />
        </Stepper>
      </Box>

      <Text size="xs" c="dimmed" mt="sm">
        Current step: {['Intro', 'Profile', 'Security', 'Permissions', 'Notifications', 'Integrations', 'Review', 'Finish'][active] || 'Completed'}
      </Text>

      <Text size="xs" c="dimmed" mt="xs">
        Scroll right to see more steps.
      </Text>
    </Card>
  );
}
