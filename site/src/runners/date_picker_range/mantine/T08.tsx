'use client';

/**
 * date_picker_range-mantine-T08: Set Secondary window with two similar inputs
 *
 * A settings_panel layout with a sidebar and a content form. In
 * the content area there are two Mantine DatePickerInput components configured with
 * type='range' (instances=2): 'Primary window' (prefilled) and 'Secondary window'
 * (empty — target). Both inputs have the same placeholder and calendar icon, making
 * them visually similar. Additional clutter includes a 'Timezone' select and a
 * non-functional 'Save changes' button. Selecting a range updates the input immediately
 * (no Apply/OK).
 *
 * Success: Secondary window has start=2026-08-03, end=2026-08-11
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Select, Button, Group, Box, NavLink } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconSettings, IconCalendar, IconBell } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryValue, setPrimaryValue] = useState<[Date | null, Date | null]>([
    new Date(2026, 6, 1), // July 1, 2026
    new Date(2026, 6, 15), // July 15, 2026
  ]);
  const [secondaryValue, setSecondaryValue] = useState<[Date | null, Date | null]>([null, null]);
  const [timezone, setTimezone] = useState<string | null>('utc');

  useEffect(() => {
    if (
      secondaryValue[0] &&
      secondaryValue[1] &&
      dayjs(secondaryValue[0]).format('YYYY-MM-DD') === '2026-08-03' &&
      dayjs(secondaryValue[1]).format('YYYY-MM-DD') === '2026-08-11'
    ) {
      onSuccess();
    }
  }, [secondaryValue, onSuccess]);

  return (
    <Group align="flex-start" gap={0} style={{ minHeight: 400, background: '#f8f9fa' }}>
      {/* Sidebar */}
      <Box style={{ width: 200, background: '#fff', borderRight: '1px solid #e9ecef', padding: '16px 0' }}>
        <NavLink label="General" leftSection={<IconSettings size={16} />} />
        <NavLink label="Schedule" leftSection={<IconCalendar size={16} />} active />
        <NavLink label="Notifications" leftSection={<IconBell size={16} />} />
      </Box>

      {/* Content */}
      <Box style={{ flex: 1, padding: 24 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={600} size="lg" mb="md">Windows: Primary window, Secondary window</Text>
          
          <Stack gap="md">
            <div>
              <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
                Primary window
              </Text>
              <DatePickerInput
                type="range"
                value={primaryValue}
                onChange={setPrimaryValue}
                valueFormat="YYYY-MM-DD"
                placeholder="Pick dates range"
                data-testid="primary-window-range"
              />
            </div>

            <div>
              <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
                Secondary window
              </Text>
              <DatePickerInput
                type="range"
                value={secondaryValue}
                onChange={setSecondaryValue}
                valueFormat="YYYY-MM-DD"
                placeholder="Pick dates range"
                defaultDate={new Date(2026, 7, 1)} // August 2026
                data-testid="secondary-window-range"
              />
            </div>

            <Select
              label="Timezone"
              value={timezone}
              onChange={setTimezone}
              data={[
                { value: 'utc', label: 'UTC' },
                { value: 'est', label: 'Eastern Time' },
                { value: 'pst', label: 'Pacific Time' },
              ]}
              data-testid="timezone-select"
            />

            <Button variant="filled" data-testid="save-changes-button">
              Save changes
            </Button>
          </Stack>
        </Card>
      </Box>
    </Group>
  );
}
