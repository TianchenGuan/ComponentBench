'use client';

/**
 * textarea-mantine-T07: Compact meeting notes with bullets
 *
 * A centered card titled "Minutes" contains a Mantine Textarea labeled "Meeting notes".
 * - Light theme with compact spacing and small component scale.
 * - The textarea uses autosize=true (minRows=2, maxRows=8) and expands as you type.
 * - It starts empty and uses a smaller font size to match dense UI.
 * - A non-interactive "Word count" badge updates live (feedback only).
 * - No other textareas are present.
 *
 * Success: Value equals exactly (whitespace=exact):
 *   Meeting Notes
 *   - Attendees: Sam, Priya
 *   - Decision: Ship v2 on Monday
 *   - Action: Update release checklist
 */

import React, { useState, useEffect } from 'react';
import { Card, Textarea, Text, Badge, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = `Meeting Notes
- Attendees: Sam, Priya
- Decision: Ship v2 on Monday
- Action: Update release checklist`;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const normalize = (s: string) =>
      s.replace(/\r\n/g, '\n').split('\n').map((l) => l.trimEnd()).join('\n').trim();
    if (normalize(value) === normalize(TARGET_VALUE)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 400 }}>
      <Group justify="space-between" mb="sm">
        <Text fw={600} size="sm">
          Minutes
        </Text>
        <Badge size="xs" variant="light">
          {wordCount} words
        </Badge>
      </Group>
      <Textarea
        label="Meeting notes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autosize
        minRows={2}
        maxRows={8}
        size="xs"
        data-testid="textarea-meeting-notes"
        styles={{
          input: { fontSize: 12 },
        }}
      />
    </Card>
  );
}
