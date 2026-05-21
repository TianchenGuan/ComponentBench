'use client';

/**
 * time_picker-mantine-T10: Set Office closes to 9:15 PM (12h, two instances)
 *
 * The page shows an "Office hours" settings panel with low clutter. There are two Mantine TimeInput 
 * components: "Office opens" and "Office closes". The component displays in 12-hour format visually
 * but stores 24-hour values. Initial values are 9:00 AM (opens) and 6:00 PM (closes). 
 * The task targets the Office closes field.
 *
 * Scene: layout=settings_panel, instances=2, clutter=low
 *
 * Success: The TimeInput labeled "Office closes" has canonical time value exactly 21:15 (24-hour equivalent of 9:15 PM).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Switch, Stack, Group, Box, Select } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

// Helper to convert 24h to 12h display
function to12Hour(time24: string): { time: string; period: 'AM' | 'PM' } {
  if (!time24) return { time: '', period: 'AM' };
  const [hourStr, minute] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const period: 'AM' | 'PM' = hour >= 12 ? 'PM' : 'AM';
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  return { time: `${hour.toString().padStart(2, '0')}:${minute}`, period };
}

// Helper to convert 12h + period to 24h
function to24Hour(time12: string, period: 'AM' | 'PM'): string {
  if (!time12) return '';
  const [hourStr, minute] = time12.split(':');
  let hour = parseInt(hourStr, 10);
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, '0')}:${minute}`;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [officeOpens, setOfficeOpens] = useState('09:00');
  const [officeOpensPeriod, setOfficeOpensPeriod] = useState<'AM' | 'PM'>('AM');
  const [officeCloses, setOfficeCloses] = useState('18:00');
  const [officeClosesPeriod, setOfficeClosesPeriod] = useState<'AM' | 'PM'>('PM');

  useEffect(() => {
    const closes24 = to24Hour(to12Hour(officeCloses).time, officeClosesPeriod);
    if (closes24 === '21:15') {
      onSuccess();
    }
  }, [officeCloses, officeClosesPeriod, onSuccess]);

  const opens12 = to12Hour(officeOpens);
  const closes12 = to12Hour(officeCloses);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Office hours</Text>
      <Text size="sm" c="dimmed" mb="md">
        Configure when your office is open for appointments.
      </Text>
      
      <Stack gap="md">
        {/* Clutter */}
        <Switch label="Accept walk-ins" defaultChecked />

        {/* Target fields */}
        <Group grow align="flex-end">
          <Box>
            <Text component="label" htmlFor="tp-opens" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Office opens
            </Text>
            <Group gap="xs">
              <TimeInput
                id="tp-opens"
                value={officeOpens}
                onChange={(event) => setOfficeOpens(event.currentTarget.value)}
                style={{ flex: 1 }}
                data-testid="tp-opens"
              />
              <Select
                data={['AM', 'PM']}
                value={officeOpensPeriod}
                onChange={(val) => setOfficeOpensPeriod(val as 'AM' | 'PM')}
                style={{ width: 80 }}
                size="sm"
              />
            </Group>
          </Box>
          <Box>
            <Text component="label" htmlFor="tp-closes" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Office closes
            </Text>
            <Group gap="xs">
              <TimeInput
                id="tp-closes"
                value={officeCloses}
                onChange={(event) => setOfficeCloses(event.currentTarget.value)}
                style={{ flex: 1 }}
                data-testid="tp-closes"
              />
              <Select
                data={['AM', 'PM']}
                value={officeClosesPeriod}
                onChange={(val) => setOfficeClosesPeriod(val as 'AM' | 'PM')}
                style={{ width: 80 }}
                size="sm"
                data-testid="tp-closes-period"
              />
            </Group>
          </Box>
        </Group>

        <Text size="xs" c="dimmed">
          (Set Office closes to 9:15 PM)
        </Text>
      </Stack>
    </Card>
  );
}
