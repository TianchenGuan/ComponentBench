'use client';

/**
 * text_input-mantine-T08: Clear field using right-section X button (small/compact)
 * 
 * Scene is an isolated card centered in the viewport with compact spacing and small component scale. It
 * contains one Mantine TextInput labeled "Document title", pre-filled with "Quarterly report". A small 'X'
 * CloseButton is rendered inside the input on the right (via TextInput rightSection) to act as a clear
 * control; the button is only visible/enabled when the field has text. No other text inputs or overlays are present.
 * 
 * Success: The TextInput labeled "Document title" has an empty value (after trimming).
 */

import React, { useState, useEffect } from 'react';
import { Card, TextInput, Text, CloseButton } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Quarterly report');

  useEffect(() => {
    if (value.trim() === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="md" mb="sm">Document</Text>
      <TextInput
        label="Document title"
        size="sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rightSection={
          value && (
            <CloseButton
              size="sm"
              onClick={() => setValue('')}
              aria-label="Clear input"
              data-testid="clear-btn"
            />
          )
        }
        data-testid="document-title-input"
      />
    </Card>
  );
}
