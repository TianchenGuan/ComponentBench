'use client';

/**
 * stepper-mantine-T10: Dashboard (Mantine): reset Account onboarding to Start
 *
 * Layout: dashboard with multiple cards and widgets.
 * Three Mantine Steppers: "Account onboarding" (TARGET), "Device provisioning",
 * "Support workflow" (distractors).
 * Account onboarding steps: "Start" → "Profile" → "Verify" → "Finish" → Completed.
 * Initial state: Account onboarding is in Completed state (has a "Reset" button).
 * Success: Account onboarding active step is "Start" (index 0).
 */

import React, { useState } from 'react';
import { Stepper, Card, Text, Button, Box, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const accountSteps = ['Start', 'Profile', 'Verify', 'Finish'];
const deviceSteps = ['Init', 'Configure', 'Verify', 'Done'];
const supportSteps = ['Open', 'Assign', 'Verify', 'Close'];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [accountActive, setAccountActive] = useState(4); // Start in Completed state
  const [deviceActive, setDeviceActive] = useState(1);
  const [supportActive, setSupportActive] = useState(2);

  const handleReset = () => {
    setAccountActive(0);
    onSuccess();
  };

  return (
    <Box style={{ width: 900 }}>
      {/* Dashboard header */}
      <Group mb="lg" justify="space-between">
        <Text fw={600} size="xl">Dashboard</Text>
        <Group>
          <Button size="xs" variant="default">Export</Button>
          <Button size="xs" variant="default">Refresh</Button>
          <Button size="xs" variant="default">Create ticket</Button>
        </Group>
      </Group>

      {/* Dashboard grid */}
      <Box style={{ display: 'flex', gap: 16 }}>
        {/* Left column */}
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card shadow="sm" padding="md" radius="md" withBorder data-testid="stepper-account-onboarding">
            <Text fw={500} size="md" mb="md">Account onboarding</Text>
            <Stepper
              active={accountActive}
              onStepClick={setAccountActive}
              size="sm"
            >
              {accountSteps.map((step) => (
                <Stepper.Step key={step} label={step} />
              ))}
              <Stepper.Completed>
                <Text size="sm" mt="md">Completed!</Text>
                <Button
                  size="xs"
                  variant="outline"
                  mt="sm"
                  onClick={handleReset}
                  data-testid="reset"
                >
                  Reset
                </Button>
              </Stepper.Completed>
            </Stepper>
          </Card>

          <Card shadow="sm" padding="md" radius="md" withBorder data-testid="stepper-device-provisioning">
            <Text fw={500} size="md" mb="md">Device provisioning</Text>
            <Stepper
              active={deviceActive}
              onStepClick={setDeviceActive}
              size="sm"
            >
              {deviceSteps.map((step) => (
                <Stepper.Step key={step} label={step} />
              ))}
            </Stepper>
          </Card>
        </Box>

        {/* Right column */}
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card shadow="sm" padding="md" radius="md" withBorder data-testid="stepper-support-workflow">
            <Text fw={500} size="md" mb="md">Support workflow</Text>
            <Stepper
              active={supportActive}
              onStepClick={setSupportActive}
              size="sm"
            >
              {supportSteps.map((step) => (
                <Stepper.Step key={step} label={step} />
              ))}
            </Stepper>
          </Card>

          {/* Chart placeholder */}
          <Card shadow="sm" padding="md" radius="md" withBorder style={{ height: 150 }}>
            <Text fw={500} size="md" mb="md">Analytics</Text>
            <Text size="sm" c="dimmed">Chart placeholder</Text>
          </Card>

          {/* Recent activity */}
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text fw={500} size="md" mb="md">Recent Activity</Text>
            <Text size="xs" c="dimmed">Ticket #1234 resolved - 2m ago</Text>
            <Text size="xs" c="dimmed">Device configured - 5m ago</Text>
            <Text size="xs" c="dimmed">User onboarded - 10m ago</Text>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
