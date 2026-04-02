'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Drawer, Stack, Text, Notification, CloseButton, Group } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const blobUrlRef = useRef<Record<string, string>>({});

  useEffect(() => {
    blobUrlRef.current = {
      summary: createMockBlobUrl('summary-export.csv', 'Summary CSV'),
      full: createMockBlobUrl('export-center.csv', 'Full export CSV'),
    };
    return () => { Object.values(blobUrlRef.current).forEach(url => URL.revokeObjectURL(url)); };
  }, []);

  const handleDownload = (type: string) => {
    if (type === 'full' && !completed) {
      setShowNotification(true);
      setCompleted(true);
      onSuccess();
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '80vh', padding: 16 }}>
      <Button onClick={() => setDrawerOpen(true)} data-testid="open-export-drawer">
        Open export drawer
      </Button>
      <Drawer opened={drawerOpen} onClose={() => setDrawerOpen(false)} position="right" title="Export" size="sm">
        <Stack gap="md">
          <Button variant="outline" leftSection={<IconDownload size={16} />} fullWidth onClick={(e) => { e.preventDefault(); handleDownload('summary'); }}>
            Summary (.csv)
          </Button>
          <Button leftSection={<IconDownload size={16} />} fullWidth onClick={(e) => { e.preventDefault(); handleDownload('full'); }} data-testid="download-full-export">
            Full export (.csv)
          </Button>
        </Stack>
      </Drawer>
      {showNotification && (
        <Notification color="green" title="Success" onClose={() => setShowNotification(false)} style={{ position: 'fixed', bottom: 20, right: 20 }}>
          Download started: export-center.csv
        </Notification>
      )}
    </Box>
  );
}
