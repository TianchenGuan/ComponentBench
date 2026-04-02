'use client';

/**
 * toast_snackbar-mantine-T08: Generate report: notification updates from loading to ready
 *
 * setup_description:
 * Scene is a dashboard layout with high clutter: a top bar, side navigation, and several metric cards (all distractors).
 * In the main toolbar there is a button labeled "Generate report" (target). Clicking it triggers a Mantine notification sequence:
 * 1) Immediately shows a loading notification titled "Generating report" with message "Please wait…".
 * 2) After a short delay, the same notification is updated (via `notifications.update`) to title "Report ready" and message "Download is ready."
 * The notification remains visible long enough to be detected; no user confirmation inside the toast is required.
 *
 * success_trigger: A notification is visible whose title exactly equals "Report ready".
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Button, Group, Box, Stack, Paper } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconLoader2, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const REPORT_NOTIFICATION_ID = 'report-notification';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkNotification = () => {
      const notificationTitle = document.querySelector('.mantine-Notification-title');
      if (notificationTitle?.textContent === 'Report ready') {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkNotification);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  const handleGenerateReport = () => {
    // Show loading notification
    notifications.show({
      id: REPORT_NOTIFICATION_ID,
      title: 'Generating report',
      message: 'Please wait…',
      loading: true,
      autoClose: false,
      withCloseButton: false,
    });

    // Update to ready after delay
    setTimeout(() => {
      notifications.update({
        id: REPORT_NOTIFICATION_ID,
        title: 'Report ready',
        message: 'Download is ready.',
        loading: false,
        autoClose: 5000,
        withCloseButton: true,
        icon: <IconCheck size={16} />,
        color: 'green',
      });
    }, 1500);
  };

  return (
    <Box>
      {/* Dashboard header/toolbar */}
      <Paper shadow="xs" p="md" mb="md" style={{ width: 700 }}>
        <Group justify="space-between">
          <Text fw={600}>Dashboard</Text>
          <Group>
            <Button variant="subtle" size="xs">Settings</Button>
            <Button variant="subtle" size="xs">Help</Button>
            <Button onClick={handleGenerateReport} data-testid="generate-report-btn">
              Generate report
            </Button>
          </Group>
        </Group>
      </Paper>

      {/* Dashboard content with metric cards (distractors) */}
      <Group align="flex-start">
        {/* Sidebar */}
        <Paper shadow="xs" p="md" style={{ width: 150 }}>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Navigation</Text>
            <Text size="sm">Overview</Text>
            <Text size="sm">Analytics</Text>
            <Text size="sm">Reports</Text>
            <Text size="sm">Settings</Text>
          </Stack>
        </Paper>

        {/* Main content area */}
        <Stack style={{ flex: 1 }}>
          <Group>
            <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 160 }}>
              <Text size="xs" c="dimmed">Total Users</Text>
              <Text size="xl" fw={700}>12,345</Text>
            </Card>
            <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 160 }}>
              <Text size="xs" c="dimmed">Revenue</Text>
              <Text size="xl" fw={700}>$45,678</Text>
            </Card>
            <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 160 }}>
              <Text size="xs" c="dimmed">Active Now</Text>
              <Text size="xl" fw={700}>234</Text>
            </Card>
          </Group>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text fw={500} mb="xs">Recent Activity</Text>
            <Text size="sm" c="dimmed">User signups, transactions, and system events appear here.</Text>
          </Card>
        </Stack>
      </Group>
    </Box>
  );
}
