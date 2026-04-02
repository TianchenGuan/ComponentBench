'use client';

/**
 * textarea-mantine-T06: Follow-up template from mixed reference
 *
 * A centered card titled "Email template" contains:
 * - Light theme, comfortable spacing, default scale.
 * - One Mantine Textarea labeled "Template text", initially empty, minRows=2.
 * - Above the textarea is a reference area:
 *   - A read-only monospace block showing the first line ("Subject: Follow-up") as selectable text.
 *   - Next to it, an IMAGE showing the complete two-line template with the exact line break.
 * - No other textareas are present; minimal clutter.
 *
 * Success: Value equals exactly (whitespace=exact):
 *   Subject: Follow-up
 *   Body: Checking in on your request.
 */

import React, { useState, useEffect } from 'react';
import { Card, Textarea, Text, Group, Box, Code } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = `Subject: Follow-up
Body: Checking in on your request.`;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const normalized = value.replace(/\r\n/g, '\n');
    if (normalized === TARGET_VALUE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">
        Email template
      </Text>

      {/* Reference section */}
      <Group mb="md" align="flex-start">
        <Box style={{ flex: 1 }}>
          <Text size="xs" c="dimmed" mb={4}>
            Text hint
          </Text>
          <Code block style={{ fontSize: 12 }}>
            Subject: Follow-up
          </Code>
        </Box>
        <Box style={{ width: 200 }}>
          <Text size="xs" c="dimmed" mb={4}>
            Full reference (image)
          </Text>
          {/* Simulated image - non-selectable */}
          <Box
            style={{
              padding: 8,
              background: '#f5f5f5',
              borderRadius: 4,
              fontFamily: 'monospace',
              fontSize: 11,
              color: '#666',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            data-testid="reference-image"
          >
            <div>Subject: Follow-up</div>
            <div>Body: Checking in on your request.</div>
          </Box>
        </Box>
      </Group>

      <Textarea
        label="Template text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        minRows={2}
        data-testid="textarea-template-text"
      />
    </Card>
  );
}
