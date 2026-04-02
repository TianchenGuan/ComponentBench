'use client';

/**
 * date_input_text-mantine-T06: Mantine scroll to locate a DateInput in settings panel
 * 
 * Layout: settings_panel with a scrollable main content area.
 * Target component: a Mantine DateInput labeled "Maintenance date" in the "System maintenance" section located near the bottom of the settings content (initially below the fold).
 * Configuration: valueFormat YYYY-MM-DD; free-form typing enabled.
 * Initial state: empty.
 * Clutter (medium): several switches, sliders, and informational callouts appear above; they are distractors.
 * Feedback: after entering a valid date, the input shows the formatted date and a small helper text appears ("Next maintenance scheduled").
 * 
 * Success: The "Maintenance date" DateInput value equals 2026-07-15.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Switch, Slider, Box, Stack, Divider, Badge, Group, ScrollArea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD') === '2026-07-15') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Box style={{ display: 'flex', gap: 16 }}>
      {/* Left navigation rail */}
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 180 }}>
        <Text fw={500} size="sm" mb="md">Settings</Text>
        <Stack gap="xs">
          <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>General</Text>
          <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Notifications</Text>
          <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Security</Text>
          <Text size="sm" c="blue" fw={500}>System</Text>
        </Stack>
      </Card>

      {/* Main scrollable settings pane */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
        <ScrollArea h={450} id="settings-scroll-container">
          <Text fw={600} size="lg" mb="md">System Settings</Text>

          {/* Section: Performance */}
          <Box mb="lg">
            <Text fw={500} mb="sm">Performance</Text>
            <Text size="sm" c="dimmed" mb="md">
              Adjust system performance settings for optimal operation.
            </Text>
            <Switch label="Enable caching" defaultChecked mb="sm" />
            <Switch label="Background optimization" mb="sm" />
            <Text size="sm" mb="xs">CPU allocation</Text>
            <Slider defaultValue={50} label={(v) => `${v}%`} mb="md" />
          </Box>

          <Divider my="md" />

          {/* Section: Logging */}
          <Box mb="lg">
            <Text fw={500} mb="sm">Logging</Text>
            <Text size="sm" c="dimmed" mb="md">
              Configure system logging and diagnostic options.
            </Text>
            <Switch label="Verbose logging" mb="sm" />
            <Switch label="Error reporting" defaultChecked mb="sm" />
            <Text size="sm" mb="xs">Log retention (days)</Text>
            <Slider defaultValue={30} min={7} max={90} label={(v) => `${v} days`} mb="md" />
          </Box>

          <Divider my="md" />

          {/* Section: Updates */}
          <Box mb="lg">
            <Text fw={500} mb="sm">Updates</Text>
            <Text size="sm" c="dimmed" mb="md">
              Manage system update preferences and schedules.
            </Text>
            <Switch label="Automatic updates" defaultChecked mb="sm" />
            <Switch label="Download over Wi-Fi only" mb="sm" />
          </Box>

          <Divider my="md" />

          {/* Section: System maintenance (target - below the fold) */}
          <Box mb="md">
            <Group gap="sm" mb="sm">
              <Text fw={500}>System maintenance</Text>
              {value && <Badge size="sm" color="yellow">Unsaved</Badge>}
            </Group>
            <Text size="sm" c="dimmed" mb="md">
              Schedule system maintenance windows and cleanup tasks.
            </Text>
            
            <div>
              <Text component="label" htmlFor="maintenance-date" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
                Maintenance date
              </Text>
              <DateInput
                id="maintenance-date"
                value={value}
                onChange={setValue}
                valueFormat="YYYY-MM-DD"
                placeholder="YYYY-MM-DD"
                data-testid="maintenance-date"
              />
              {value && (
                <Text size="xs" c="dimmed" mt={4}>
                  Next maintenance scheduled
                </Text>
              )}
            </div>
          </Box>
        </ScrollArea>
      </Card>
    </Box>
  );
}
