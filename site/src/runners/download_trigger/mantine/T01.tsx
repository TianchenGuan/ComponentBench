'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Text, Group, Stack, Notification } from '@mantine/core';
import { IconDownload, IconEye } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('inventory-feb-2026.csv', 'SKU,Name,Quantity');
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Inventory export</Text>
      <Stack gap="md">
        <Group>
          <Button leftSection={<IconDownload size={16} />} onClick={(e) => { e.preventDefault(); handleDownload(); }} data-testid="download-button">
            Download inventory CSV
          </Button>
          <Button variant="subtle" leftSection={<IconEye size={16} />} onClick={() => setShowPreview(!showPreview)}>
            Preview
          </Button>
        </Group>
        <Text size="xs" c="dimmed">File size: 2.4 MB</Text>
        {showPreview && <Card withBorder p="sm"><Text size="sm">Preview: 1,234 items in inventory</Text></Card>}
      </Stack>
      {showNotification && (
        <Notification color="green" title="Success" onClose={() => setShowNotification(false)} style={{ position: 'fixed', bottom: 20, right: 20 }}>
          Download started: inventory-feb-2026.csv
        </Notification>
      )}
    </Card>
  );
}
