'use client';

/**
 * clipboard_copy-mantine-T01: Copy coupon code (CopyButton)
 *
 * Layout: isolated_card, centered.
 * The card title is "Your coupon". It shows the coupon code in a monospace pill: "SAVE-20-NY".
 *
 * To the right is a Mantine CopyButton wrapped around a normal Mantine Button labeled "Copy".
 * Component behavior (CopyButton):
 * - On click, it copies the coupon code value and changes the button label to "Copied" for a short timeout.
 * - No additional confirmation is required.
 *
 * Distractors: none. Initial state: button label is "Copy".
 *
 * Success: Clipboard text equals "SAVE-20-NY".
 */

import React, { useState } from 'react';
import { Card, Text, Button, Group, Badge, CopyButton as MantineCopyButton, Stack } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('SAVE-20-NY', 'Coupon code');
    if (success) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }} data-testid="coupon-card">
      <Text fw={500} size="lg" mb="md">Your coupon</Text>
      
      <Stack gap="md">
        <Group>
          <Badge
            size="lg"
            variant="light"
            style={{ fontFamily: 'monospace', fontSize: 16 }}
            data-testid="coupon-code"
          >
            SAVE-20-NY
          </Badge>
          
          <MantineCopyButton value="SAVE-20-NY" timeout={2000}>
            {({ copied, copy }) => (
              <Button
                color={copied ? 'teal' : 'blue'}
                leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                onClick={() => {
                  copy();
                  handleCopy();
                }}
                data-testid="copy-button"
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </MantineCopyButton>
        </Group>
      </Stack>
    </Card>
  );
}
