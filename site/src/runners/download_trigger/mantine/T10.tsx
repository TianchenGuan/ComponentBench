'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, ActionIcon, Menu, Notification, Tooltip } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('config-template.yaml', 'config:\n  setting: value');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleMenuClick = (item: string) => {
    if (item === 'config-yaml' && !completed) {
      setShowNotification(true);
      setCompleted(true);
      onSuccess();
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">Templates</Text>
      <Menu shadow="md" width={220} position="bottom-start">
        <Menu.Target>
          <Tooltip label="Download templates">
            <ActionIcon variant="light" size="sm" data-testid="templates-menu">
              <IconDownload size={16} />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => handleMenuClick('config-json')}>Config template (.json)</Menu.Item>
          <Menu.Item onClick={() => handleMenuClick('config-yaml')} data-testid="config-yaml-item">Config template (.yaml)</Menu.Item>
          <Menu.Item onClick={() => handleMenuClick('docker')}>Docker compose (.yaml)</Menu.Item>
          <Menu.Item onClick={() => handleMenuClick('env')}>Environment sample (.env)</Menu.Item>
          <Menu.Item onClick={() => handleMenuClick('deploy')}>Deploy script (.sh)</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      {showNotification && (
        <Notification color="green" title="Success" onClose={() => setShowNotification(false)} style={{ position: 'fixed', bottom: 20, right: 20 }}>
          Download started: config-template.yaml
        </Notification>
      )}
    </Card>
  );
}
