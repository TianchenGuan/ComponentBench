'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Anchor, Stack, Title, Notification, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const blobUrlRef = useRef<Record<string, string>>({});

  useEffect(() => {
    blobUrlRef.current = {
      guidelines: createMockBlobUrl('brand-guidelines.pdf', 'Brand guidelines PDF'),
      logo: createMockBlobUrl('logo-pack.zip', 'Logo pack ZIP'),
    };
    return () => { Object.values(blobUrlRef.current).forEach(url => URL.revokeObjectURL(url)); };
  }, []);

  const handleDownload = (type: string) => {
    if (type === 'logo' && !completed) {
      setShowNotification(true);
      setCompleted(true);
      onSuccess();
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <Box style={{ height: 800, overflow: 'auto' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500, minHeight: 1000 }}>
        <Title order={3} mb="md">Brand kit</Title>
        <Text mb="xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</Text>
        <Text mb="xl">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
        <Box style={{ marginTop: 400 }}>
          <Title order={4} mb="md">Attachments</Title>
          <Stack gap="sm">
            <Anchor href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); handleDownload('guidelines'); }} style={{ cursor: 'pointer' }}>
              Brand guidelines
            </Anchor>
            <Anchor href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); handleDownload('logo'); }} data-testid="download-logo-pack" style={{ cursor: 'pointer' }}>
              Logo pack
            </Anchor>
          </Stack>
        </Box>
      </Card>
      {showNotification && (
        <Notification color="green" title="Success" onClose={() => setShowNotification(false)} style={{ position: 'fixed', bottom: 20, right: 20 }}>
          Download started: logo-pack.zip
        </Notification>
      )}
    </Box>
  );
}
