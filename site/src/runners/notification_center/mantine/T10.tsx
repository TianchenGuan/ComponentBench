'use client';

/**
 * notification_center-mantine-T10: Set Do Not Disturb to 1 hour and apply
 *
 * setup_description:
 * Dark theme is enabled. The Notification Center is shown inline in an isolated card in the center.
 * At the top of the widget is a settings area titled "Quiet mode".
 * 
 * Controls in the settings area:
 *   - A Select labeled "Do Not Disturb" with options: Off, 30 minutes, 1 hour, 2 hours
 *   - Buttons at the bottom-right: "Apply" and "Cancel"
 * 
 * Initial state:
 *   - Do Not Disturb is Off (applied value).
 * 
 * Interaction nuance:
 *   - Changing the Select updates a "Pending changes" indicator, but does NOT affect the applied setting until "Apply" is pressed.
 * 
 * The task requires choosing "1 hour" and then clicking "Apply" to commit.
 * Distractors: the "Cancel" button clears the pending change and should not be used.
 * Feedback: after Apply, the pending indicator disappears and a small inline status text appears: "Quiet mode: 1 hour".
 *
 * success_trigger: Applied Do Not Disturb duration equals 60 minutes.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Select, Group, Button, Stack, Box, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const notifications = [
  { id: '1', title: 'Alert 1' },
  { id: '2', title: 'Alert 2' },
  { id: '3', title: 'Alert 3' },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [appliedDnd, setAppliedDnd] = useState<string>('0'); // Applied value
  const [pendingDnd, setPendingDnd] = useState<string>('0'); // Pending value
  const successCalledRef = useRef(false);

  const hasPendingChanges = appliedDnd !== pendingDnd;

  useEffect(() => {
    if (appliedDnd === '60' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [appliedDnd, onSuccess]);

  const handleApply = () => {
    setAppliedDnd(pendingDnd);
  };

  const handleCancel = () => {
    setPendingDnd(appliedDnd);
  };

  const getDndLabel = (value: string) => {
    switch (value) {
      case '0': return 'Off';
      case '30': return '30 minutes';
      case '60': return '1 hour';
      case '120': return '2 hours';
      default: return 'Off';
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="md">Notification Center</Text>

      {/* Quiet mode settings */}
      <Box
        p="md"
        mb="md"
        style={{
          backgroundColor: 'var(--mantine-color-gray-1)',
          borderRadius: 8,
        }}
      >
        <Group justify="space-between" mb="sm">
          <Text fw={500} size="sm">Quiet mode</Text>
          {hasPendingChanges && (
            <Badge color="yellow" size="xs">Pending changes</Badge>
          )}
        </Group>

        <Select
          label="Do Not Disturb"
          value={pendingDnd}
          onChange={(v) => v && setPendingDnd(v)}
          data={[
            { value: '0', label: 'Off' },
            { value: '30', label: '30 minutes' },
            { value: '60', label: '1 hour' },
            { value: '120', label: '2 hours' },
          ]}
          mb="md"
          data-testid="dnd-select"
        />

        <Group justify="flex-end" gap="xs">
          <Button
            variant="default"
            size="xs"
            onClick={handleCancel}
            disabled={!hasPendingChanges}
          >
            Cancel
          </Button>
          <Button
            size="xs"
            onClick={handleApply}
            disabled={!hasPendingChanges}
            data-testid="apply-btn"
          >
            Apply
          </Button>
        </Group>

        {appliedDnd !== '0' && (
          <Text size="xs" c="dimmed" mt="sm">
            Quiet mode: {getDndLabel(appliedDnd)}
          </Text>
        )}
      </Box>

      {/* Notification list */}
      <Stack gap="xs">
        {notifications.map((notif) => (
          <Box
            key={notif.id}
            p="xs"
            style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
          >
            <Text size="sm">{notif.title}</Text>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
