'use client';

/**
 * datetime_picker_single-mantine-T09: Mantine dashboard 3 instances disambiguation
 *
 * Layout: dashboard with three side-by-side cards; the whole cluster is positioned toward the bottom-left of the viewport.
 * Instances: 3 Mantine DateTimePicker inputs (same component) with labels:
 *   - "Primary window"
 *   - "Backup window"  ← TARGET
 *   - "Staging window"
 * Clutter (medium): each card also contains a small status chip and a non-functional "Details" link.
 * Initial state:
 *   - Primary window: 2026-04-12 14:20 (already correct, distractor)
 *   - Backup window: 2026-04-12 14:00 (must change minutes to 20)
 *   - Staging window: 2026-04-12 14:20 (distractor correct)
 * Dropdown type: popover; no confirm/apply button.
 *
 * Success: Only the "Backup window" DateTimePicker equals 2026-04-12 14:20.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Group, Badge, Anchor, SimpleGrid } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [primaryWindow, setPrimaryWindow] = useState<Date | null>(new Date('2026-04-12T14:20:00'));
  const [backupWindow, setBackupWindow] = useState<Date | null>(new Date('2026-04-12T14:00:00'));
  const [stagingWindow, setStagingWindow] = useState<Date | null>(new Date('2026-04-12T14:20:00'));

  useEffect(() => {
    if (backupWindow && dayjs(backupWindow).format('YYYY-MM-DD HH:mm') === '2026-04-12 14:20') {
      onSuccess();
    }
  }, [backupWindow, onSuccess]);

  return (
    <div style={{ width: 700 }}>
      <Text fw={600} size="lg" mb="md">System Windows</Text>
      <SimpleGrid cols={3} spacing="sm">
        {/* Primary window card */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Primary window</Text>
            <Badge color="green" size="sm">Active</Badge>
          </Group>
          <DateTimePicker
            value={primaryWindow}
            onChange={setPrimaryWindow}
            placeholder="Pick date and time"
            size="sm"
            data-testid="dt-primary-window"
          />
          <Anchor href="#" size="xs" mt="xs">Details</Anchor>
        </Card>

        {/* Backup window card - TARGET */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Backup window</Text>
            <Badge color="yellow" size="sm">Pending</Badge>
          </Group>
          <DateTimePicker
            value={backupWindow}
            onChange={setBackupWindow}
            placeholder="Pick date and time"
            size="sm"
            data-testid="dt-backup-window"
          />
          <Anchor href="#" size="xs" mt="xs">Details</Anchor>
        </Card>

        {/* Staging window card */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Staging window</Text>
            <Badge color="gray" size="sm">Standby</Badge>
          </Group>
          <DateTimePicker
            value={stagingWindow}
            onChange={setStagingWindow}
            placeholder="Pick date and time"
            size="sm"
            data-testid="dt-staging-window"
          />
          <Anchor href="#" size="xs" mt="xs">Details</Anchor>
        </Card>
      </SimpleGrid>
    </div>
  );
}
