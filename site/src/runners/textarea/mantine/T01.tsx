'use client';

/**
 * textarea-mantine-T01: Simple feedback sentence
 *
 * A centered card titled "Feedback form" contains one Mantine Textarea labeled "Feedback".
 * - Light theme, comfortable spacing, default scale.
 * - The textarea starts empty with placeholder "Write your feedback…".
 * - No other textareas or required buttons are present.
 *
 * Success: Value equals "Please add more examples." (trim whitespace)
 */

import React, { useState, useEffect } from 'react';
import { Card, Textarea, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === 'Please add more examples.') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">
        Feedback form
      </Text>
      <Textarea
        label="Feedback"
        placeholder="Write your feedback…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        minRows={3}
        data-testid="textarea-feedback"
      />
    </Card>
  );
}
