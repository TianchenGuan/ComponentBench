'use client';

/**
 * datetime_picker_single-mantine-T10: Mantine drawer flow set datetime
 *
 * Layout: drawer_flow. The main page shows a "Blackout rules" card with a button "Edit blackout".
 * When "Edit blackout" is clicked, a right-side drawer slides in. The target field is inside the drawer near the top.
 * Target component: one Mantine DateTimePicker labeled "Blackout starts" inside the drawer (default popover dropdown).
 * Clutter (low): the drawer also contains a toggle "Enabled", a textarea "Reason", and buttons "Save" and "Cancel" at the bottom (not required for success).
 * Initial state: Blackout starts is set to "May 20, 2026 12:00 PM" (must change to 1:00 PM).
 *
 * Success: The DateTimePicker labeled "Blackout starts" equals 2026-05-20 13:00.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Drawer, Stack, Switch, Textarea, Group } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [blackoutStarts, setBlackoutStarts] = useState<Date | null>(new Date('2026-05-20T12:00:00'));
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (blackoutStarts && dayjs(blackoutStarts).format('YYYY-MM-DD HH:mm') === '2026-05-20 13:00') {
      onSuccess();
    }
  }, [blackoutStarts, onSuccess]);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Text fw={600} size="lg" mb="md">Blackout rules</Text>
        <Text size="sm" c="dimmed" mb="md">
          Configure system blackout periods when deployments are blocked.
        </Text>
        <Button onClick={() => setDrawerOpened(true)} data-testid="btn-edit-blackout">
          Edit blackout
        </Button>
      </Card>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Edit blackout"
        position="right"
        size="md"
      >
        <Stack gap="md">
          <div>
            <Text component="label" htmlFor="dt-blackout" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Blackout starts
            </Text>
            <DateTimePicker
              id="dt-blackout"
              value={blackoutStarts}
              onChange={setBlackoutStarts}
              placeholder="Pick date and time"
              data-testid="dt-blackout-starts"
            />
          </div>

          <Switch
            label="Enabled"
            checked={enabled}
            onChange={(e) => setEnabled(e.currentTarget.checked)}
          />

          <Textarea
            label="Reason"
            placeholder="Enter reason for blackout..."
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setDrawerOpened(false)}>Cancel</Button>
            <Button onClick={() => setDrawerOpened(false)}>Save</Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
