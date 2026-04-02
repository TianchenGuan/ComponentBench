'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Group, ActionIcon, Avatar, Notification, Tooltip } from '@mantine/core';
import { IconDownload, IconPencil } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('avatar.png', 'PNG image data');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleDownload = () => {
    if (completed) return;
    setShowNotification(true);
    setCompleted(true);
    onSuccess();
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">Profile</Text>
      <Group>
        <Avatar size="xl" radius="xl" color="blue">JD</Avatar>
        <Group gap="xs">
          <Tooltip label="Download avatar">
            <ActionIcon variant="light" onClick={(e) => { e.preventDefault(); handleDownload(); }} aria-label="Download avatar" data-testid="download-avatar">
              <IconDownload size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit avatar">
            <ActionIcon variant="light"><IconPencil size={16} /></ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      {showNotification && (
        <Notification color="green" title="Success" onClose={() => setShowNotification(false)} style={{ position: 'fixed', bottom: 20, right: 20 }}>
          Download started: avatar.png
        </Notification>
      )}
    </Card>
  );
}
