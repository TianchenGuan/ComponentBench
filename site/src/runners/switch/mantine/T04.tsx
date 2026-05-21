'use client';

/**
 * switch-mantine-T04: Digest preferences: enable Weekend digest
 *
 * Layout: isolated_card centered in the viewport titled "Digests".
 * Two Mantine Switches are shown in a grouped list:
 *   • "Weekly digest"
 *   • "Weekend digest" (target)
 * Each switch has a brief description line underneath.
 * Initial state: "Weekly digest" is ON; "Weekend digest" is OFF.
 * Feedback: toggling updates immediately; no Save/Apply control.
 */

import React, { useState } from 'react';
import { Card, Switch, Text, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [weeklyChecked, setWeeklyChecked] = useState(true);
  const [weekendChecked, setWeekendChecked] = useState(false);

  const handleWeekendChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.currentTarget.checked;
    setWeekendChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Digests</Text>
      <Stack gap="md">
        <div>
          <Switch
            checked={weeklyChecked}
            onChange={(e) => setWeeklyChecked(e.currentTarget.checked)}
            label="Weekly digest"
            data-testid="weekly-digest-switch"
            data-instance="weekly-digest"
            aria-checked={weeklyChecked}
          />
          <Text size="xs" c="dimmed" ml={52} mt={4}>
            Receive a summary every Monday morning.
          </Text>
        </div>
        <div>
          <Switch
            checked={weekendChecked}
            onChange={handleWeekendChange}
            label="Weekend digest"
            data-testid="weekend-digest-switch"
            data-instance="weekend-digest"
            aria-checked={weekendChecked}
          />
          <Text size="xs" c="dimmed" ml={52} mt={4}>
            Get updates on Saturday and Sunday.
          </Text>
        </div>
      </Stack>
    </Card>
  );
}
