'use client';

/**
 * text_input-mantine-T02: Set workspace name with icon section
 * 
 * Scene is an isolated card centered in the viewport titled "New workspace". It contains one Mantine TextInput
 * labeled "Workspace name". The TextInput includes a small icon rendered in the left section (leftSection),
 * but the field behaves like a standard single-line input. Initial value is empty. No other text inputs or
 * overlays are present; spacing is comfortable and scale is default.
 * 
 * Success: The TextInput labeled "Workspace name" has value "Nimbus" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, TextInput, Text } from '@mantine/core';
import { IconBuildingSkyscraper } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === 'Nimbus') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">New workspace</Text>
      <TextInput
        label="Workspace name"
        leftSection={<IconBuildingSkyscraper size={16} />}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        data-testid="workspace-name-input"
      />
    </Card>
  );
}
