'use client';

/**
 * notification_center-mantine-T09: Set Work notifications sort to Oldest first
 *
 * setup_description:
 * Three Notification Center instances are displayed in a row in the center of the page, each rendered at small scale:
 *   - "Personal" (left)
 *   - "Work" (middle)  <-- target
 *   - "System" (right)
 * 
 * Each instance includes a compact header with:
 *   - its label
 *   - an unread count indicator
 *   - a small Select control labeled "Sort" with options "Newest first" and "Oldest first"
 * 
 * Initial state:
 *   - All three instances have Sort = "Newest first".
 * 
 * The task is to change ONLY the Work instance so its Sort becomes "Oldest first".
 * Distractors: each instance also has a "Filter" icon button that opens a small popover; it is not needed.
 * Feedback: the Work Sort control visibly shows "Oldest first" after selection, and the list order reverses within that instance.
 *
 * success_trigger: In the 'Work' Notification Center instance, sort_order is set to 'oldest'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Select, Group, Stack, Box, Badge, ActionIcon, Popover } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface InstanceState {
  sortOrder: 'newest' | 'oldest';
  notifications: { id: string; title: string; time: number }[];
}

const personalNotifications = [
  { id: 'p1', title: 'Personal alert 1', time: 3 },
  { id: 'p2', title: 'Personal alert 2', time: 1 },
  { id: 'p3', title: 'Personal info', time: 2 },
];

const workNotifications = [
  { id: 'w1', title: 'Work task 1', time: 2 },
  { id: 'w2', title: 'Work task 2', time: 3 },
  { id: 'w3', title: 'Work task 3', time: 1 },
];

const systemNotifications = [
  { id: 's1', title: 'System alert', time: 1 },
  { id: 's2', title: 'System update', time: 2 },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [personalSort, setPersonalSort] = useState<string>('newest');
  const [workSort, setWorkSort] = useState<string>('newest');
  const [systemSort, setSystemSort] = useState<string>('newest');
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (workSort === 'oldest' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [workSort, onSuccess]);

  const sortNotifications = (notifs: typeof personalNotifications, order: string) => {
    return [...notifs].sort((a, b) =>
      order === 'newest' ? b.time - a.time : a.time - b.time
    );
  };

  const NotificationInstance = ({
    label,
    notifications,
    sortOrder,
    onSortChange,
    testIdPrefix,
    unreadCount,
  }: {
    label: string;
    notifications: typeof personalNotifications;
    sortOrder: string;
    onSortChange: (value: string) => void;
    testIdPrefix: string;
    unreadCount: number;
  }) => (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      style={{ width: 220 }}
      data-testid={`notif-center-${testIdPrefix}`}
    >
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <Text fw={500} size="sm">{label}</Text>
          <Badge size="xs" color="blue">{unreadCount}</Badge>
        </Group>
        <Popover position="bottom">
          <Popover.Target>
            <ActionIcon variant="subtle" size="sm">
              <IconFilter size={14} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="xs">Filter options...</Text>
          </Popover.Dropdown>
        </Popover>
      </Group>

      <Select
        size="xs"
        label="Sort"
        value={sortOrder}
        onChange={(v) => v && onSortChange(v)}
        data={[
          { value: 'newest', label: 'Newest first' },
          { value: 'oldest', label: 'Oldest first' },
        ]}
        mb="xs"
        data-testid={`${testIdPrefix}-sort`}
      />

      <Stack gap={2}>
        {sortNotifications(notifications, sortOrder).map((notif) => (
          <Box
            key={notif.id}
            p={4}
            style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
          >
            <Text size="xs">{notif.title}</Text>
          </Box>
        ))}
      </Stack>
    </Card>
  );

  return (
    <Group gap="md" align="flex-start">
      <NotificationInstance
        label="Personal"
        notifications={personalNotifications}
        sortOrder={personalSort}
        onSortChange={setPersonalSort}
        testIdPrefix="personal"
        unreadCount={2}
      />

      <NotificationInstance
        label="Work"
        notifications={workNotifications}
        sortOrder={workSort}
        onSortChange={setWorkSort}
        testIdPrefix="work"
        unreadCount={3}
      />

      <NotificationInstance
        label="System"
        notifications={systemNotifications}
        sortOrder={systemSort}
        onSortChange={setSystemSort}
        testIdPrefix="system"
        unreadCount={1}
      />
    </Group>
  );
}
