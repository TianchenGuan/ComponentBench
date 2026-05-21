'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Button, Menu, Notification } from '@mantine/core';
import { IconDownload, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('kpi-snapshot.png', 'PNG image data');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleMenuClick = (format: string) => {
    if (format === 'png' && !completed) {
      setShowNotification(true);
      setCompleted(true);
      onSuccess();
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">KPI snapshot</Text>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button leftSection={<IconDownload size={16} />} rightSection={<IconChevronDown size={14} />} data-testid="download-menu">
            Download
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => handleMenuClick('png')} data-testid="download-png">PNG</Menu.Item>
          <Menu.Item onClick={() => handleMenuClick('pdf')}>PDF</Menu.Item>
          <Menu.Item onClick={() => handleMenuClick('csv')}>CSV</Menu.Item>
          <Menu.Divider />
          <Menu.Item disabled>Send by email</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      {showNotification && (
        <Notification color="green" title="Success" onClose={() => setShowNotification(false)} style={{ position: 'fixed', bottom: 20, right: 20 }}>
          Download started: kpi-snapshot.png
        </Notification>
      )}
    </Card>
  );
}
