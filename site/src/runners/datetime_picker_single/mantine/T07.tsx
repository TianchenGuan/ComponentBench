'use client';

/**
 * datetime_picker_single-mantine-T07: Mantine seconds precision in dark theme
 *
 * Theme: dark mode.
 * Layout: isolated card centered.
 * Component: one Mantine DateTimePicker labeled "Audit at".
 * Configuration: withSeconds=true so the time selector includes seconds; input displays seconds as part of the value.
 * Dropdown type: popover.
 * Initial state: "2026-02-28 23:59:00" (seconds currently 00; must set to 45).
 *
 * Success: The "Audit at" DateTimePicker equals 2026-02-28 23:59:45 exactly (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, MantineProvider } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(new Date('2026-02-28T23:59:00'));

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD HH:mm:ss') === '2026-02-28 23:59:45') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <MantineProvider forceColorScheme="dark">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
        <Text fw={600} size="lg" mb="md">Audit Settings</Text>
        <Stack gap="md">
          <div>
            <Text component="label" htmlFor="dt-audit" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Audit at
            </Text>
            <DateTimePicker
              id="dt-audit"
              value={value}
              onChange={setValue}
              placeholder="Pick date and time"
              withSeconds
              valueFormat="YYYY-MM-DD HH:mm:ss"
              data-testid="dt-audit"
            />
          </div>
        </Stack>
      </Card>
    </MantineProvider>
  );
}
