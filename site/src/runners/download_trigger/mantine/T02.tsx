'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Anchor, Stack, Notification } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('onboarding-guide.pdf', 'Onboarding Guide PDF');
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
      <Text fw={500} size="lg" mb="md">Getting started</Text>
      <Text size="sm" c="dimmed" mb="md">Welcome to our platform. Download the onboarding guide or read online.</Text>
      <Stack gap="sm">
        <Anchor href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); handleDownload(); }} data-testid="download-guide" style={{ cursor: 'pointer' }}>
          Download onboarding guide
        </Anchor>
        <Anchor href="#" onClick={(e) => e.preventDefault()}>Read online</Anchor>
      </Stack>
      {showNotification && (
        <Notification color="green" title="Success" onClose={() => setShowNotification(false)} style={{ position: 'fixed', bottom: 20, right: 20 }}>
          Download started: onboarding-guide.pdf
        </Notification>
      )}
    </Card>
  );
}
