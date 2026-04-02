'use client';

/**
 * datetime_picker_single-mantine-T05: Mantine match reference with two instances
 *
 * Layout: form_section titled "Maintenance window".
 * Instances: 2 Mantine DateTimePicker inputs:
 *   - "Window start"  ← TARGET
 *   - "Window end" (distractor)
 * Guidance (mixed): a small badge above "Window start" reads: "Reference: Mon, Mar 9, 2026 · 9:00 AM".
 * Initial state:
 *   - Window start: 2026-03-09 08:00 (one hour early)
 *   - Window end: 2026-03-09 09:00 (distractor already matches reference but wrong field)
 * Clutter (low): one toggle "Notify users" and a text area "Notes" (not required). Dropdown type is default popover.
 *
 * Success: The "Window start" value matches the reference badge datetime (2026-03-09 09:00).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Badge, Switch, Textarea } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [windowStart, setWindowStart] = useState<Date | null>(new Date('2026-03-09T08:00:00'));
  const [windowEnd, setWindowEnd] = useState<Date | null>(new Date('2026-03-09T09:00:00'));
  const [notifyUsers, setNotifyUsers] = useState(true);

  useEffect(() => {
    if (windowStart && dayjs(windowStart).format('YYYY-MM-DD HH:mm') === '2026-03-09 09:00') {
      onSuccess();
    }
  }, [windowStart, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Maintenance window</Text>
      <Stack gap="md">
        {/* Reference badge */}
        <Badge color="blue" size="lg" data-testid="ref-window-start">
          Reference: Mon, Mar 9, 2026 · 9:00 AM
        </Badge>

        <div>
          <Text component="label" htmlFor="dt-window-start" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Window start
          </Text>
          <DateTimePicker
            id="dt-window-start"
            value={windowStart}
            onChange={setWindowStart}
            placeholder="Pick date and time"
            data-testid="dt-window-start"
          />
        </div>

        <div>
          <Text component="label" htmlFor="dt-window-end" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Window end
          </Text>
          <DateTimePicker
            id="dt-window-end"
            value={windowEnd}
            onChange={setWindowEnd}
            placeholder="Pick date and time"
            data-testid="dt-window-end"
          />
        </div>

        {/* Clutter */}
        <Switch
          label="Notify users"
          checked={notifyUsers}
          onChange={(e) => setNotifyUsers(e.currentTarget.checked)}
        />
        <Textarea label="Notes" placeholder="Optional maintenance notes..." />
      </Stack>
    </Card>
  );
}
