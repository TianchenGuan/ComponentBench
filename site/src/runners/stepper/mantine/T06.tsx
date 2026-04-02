'use client';

/**
 * stepper-mantine-T06: Drawer onboarding (Mantine): open and go to Permissions
 *
 * Layout: drawer_flow.
 * Page has a button "Open onboarding" that opens a right-side drawer.
 * Drawer contains a Mantine Stepper at the top.
 * Steps: "Intro" → "Profile" → "Permissions" → "Notifications" → "Finish".
 * onStepClick is enabled.
 * Initial state (drawer): active = 0 ("Intro").
 * Success: Active step label is "Permissions" (step 3, index 2).
 */

import React, { useState } from 'react';
import { Stepper, Button, Drawer, Text, Anchor, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(0);

  const handleStepClick = (step: number) => {
    setActive(step);
    if (step === 2) {
      onSuccess();
    }
  };

  return (
    <Box>
      <Button onClick={() => setOpened(true)}>
        Open onboarding
      </Button>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Onboarding"
        position="right"
        size="md"
        data-testid="onboarding-drawer"
      >
        <Stepper
          active={active}
          onStepClick={handleStepClick}
          orientation="vertical"
          data-testid="onboarding-stepper"
        >
          <Stepper.Step label="Intro">
            <Text size="sm" c="dimmed">Welcome to the platform!</Text>
          </Stepper.Step>
          <Stepper.Step label="Profile">
            <Text size="sm" c="dimmed">Set up your profile.</Text>
          </Stepper.Step>
          <Stepper.Step label="Permissions">
            <Text size="sm" c="dimmed">Configure permissions.</Text>
          </Stepper.Step>
          <Stepper.Step label="Notifications">
            <Text size="sm" c="dimmed">Set notification preferences.</Text>
          </Stepper.Step>
          <Stepper.Step label="Finish">
            <Text size="sm" c="dimmed">Complete onboarding.</Text>
          </Stepper.Step>
        </Stepper>

        <Text mt="xl" size="sm" c="dimmed">
          Complete the steps above to get started.
        </Text>

        <Box mt="lg" style={{ display: 'flex', gap: 16 }}>
          <Button variant="default" onClick={() => setOpened(false)}>
            Close
          </Button>
          <Anchor href="#" size="sm" c="dimmed">
            Skip tutorial
          </Anchor>
        </Box>
      </Drawer>
    </Box>
  );
}
