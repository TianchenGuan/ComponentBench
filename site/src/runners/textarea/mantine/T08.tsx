'use client';

/**
 * textarea-mantine-T08: Copy a curl command from an image (dark theme)
 *
 * A centered "Webhook tester" card contains:
 * - Dark theme with comfortable spacing and default scale.
 * - One Mantine Textarea labeled "Command", initially empty, styled as monospace.
 * - A "Reference" panel shows an IMAGE of a two-line curl command (not selectable).
 * - A non-interactive "Run" button exists as a distractor but is not required.
 *
 * Success: Value equals exactly (whitespace=exact):
 *   curl -X POST https://api.example.com/hook
 *   -H "Content-Type: application/json"
 */

import React, { useState, useEffect } from 'react';
import { Card, Textarea, Text, Button, Box, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = `curl -X POST https://api.example.com/hook
-H "Content-Type: application/json"`;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const normalized = value.replace(/\r\n/g, '\n');
    if (normalized === TARGET_VALUE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ width: 500, background: '#1f1f1f', borderColor: '#303030' }}
    >
      <Text fw={600} size="lg" mb="md" c="white">
        Webhook tester
      </Text>

      {/* Reference panel */}
      <Box mb="md">
        <Text size="xs" c="dimmed" mb={4}>
          Reference (type this exactly)
        </Text>
        <Box
          style={{
            padding: 12,
            background: '#2a2a2a',
            borderRadius: 4,
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#888',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          data-testid="reference-image"
        >
          <div>curl -X POST https://api.example.com/hook</div>
          <div>-H &quot;Content-Type: application/json&quot;</div>
        </Box>
      </Box>

      <Textarea
        label="Command"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        minRows={3}
        data-testid="textarea-command"
        styles={{
          input: {
            fontFamily: 'monospace',
            background: '#141414',
            borderColor: '#434343',
            color: '#fff',
          },
          label: { color: '#fff' },
        }}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="light" disabled data-testid="btn-run">
          Run
        </Button>
      </Group>
    </Card>
  );
}
