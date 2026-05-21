'use client';

/**
 * toolbar-mantine-T01: Click Share in Mantine actions toolbar
 *
 * A centered isolated card shows a Mantine Group acting as a toolbar labeled "Actions". 
 * It contains three Buttons: "Download", "Share", and "Delete".
 * Below the toolbar, a read-only status line shows "Last action: …" and initially displays "None".
 */

import React, { useState } from 'react';
import { Paper, Group, Button, Text, Title } from '@mantine/core';
import { IconDownload, IconShare, IconTrash } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [lastAction, setLastAction] = useState<string>('None');

  const handleAction = (action: string) => {
    setLastAction(action);
    if (action.toLowerCase() === 'share') {
      onSuccess();
    }
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 400 }}>
      <Title order={5} mb="md">
        Actions
      </Title>

      <Group gap="sm" mb="md" data-testid="mantine-toolbar-actions">
        <Button
          leftSection={<IconDownload size={16} />}
          variant="default"
          onClick={() => handleAction('Download')}
          data-testid="mantine-toolbar-actions-download"
        >
          Download
        </Button>
        <Button
          leftSection={<IconShare size={16} />}
          variant="default"
          onClick={() => handleAction('Share')}
          data-testid="mantine-toolbar-actions-share"
        >
          Share
        </Button>
        <Button
          leftSection={<IconTrash size={16} />}
          variant="default"
          color="red"
          onClick={() => handleAction('Delete')}
          data-testid="mantine-toolbar-actions-delete"
        >
          Delete
        </Button>
      </Group>

      <Text size="sm" c="dimmed">
        Last action: {lastAction}
      </Text>
    </Paper>
  );
}
