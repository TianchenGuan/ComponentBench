'use client';

/**
 * notification_center-mantine-T04: Search and open a project invite notification
 *
 * setup_description:
 * The Notification Center card is anchored in the bottom-left of the viewport (not centered).
 * It includes a search TextInput labeled "Search notifications" above a scrollable list.
 * 
 * The list contains ~20 collaboration-related notifications with similar phrasing:
 *   - "Invite to project: Nimbus" (id 'project_invite_nimbus')  <-- target
 *   - "Invite to project: Atlas" (id 'project_invite_atlas')
 *   - "Added you to project: Nimbus" (id 'project_added_nimbus')
 * 
 * Clicking a row expands it inline to show the full message and two buttons ("Accept" and "Decline").
 * Initial state: search is empty and no rows are expanded.
 * 
 * Distractors: the page footer contains an unrelated newsletter signup input; it should be ignored.
 * Feedback: when the target row is expanded, its details block becomes visible and aria-expanded becomes true.
 *
 * success_trigger: Notification 'project_invite_nimbus' is expanded/opened (details visible).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TextInput, Text, Stack, Box, Button, Group, Collapse } from '@mantine/core';
import { IconSearch, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const notifications = [
  { id: 'project_invite_nimbus', title: 'Invite to project: Nimbus', message: 'You have been invited to collaborate on the Nimbus project.' },
  { id: 'project_invite_atlas', title: 'Invite to project: Atlas', message: 'You have been invited to collaborate on the Atlas project.' },
  { id: 'project_added_nimbus', title: 'Added you to project: Nimbus', message: 'Admin added you to the Nimbus project.' },
  { id: 'comment_reply', title: 'Comment reply', message: 'Someone replied to your comment.' },
  { id: 'task_assigned', title: 'Task assigned', message: 'A new task has been assigned to you.' },
  { id: 'project_invite_horizon', title: 'Invite to project: Horizon', message: 'You have been invited to collaborate on the Horizon project.' },
  { id: 'mention_in_doc', title: 'Mentioned in document', message: 'You were mentioned in a shared document.' },
  { id: 'file_shared', title: 'File shared with you', message: 'A new file has been shared with you.' },
  { id: 'project_update_atlas', title: 'Project update: Atlas', message: 'The Atlas project has been updated.' },
  { id: 'deadline_reminder', title: 'Deadline reminder', message: 'Project deadline is approaching.' },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (expandedId === 'project_invite_nimbus' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [expandedId, onSuccess]);

  const filteredNotifications = notifications.filter(n =>
    searchQuery === '' || n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
        <Text fw={500} size="lg" mb="md">Notification Center</Text>

        <TextInput
          placeholder="Search notifications"
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb="md"
          data-testid="notif-search"
        />

        <Stack gap="xs">
          {filteredNotifications.map((notif) => (
            <Box
              key={notif.id}
              data-notif-id={notif.id}
              p="xs"
              style={{
                borderRadius: 4,
                border: '1px solid var(--mantine-color-gray-3)',
                backgroundColor: expandedId === notif.id ? 'var(--mantine-color-gray-0)' : 'transparent',
                cursor: 'pointer',
              }}
              onClick={() => toggleExpand(notif.id)}
              aria-expanded={expandedId === notif.id}
            >
              <Group gap="xs" wrap="nowrap">
                {expandedId === notif.id ? (
                  <IconChevronDown size={16} />
                ) : (
                  <IconChevronRight size={16} />
                )}
                <Text fw={500} size="sm">{notif.title}</Text>
              </Group>
              <Collapse in={expandedId === notif.id}>
                <Box mt="sm" pl="md">
                  <Text c="dimmed" size="sm" mb="sm">{notif.message}</Text>
                  <Group gap="xs">
                    <Button size="xs" variant="filled">Accept</Button>
                    <Button size="xs" variant="outline">Decline</Button>
                  </Group>
                </Box>
              </Collapse>
            </Box>
          ))}
        </Stack>
      </Card>

      {/* Footer distractor */}
      <Box mt="xl" p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        <TextInput placeholder="Enter email for newsletter" style={{ maxWidth: 300 }} />
      </Box>
    </div>
  );
}
