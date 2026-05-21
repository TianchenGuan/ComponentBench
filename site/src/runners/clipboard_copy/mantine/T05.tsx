'use client';

/**
 * clipboard_copy-mantine-T05: Open drawer and copy personal access token
 *
 * Layout: drawer_flow, centered.
 * The page shows a small card titled "Access tokens" with a button "View token".
 *
 * Clicking "View token" opens a Mantine Drawer that slides in from the right. Inside the drawer:
 * - A labeled row "Personal access token" displays "mantine_pat_55C0A1" in monospace text.
 * - A Mantine CopyButton is placed next to the token (implemented as a small ActionIcon with Tooltip).
 * - A close button (X) at the top is a distractor.
 *
 * Component behavior:
 * - Clicking the copy ActionIcon copies the token and changes Tooltip to "Copied" for the timeout.
 * - Drawer stays open; closing it is optional.
 *
 * Initial state: drawer closed; token not visible until opened.
 *
 * Success: Clipboard text equals "mantine_pat_55C0A1".
 */

import React, { useState } from 'react';
import { Card, Text, Button, Drawer, Group, ActionIcon, Tooltip, CopyButton as MantineCopyButton, Stack } from '@mantine/core';
import { IconCopy, IconCheck, IconKey } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const token = 'mantine_pat_55C0A1';

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard(token, 'Personal access token');
    if (success) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 300 }} data-testid="tokens-card">
        <Text fw={500} size="lg" mb="md">Access tokens</Text>
        
        <Button
          leftSection={<IconKey size={16} />}
          onClick={() => setDrawerOpen(true)}
          data-testid="view-token-button"
        >
          View token
        </Button>
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Token details"
        position="right"
        size="md"
        data-testid="token-drawer"
      >
        <Stack gap="lg" p="md">
          <Group>
            <Text size="sm" c="dimmed">Personal access token:</Text>
          </Group>
          <Group>
            <Text ff="monospace" fw={500}>{token}</Text>
            <MantineCopyButton value={token} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow>
                  <ActionIcon
                    color={copied ? 'teal' : 'gray'}
                    variant="subtle"
                    onClick={() => {
                      copy();
                      handleCopy();
                    }}
                    data-testid="copy-token-button"
                    aria-label="Copy personal access token"
                  >
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </MantineCopyButton>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
