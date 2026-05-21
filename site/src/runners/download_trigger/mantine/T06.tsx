'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Button, Modal, Group, Checkbox, Notification } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('gdpr-export.csv', 'id,name,email,data');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleConfirm = () => {
    if (completed) return;
    setModalOpen(false);
    setShowNotification(true);
    setCompleted(true);
    onSuccess();
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">GDPR export</Text>
      <Button leftSection={<IconDownload size={16} />} onClick={() => setModalOpen(true)} data-testid="download-gdpr-export">
        Download GDPR export
      </Button>
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Confirm download">
        <Text size="sm" mb="md">This file contains sensitive personal data. Are you sure you want to download it?</Text>
        <Checkbox label="I understand" defaultChecked mb="md" />
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} data-testid="confirm-download">Download</Button>
        </Group>
      </Modal>
      {showNotification && (
        <Notification color="green" title="Success" onClose={() => setShowNotification(false)} style={{ position: 'fixed', bottom: 20, right: 20 }}>
          Download started: gdpr-export.csv
        </Notification>
      )}
    </Card>
  );
}
