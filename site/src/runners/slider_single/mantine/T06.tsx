'use client';

/**
 * slider_single-mantine-T06: Set Autosave interval to 10 minutes (compact settings panel)
 * 
 * Layout: settings_panel anchored near the top-right of the viewport (not centered).
 * The panel contains several setting rows (checkboxes, small select inputs) but only one slider labeled "Autosave interval (minutes)".
 * Spacing is compact: labels and controls are closer together than default, and the slider track is slightly shorter.
 * Slider configuration: range 1–30, step=1. Marks are hidden to reduce direct visual landmarks.
 * Initial state: Autosave interval starts at 5 minutes.
 * Feedback: a small pill to the right of the label shows the current value (e.g., "5 min") and updates immediately as the slider changes.
 * No Apply/Cancel; changes are immediate.
 * 
 * Success: The 'Autosave interval' slider value equals 10.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Slider, Switch, Select, Group, Badge, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(5);
  const [autoFormat, setAutoFormat] = useState(true);
  const [theme, setTheme] = useState<string | null>('light');
  const [fontSize, setFontSize] = useState<string | null>('14');

  useEffect(() => {
    if (value === 10) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={600} size="lg" mb="md">Editor settings</Text>
      
      <Stack gap="sm">
        <Group justify="space-between">
          <Text size="sm">Auto-format on save</Text>
          <Switch
            checked={autoFormat}
            onChange={(e) => setAutoFormat(e.currentTarget.checked)}
            size="sm"
          />
        </Group>

        <div>
          <Text size="sm" mb={4}>Theme</Text>
          <Select
            value={theme}
            onChange={setTheme}
            data={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' },
            ]}
            size="xs"
          />
        </div>

        <div>
          <Text size="sm" mb={4}>Font size</Text>
          <Select
            value={fontSize}
            onChange={setFontSize}
            data={[
              { value: '12', label: '12px' },
              { value: '14', label: '14px' },
              { value: '16', label: '16px' },
              { value: '18', label: '18px' },
            ]}
            size="xs"
          />
        </div>

        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm">Autosave interval (minutes)</Text>
            <Badge size="sm" variant="light">{value} min</Badge>
          </Group>
          <Slider
            value={value}
            onChange={setValue}
            min={1}
            max={30}
            step={1}
            size="sm"
            data-testid="slider-autosave-interval"
          />
        </div>
      </Stack>
    </Card>
  );
}
