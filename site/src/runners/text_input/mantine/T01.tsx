'use client';

/**
 * text_input-mantine-T01: Set username
 * 
 * Scene is a centered isolated card titled "Create account". It contains a single Mantine TextInput labeled
 * "Username" with an empty initial value and placeholder "your handle". No overlays, no additional fields,
 * and no confirmation button are required. Spacing is comfortable and the input is default size.
 * 
 * Success: The Mantine TextInput labeled "Username" has value "rivercat" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, TextInput, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === 'rivercat') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Create account</Text>
      <TextInput
        label="Username"
        placeholder="your handle"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        data-testid="username-input"
      />
    </Card>
  );
}
