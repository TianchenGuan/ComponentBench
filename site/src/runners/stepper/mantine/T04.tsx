'use client';

/**
 * stepper-mantine-T04: Two steppers (Mantine): Device setup to Wi‑Fi
 *
 * Layout: form_section with heading and helper text.
 * Two Mantine Steppers: "Account setup" (distractor) and "Device setup" (TARGET).
 * Account setup steps: "Profile" → "Security" → "Done".
 * Device setup steps: "Pair device" → "Wi‑Fi" → "Updates" → "Done".
 * Initial state: Account active = 1 ("Security"), Device active = 0 ("Pair device").
 * Success: Device setup active step is "Wi‑Fi" (index 1).
 */

import React, { useState } from 'react';
import { Stepper, Card, Text, TextInput, Alert, Box } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [accountStep, setAccountStep] = useState(1); // Start at "Security"
  const [deviceStep, setDeviceStep] = useState(0); // Start at "Pair device"

  const handleDeviceStep = (step: number) => {
    setDeviceStep(step);
    if (step === 1) {
      onSuccess();
    }
  };

  return (
    <Box style={{ width: 600 }}>
      <Text fw={600} size="xl" mb="xs">
        Setup
      </Text>
      <Text c="dimmed" size="sm" mb="lg">
        Complete account and device setup to get started.
      </Text>

      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md" data-testid="stepper-account-setup">
        <Text fw={500} size="md" mb="md">
          Account setup
        </Text>
        <Stepper active={accountStep} onStepClick={setAccountStep}>
          <Stepper.Step label="Profile" />
          <Stepper.Step label="Security" />
          <Stepper.Step label="Done" />
        </Stepper>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md" data-testid="stepper-device-setup">
        <Text fw={500} size="md" mb="md">
          Device setup
        </Text>
        <Stepper active={deviceStep} onStepClick={handleDeviceStep}>
          <Stepper.Step label="Pair device" />
          <Stepper.Step label="Wi‑Fi" />
          <Stepper.Step label="Updates" />
          <Stepper.Step label="Done" />
        </Stepper>
      </Card>

      {/* Distractors */}
      <Box style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <TextInput placeholder="Device name" disabled style={{ width: 200 }} />
        <TextInput placeholder="Time zone" disabled style={{ width: 200 }} />
      </Box>

      <Alert icon={<IconInfoCircle size={16} />} title="Info" color="blue" mt="md">
        Device setup may require physical access to your device.
      </Alert>
    </Box>
  );
}
