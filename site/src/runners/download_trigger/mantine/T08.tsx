'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, SimpleGrid, Box, ActionIcon, Notification, MantineProvider } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { createMockBlobUrl } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    blobUrlRef.current = createMockBlobUrl('finance-sheet.xlsx', 'Excel spreadsheet data');
    return () => { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); };
  }, []);

  const handleDownload = (id: string) => {
    if (id === 'B' && !completed) {
      setShowNotification(true);
      setCompleted(true);
      onSuccess();
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const patternA = { background: 'linear-gradient(45deg, #ff6b6b, #feca57)', width: '100%', height: 60, borderRadius: 4 };
  const patternB = { background: 'linear-gradient(135deg, #48dbfb, #ff9ff3)', width: '100%', height: 60, borderRadius: 4 };
  const referencePattern = { background: 'linear-gradient(135deg, #48dbfb, #ff9ff3)', width: 40, height: 40, borderRadius: 4 };

  return (
    <MantineProvider forceColorScheme="dark">
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 400, background: '#1a1b1e' }}>
        <Text fw={500} size="lg" mb="xs" c="white">Finance sheets</Text>
        <Box mb="md" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Box style={referencePattern} />
          <Text size="xs" c="dimmed">Reference preview</Text>
        </Box>
        <SimpleGrid cols={2} spacing="sm">
          {[{ id: 'A', pattern: patternA }, { id: 'B', pattern: patternB }].map(item => (
            <Card key={item.id} withBorder p="xs" style={{ position: 'relative', background: '#25262b' }}>
              <ActionIcon variant="light" size="sm" style={{ position: 'absolute', top: 4, right: 4 }} onClick={(e) => { e.preventDefault(); handleDownload(item.id); }} data-testid={`download-sheet-${item.id.toLowerCase()}`}>
                <IconDownload size={14} />
              </ActionIcon>
              <Box style={item.pattern} mt={24} />
              <Text size="xs" mt="xs" c="white">Sheet {item.id}</Text>
            </Card>
          ))}
        </SimpleGrid>
        {showNotification && (
          <Notification color="green" title="Success" onClose={() => setShowNotification(false)} style={{ position: 'fixed', bottom: 20, right: 20 }}>
            Download started: finance-sheet.xlsx
          </Notification>
        )}
      </Card>
    </MantineProvider>
  );
}
