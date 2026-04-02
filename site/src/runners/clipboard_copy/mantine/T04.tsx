'use client';

/**
 * clipboard_copy-mantine-T04: Hover to reveal copy on curl snippet
 *
 * Layout: isolated_card, anchored near the top-left of the viewport (placement=top_left).
 * The card title is "Test request". It contains a single code snippet block:
 *     curl https://api.example.com/ping
 *
 * The snippet has a Mantine ActionIcon wrapped in CopyButton in the top-right corner of the snippet, but it is only visible when the user hovers/focuses the snippet (disclosed control).
 *
 * Component behavior:
 * - Clicking the revealed icon copies the full snippet text to clipboard.
 * - Tooltip changes from "Copy" to "Copied" for the timeout; icon swaps to a checkmark.
 *
 * Distractors: none. Initial state: copy icon hidden; not copied.
 *
 * Success: Clipboard text equals "curl https://api.example.com/ping".
 */

import React, { useState } from 'react';
import { Card, Text, ActionIcon, Tooltip, CopyButton as MantineCopyButton, Box, Stack } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const command = 'curl https://api.example.com/ping';

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard(command, 'Curl command');
    if (success) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }} data-testid="test-request-card">
      <Text fw={500} size="lg" mb="md">Test request</Text>
      
      <Stack gap="md">
        <Box
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'relative',
            background: '#1a1b1e',
            color: '#c9d1d9',
            padding: 16,
            borderRadius: 8,
            fontFamily: 'monospace',
            fontSize: 14,
          }}
          data-testid="code-snippet"
        >
          {command}
          
          <MantineCopyButton value={command} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow>
                <ActionIcon
                  color={copied ? 'teal' : 'gray'}
                  variant="subtle"
                  onClick={() => {
                    copy();
                    handleCopy();
                  }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.2s',
                  }}
                  data-testid="copy-code-button"
                  aria-label="Copy curl command"
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </MantineCopyButton>
        </Box>
      </Stack>
    </Card>
  );
}
