'use client';

/**
 * clipboard_copy-mantine-T03: Copy Public key (two instances)
 *
 * Layout: isolated_card, centered.
 * The card title is "Keys". It contains two rows, each with its own Mantine CopyButton:
 * - Public key: pub_mantine_1A2B3C  (target)
 * - Private key: priv_mantine_9Z8Y7X
 *
 * Each row uses a small ActionIcon wrapped in CopyButton. Clicking an icon copies its row's value and toggles the icon/tooltip to "Copied" briefly.
 *
 * Distractors: a "Regenerate keys" button (disabled) below the rows.
 * Requirement: instances=2; target instance is the Public key row.
 *
 * Success: Clipboard text equals "pub_mantine_1A2B3C".
 */

import React, { useState } from 'react';
import { Card, Text, Group, ActionIcon, Tooltip, Button, CopyButton as MantineCopyButton, Stack } from '@mantine/core';
import { IconCopy, IconCheck, IconRefresh } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);

  const handleCopyPublic = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('pub_mantine_1A2B3C', 'Public key');
    if (success) {
      setCompleted(true);
      onSuccess();
    }
  };

  const handleCopyPrivate = async () => {
    await copyToClipboard('priv_mantine_9Z8Y7X', 'Private key');
    // Does not complete the task
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }} data-testid="keys-card">
      <Text fw={500} size="lg" mb="md">Keys</Text>
      
      <Stack gap="md">
        {/* Public key row - target */}
        <Group justify="space-between">
          <Group>
            <Text size="sm" c="dimmed">Public key:</Text>
            <Text ff="monospace" size="sm">pub_mantine_1A2B3C</Text>
          </Group>
          <MantineCopyButton value="pub_mantine_1A2B3C" timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow>
                <ActionIcon
                  color={copied ? 'teal' : 'gray'}
                  variant="subtle"
                  onClick={() => {
                    copy();
                    handleCopyPublic();
                  }}
                  data-testid="copy-public-key"
                  aria-label="Copy public key"
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </MantineCopyButton>
        </Group>

        {/* Private key row */}
        <Group justify="space-between">
          <Group>
            <Text size="sm" c="dimmed">Private key:</Text>
            <Text ff="monospace" size="sm">priv_mantine_9Z8Y7X</Text>
          </Group>
          <MantineCopyButton value="priv_mantine_9Z8Y7X" timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow>
                <ActionIcon
                  color={copied ? 'teal' : 'gray'}
                  variant="subtle"
                  onClick={() => {
                    copy();
                    handleCopyPrivate();
                  }}
                  data-testid="copy-private-key"
                  aria-label="Copy private key"
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </MantineCopyButton>
        </Group>

        <Button
          variant="subtle"
          leftSection={<IconRefresh size={16} />}
          disabled
          data-testid="regenerate-button"
        >
          Regenerate keys
        </Button>
      </Stack>
    </Card>
  );
}
