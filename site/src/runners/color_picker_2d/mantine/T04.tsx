'use client';

/**
 * color_picker_2d-mantine-T04: Clear Card background ColorInput
 *
 * Layout: isolated_card centered.
 * The card contains a single Mantine ColorInput labeled "Card background".
 * The input allows empty values (controlled state permits ''), and fixOnBlur is set to false so the component does NOT revert on blur when the value is empty.
 * Initial state: the field contains a valid color value (#C5D899).
 * The user must remove the value so the input becomes empty and shows its placeholder (e.g., "No background override").
 * The dropdown picker exists but is not required for this task.
 *
 * Success: Color value is cleared (no color selected / empty value).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#C5D899');
  const successFiredRef = useRef(false);

  useEffect(() => {
    if ((value === '' || value === null || value === undefined) && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Card Settings</Text>
      
      <Text size="sm" c="dimmed" mb="md">Card background: (clear to empty)</Text>
      
      <ColorInput
        label="Card background"
        placeholder="No background override"
        value={value}
        onChange={setValue}
        fixOnBlur={false}
        withPicker
        data-testid="card-background"
      />
      
      <Text size="xs" c="dimmed" mt="md">
        Clear the field completely to remove the background color.
      </Text>
    </Card>
  );
}
