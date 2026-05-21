'use client';

/**
 * toast_snackbar-mantine-T06: Match reference (mixed): show the bordered notification variant
 *
 * setup_description:
 * Scene is an isolated card titled "Notification variants".
 * At the top of the card there is a non-interactive sample labeled "Target sample: bordered". The sample shows a notification with a visible border and the label "Bordered".
 * Below the sample are two buttons:
 * - "Show bordered" (target) → triggers a notification titled "Bordered notice"
 * - "Show borderless" (distractor) → triggers a notification titled "Borderless notice"
 * Both notifications share the same body text "Variant demo." to increase reliance on the title/sample.
 *
 * success_trigger: A notification toast is visible with title exactly "Bordered notice".
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Button, Group, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkNotification = () => {
      const notificationTitle = document.querySelector('.mantine-Notification-title');
      if (notificationTitle?.textContent === 'Bordered notice') {
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

  const handleShowBordered = () => {
    notifications.show({
      title: 'Bordered notice',
      message: 'Variant demo.',
      withBorder: true,
      autoClose: 4000,
    });
  };

  const handleShowBorderless = () => {
    notifications.show({
      title: 'Borderless notice',
      message: 'Variant demo.',
      withBorder: false,
      autoClose: 4000,
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Notification variants</Text>

      {/* Target sample */}
      <Box mb="md">
        <Text size="xs" c="dimmed" tt="uppercase" mb="xs">
          Target sample: bordered
        </Text>
        <Box
          data-testid="target-sample"
          id="target_sample_bordered"
          style={{
            padding: '12px 16px',
            border: '1px solid #dee2e6',
            borderRadius: 8,
            backgroundColor: '#f8f9fa',
          }}
        >
          <Text fw={500}>Bordered</Text>
        </Box>
      </Box>

      {/* Buttons */}
      <Group>
        <Button onClick={handleShowBordered} data-testid="show-bordered-btn">
          Show bordered
        </Button>
        <Button variant="outline" onClick={handleShowBorderless} data-testid="show-borderless-btn">
          Show borderless
        </Button>
      </Group>
    </Card>
  );
}
