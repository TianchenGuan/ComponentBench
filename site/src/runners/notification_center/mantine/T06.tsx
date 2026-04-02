'use client';

/**
 * notification_center-mantine-T06: Archive two selected items in Project notifications
 *
 * setup_description:
 * Two Notification Center instances are shown side-by-side in an isolated layout:
 *   - Left instance label: "System"
 *   - Right instance label: "Project"  <-- target
 * 
 * Each instance contains a short filter bar and a list where each row has a left-side checkbox.
 * When one or more items are selected, a bulk action row appears with a button labeled "Archive selected".
 * 
 * Target items are in the Project instance:
 *   - "Comment mentioned you" (id 'comment_mention')
 *   - "Merge request approved" (id 'mr_approved')
 * 
 * Initial state:
 *   - Neither target is archived.
 *   - No checkboxes selected.
 * 
 * Distractors: the System instance includes similarly titled items ("Comment reply", "Merge request opened"), and archiving in System must not affect success.
 * Feedback: archiving removes the selected items from the Project list and increments the Project Archived count.
 *
 * success_trigger: In the 'Project' instance, notifications 'comment_mention' and 'mr_approved' are archived.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Group, Button, Stack, Box, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface Notification {
  id: string;
  title: string;
  archived: boolean;
}

const initialSystemNotifications: Notification[] = [
  { id: 'comment_reply', title: 'Comment reply', archived: false },
  { id: 'mr_opened', title: 'Merge request opened', archived: false },
  { id: 'system_update', title: 'System update', archived: false },
];

const initialProjectNotifications: Notification[] = [
  { id: 'comment_mention', title: 'Comment mentioned you', archived: false },
  { id: 'mr_approved', title: 'Merge request approved', archived: false },
  { id: 'task_assigned', title: 'Task assigned', archived: false },
  { id: 'deadline_reminder', title: 'Deadline reminder', archived: false },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [systemNotifications, setSystemNotifications] = useState(initialSystemNotifications);
  const [projectNotifications, setProjectNotifications] = useState(initialProjectNotifications);
  const [systemSelected, setSystemSelected] = useState<string[]>([]);
  const [projectSelected, setProjectSelected] = useState<string[]>([]);
  const successCalledRef = useRef(false);

  useEffect(() => {
    const commentMention = projectNotifications.find(n => n.id === 'comment_mention');
    const mrApproved = projectNotifications.find(n => n.id === 'mr_approved');

    if (commentMention?.archived && mrApproved?.archived && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [projectNotifications, onSuccess]);

  const toggleSystemSelect = (id: string) => {
    setSystemSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleProjectSelect = (id: string) => {
    setProjectSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const archiveSystemSelected = () => {
    setSystemNotifications(prev =>
      prev.map(n => systemSelected.includes(n.id) ? { ...n, archived: true } : n)
    );
    setSystemSelected([]);
  };

  const archiveProjectSelected = () => {
    setProjectNotifications(prev =>
      prev.map(n => projectSelected.includes(n.id) ? { ...n, archived: true } : n)
    );
    setProjectSelected([]);
  };

  const NotificationList = ({
    notifications,
    selected,
    onToggleSelect,
    onArchive,
    testIdPrefix,
  }: {
    notifications: Notification[];
    selected: string[];
    onToggleSelect: (id: string) => void;
    onArchive: () => void;
    testIdPrefix: string;
  }) => {
    const activeNotifs = notifications.filter(n => !n.archived);
    const archivedCount = notifications.filter(n => n.archived).length;

    return (
      <>
        {selected.length > 0 && (
          <Group gap="xs" mb="sm" p="xs" style={{ backgroundColor: 'var(--mantine-color-blue-0)', borderRadius: 4 }}>
            <Text size="sm">{selected.length} selected</Text>
            <Button size="xs" onClick={onArchive}>Archive selected</Button>
          </Group>
        )}
        <Text size="xs" c="dimmed" mb="xs">Archived: {archivedCount}</Text>
        <Stack gap={4}>
          {activeNotifs.map((notif) => (
            <Box
              key={notif.id}
              p="xs"
              style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
            >
              <Group gap="xs">
                <Checkbox
                  checked={selected.includes(notif.id)}
                  onChange={() => onToggleSelect(notif.id)}
                  data-testid={`${testIdPrefix}-checkbox-${notif.id}`}
                />
                <Text size="sm">{notif.title}</Text>
              </Group>
            </Box>
          ))}
        </Stack>
      </>
    );
  };

  return (
    <Group align="flex-start" gap="md">
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 320 }} data-testid="notif-center-system">
        <Text fw={500} mb="sm">System</Text>
        <NotificationList
          notifications={systemNotifications}
          selected={systemSelected}
          onToggleSelect={toggleSystemSelect}
          onArchive={archiveSystemSelected}
          testIdPrefix="system"
        />
      </Card>

      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 320 }} data-testid="notif-center-project">
        <Text fw={500} mb="sm">Project</Text>
        <NotificationList
          notifications={projectNotifications}
          selected={projectSelected}
          onToggleSelect={toggleProjectSelect}
          onArchive={archiveProjectSelected}
          testIdPrefix="project"
        />
      </Card>
    </Group>
  );
}
