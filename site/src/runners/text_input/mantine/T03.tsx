'use client';

/**
 * text_input-mantine-T03: Clear label field
 * 
 * Scene is a centered isolated card titled "Tag editor". It contains one Mantine TextInput labeled "Label".
 * The input is pre-filled with "Draft". There is no dedicated clear button; clearing should be done by
 * selecting and deleting the text. No other text inputs or overlays exist. Spacing is comfortable and scale
 * is default.
 * 
 * Success: The TextInput labeled "Label" has an empty value (after trimming).
 */

import React, { useState, useEffect } from 'react';
import { Card, TextInput, Text } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Draft');

  useEffect(() => {
    if (value.trim() === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Tag editor</Text>
      <TextInput
        label="Label"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        data-testid="label-input"
      />
    </Card>
  );
}
