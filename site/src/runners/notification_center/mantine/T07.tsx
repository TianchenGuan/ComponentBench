'use client';

/**
 * notification_center-mantine-T07: Clear the archived notifications (confirm)
 *
 * setup_description:
 * The Notification Center is embedded in a settings_panel titled "Notifications".
 * The widget includes Tabs: All / Unread / Archived.
 * 
 * Initial state:
 *   - Active tab is All.
 *   - There are 6 archived notifications (archived_count = 6).
 * 
 * In the Archived tab header area there is a danger-styled button labeled "Clear archive".
 * Clicking it opens a centered Mantine Modal with:
 *   - title: "Clear archived notifications?"
 *   - buttons: "Cancel" and "Clear archive"
 * 
 * The task requires switching to the Archived tab, triggering the clear action, and confirming in the modal.
 * Feedback: after confirming, the archived list becomes empty and an inline status text appears: "No archived notifications."
 *
 * success_trigger: Archived count is 0 after clearing.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Tabs, Button, Stack, Box, Modal, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface Notification {
  id: string;
  title: string;
  archived: boolean;
}

const initialNotifications: Notification[] = [
  { id: '1', title: 'Active notification 1', archived: false },
  { id: '2', title: 'Active notification 2', archived: false },
  { id: '3', title: 'Archived item 1', archived: true },
  { id: '4', title: 'Archived item 2', archived: true },
  { id: '5', title: 'Archived item 3', archived: true },
  { id: '6', title: 'Archived item 4', archived: true },
  { id: '7', title: 'Archived item 5', archived: true },
  { id: '8', title: 'Archived item 6', archived: true },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState<string | null>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const successCalledRef = useRef(false);

  const archivedCount = notifications.filter(n => n.archived).length;
  const archivedNotifications = notifications.filter(n => n.archived);
  const activeNotifications = notifications.filter(n => !n.archived);

  useEffect(() => {
    if (archivedCount === 0 && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [archivedCount, onSuccess]);

  const handleClearArchive = () => {
    setNotifications(prev => prev.filter(n => !n.archived));
    setModalOpen(false);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
        <Text fw={500} size="xl" mb="lg">Notifications</Text>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="All">All</Tabs.Tab>
            <Tabs.Tab value="Unread">Unread</Tabs.Tab>
            <Tabs.Tab value="Archived">Archived ({archivedCount})</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="All" pt="md">
            <Stack gap="xs">
              {activeNotifications.map((notif) => (
                <Box key={notif.id} p="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                  <Text size="sm">{notif.title}</Text>
                </Box>
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="Unread" pt="md">
            <Text c="dimmed" ta="center" py="md">No unread notifications</Text>
          </Tabs.Panel>

          <Tabs.Panel value="Archived" pt="md">
            <Group justify="flex-end" mb="md">
              <Button
                color="red"
                variant="light"
                size="xs"
                onClick={() => setModalOpen(true)}
                disabled={archivedCount === 0}
              >
                Clear archive
              </Button>
            </Group>
            {archivedNotifications.length === 0 ? (
              <Text c="dimmed" ta="center" py="md">No archived notifications.</Text>
            ) : (
              <Stack gap="xs">
                {archivedNotifications.map((notif) => (
                  <Box key={notif.id} p="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                    <Text size="sm" c="dimmed">{notif.title}</Text>
                  </Box>
                ))}
              </Stack>
            )}
          </Tabs.Panel>
        </Tabs>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Clear archived notifications?"
        centered
      >
        <Text size="sm" mb="lg">
          This will permanently remove all archived notifications. This action cannot be undone.
        </Text>
        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleClearArchive}>
            Clear archive
          </Button>
        </Group>
      </Modal>
    </>
  );
}
