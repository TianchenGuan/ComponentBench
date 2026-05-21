'use client';

/**
 * notification_center-mantine-T08: Pin notifications to match the reference
 *
 * setup_description:
 * Baseline isolated card centered in the viewport with an inline Notification Center.
 * At the very top of the list is a "Pinned" section that shows pinned notifications (if any), followed by the main list.
 * 
 * Each notification row has a small star icon button that toggles its pinned state:
 *   - empty star = not pinned
 *   - filled star = pinned
 * 
 * On the right side of the page there is a non-interactive reference preview titled "Pinned target".
 * It shows the two notification titles that should be pinned (order does not matter):
 *   - "Incident #321 acknowledged" (id 'incident_321')
 *   - "SLA breach warning" (id 'sla_breach')
 * 
 * Initial state:
 *   - One incorrect notification is pinned ('incident_320'), and 'incident_321' is not pinned yet.
 *   - 'sla_breach' is present in the list but not pinned.
 * 
 * The goal is to make the pinned set exactly match the reference (pin the two target notifications and ensure any other pins are removed).
 * Feedback: toggling pin updates the star icon and moves the item into/out of the Pinned section immediately.
 *
 * success_trigger: The pinned notification id set equals {'incident_321', 'sla_breach'} (no additional pinned items).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, ActionIcon, Group, Stack, Box, Divider } from '@mantine/core';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface Notification {
  id: string;
  title: string;
  pinned: boolean;
}

const initialNotifications: Notification[] = [
  { id: 'incident_320', title: 'Incident #320 resolved', pinned: true }, // Wrong pin initially
  { id: 'incident_321', title: 'Incident #321 acknowledged', pinned: false }, // Target
  { id: 'incident_322', title: 'Incident #322 opened', pinned: false },
  { id: 'sla_breach', title: 'SLA breach warning', pinned: false }, // Target
  { id: 'system_alert', title: 'System alert', pinned: false },
  { id: 'maintenance', title: 'Scheduled maintenance', pinned: false },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const successCalledRef = useRef(false);

  const pinnedIds = new Set(notifications.filter(n => n.pinned).map(n => n.id));
  const targetIds = new Set(['incident_321', 'sla_breach']);

  useEffect(() => {
    const pinnedSet = notifications.filter(n => n.pinned).map(n => n.id).sort().join(',');
    const targetSet = ['incident_321', 'sla_breach'].sort().join(',');

    if (pinnedSet === targetSet && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [notifications, onSuccess]);

  const togglePin = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)
    );
  };

  const pinnedNotifications = notifications.filter(n => n.pinned);
  const unpinnedNotifications = notifications.filter(n => !n.pinned);

  return (
    <Group align="flex-start" gap="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
        <Text fw={500} size="lg" mb="md">Notification Center</Text>

        {/* Pinned section */}
        {pinnedNotifications.length > 0 && (
          <>
            <Text size="xs" c="dimmed" fw={500} mb="xs">PINNED</Text>
            <Stack gap={4} mb="md">
              {pinnedNotifications.map((notif) => (
                <Box
                  key={notif.id}
                  p="xs"
                  style={{
                    backgroundColor: 'var(--mantine-color-yellow-0)',
                    borderRadius: 4,
                  }}
                  data-notif-id={notif.id}
                >
                  <Group justify="space-between">
                    <Text size="sm">{notif.title}</Text>
                    <ActionIcon
                      variant="subtle"
                      color="yellow"
                      onClick={() => togglePin(notif.id)}
                      aria-label={`Unpin ${notif.title}`}
                      data-testid={`notif-pin-${notif.id}`}
                    >
                      <IconStarFilled size={16} />
                    </ActionIcon>
                  </Group>
                </Box>
              ))}
            </Stack>
            <Divider mb="md" />
          </>
        )}

        {/* Regular list */}
        <Stack gap={4}>
          {unpinnedNotifications.map((notif) => (
            <Box
              key={notif.id}
              p="xs"
              style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
              data-notif-id={notif.id}
            >
              <Group justify="space-between">
                <Text size="sm">{notif.title}</Text>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => togglePin(notif.id)}
                  aria-label={`Pin ${notif.title}`}
                  data-testid={`notif-pin-${notif.id}`}
                >
                  <IconStar size={16} />
                </ActionIcon>
              </Group>
            </Box>
          ))}
        </Stack>
      </Card>

      {/* Reference preview */}
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 220 }}>
        <Text size="xs" c="dimmed" fw={500} mb="sm">Pinned target</Text>
        <Stack gap="xs">
          <Box p="xs" style={{ backgroundColor: 'var(--mantine-color-yellow-0)', borderRadius: 4 }}>
            <Group gap="xs">
              <IconStarFilled size={14} color="var(--mantine-color-yellow-6)" />
              <Text size="xs">Incident #321 acknowledged</Text>
            </Group>
          </Box>
          <Box p="xs" style={{ backgroundColor: 'var(--mantine-color-yellow-0)', borderRadius: 4 }}>
            <Group gap="xs">
              <IconStarFilled size={14} color="var(--mantine-color-yellow-6)" />
              <Text size="xs">SLA breach warning</Text>
            </Group>
          </Box>
        </Stack>
      </Card>
    </Group>
  );
}
