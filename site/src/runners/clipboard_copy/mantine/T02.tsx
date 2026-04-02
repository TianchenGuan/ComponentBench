'use client';

/**
 * clipboard_copy-mantine-T02: Copy support email (ActionIcon)
 *
 * Layout: isolated_card, centered.
 * The card title is "Contact support". It shows one line:
 * - Support email: help@acme.example
 *
 * To the right of the email is a small Mantine ActionIcon wrapped in Mantine CopyButton (clipboard_copy component).
 * Component behavior:
 * - Clicking the icon copies the email to the clipboard and the icon briefly switches to a checkmark state (copied=true) for the timeout.
 * - A Tooltip changes from "Copy" to "Copied".
 *
 * Distractors: none. Initial state: Tooltip says "Copy", not copied.
 *
 * Success: Clipboard text equals "help@acme.example".
 */

import React, { useState } from 'react';
import { Card, Text, Group, ActionIcon, Tooltip, CopyButton as MantineCopyButton, Stack } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('help@acme.example', 'Support email');
    if (success) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }} data-testid="contact-card">
      <Text fw={500} size="lg" mb="md">Contact support</Text>
      
      <Stack gap="md">
        <Group>
          <Text size="sm" c="dimmed">Support email:</Text>
          <Text fw={500}>help@acme.example</Text>
          
          <MantineCopyButton value="help@acme.example" timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow>
                <ActionIcon
                  color={copied ? 'teal' : 'gray'}
                  variant="subtle"
                  onClick={() => {
                    copy();
                    handleCopy();
                  }}
                  data-testid="copy-email-button"
                  aria-label="Copy support email"
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </MantineCopyButton>
        </Group>
      </Stack>
    </Card>
  );
}
