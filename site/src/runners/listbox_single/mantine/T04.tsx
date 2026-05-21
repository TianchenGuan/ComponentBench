'use client';

/**
 * listbox_single-mantine-T04: Devices: set Backup to Tablet
 *
 * Scene: light theme, comfortable spacing, form_section layout, placed at center of the viewport.
 * Component scale is default. Page contains 2 instance(s) of this listbox type; guidance is text; clutter is low.
 * A form_section layout shows two cards stacked vertically. The top card is labeled "Primary device" and contains
 * a NavLink-based single-select list with options "Laptop", "Desktop", "Tablet", "Phone"; initial active is "Laptop".
 * The second card is labeled "Backup device" with the same options; initial active is "Phone".
 * Both lists look identical and are close together. The task target is the second list labeled "Backup device".
 *
 * Success: Selected option value equals: tablet (in Backup device)
 * require_correct_instance: true
 */

import React, { useState } from 'react';
import { Card, Text, NavLink, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'laptop', label: 'Laptop' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'phone', label: 'Phone' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [primarySelected, setPrimarySelected] = useState<string>('laptop');
  const [backupSelected, setBackupSelected] = useState<string>('phone');

  const handlePrimarySelect = (value: string) => {
    setPrimarySelected(value);
  };

  const handleBackupSelect = (value: string) => {
    setBackupSelected(value);
    if (value === 'tablet') {
      onSuccess();
    }
  };

  return (
    <Stack gap="lg" style={{ width: 360 }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={600} size="lg" mb="md">Primary device</Text>
        <Stack
          gap="xs"
          data-cb-listbox-root
          data-cb-instance="primary"
          data-cb-selected-value={primarySelected}
          role="listbox"
        >
          {options.map(opt => (
            <NavLink
              key={opt.value}
              label={opt.label}
              active={primarySelected === opt.value}
              onClick={() => handlePrimarySelect(opt.value)}
              data-cb-option-value={opt.value}
              role="option"
              aria-selected={primarySelected === opt.value}
            />
          ))}
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={600} size="lg" mb="md">Backup device</Text>
        <Stack
          gap="xs"
          data-cb-listbox-root
          data-cb-instance="backup"
          data-cb-selected-value={backupSelected}
          role="listbox"
        >
          {options.map(opt => (
            <NavLink
              key={opt.value}
              label={opt.label}
              active={backupSelected === opt.value}
              onClick={() => handleBackupSelect(opt.value)}
              data-cb-option-value={opt.value}
              role="option"
              aria-selected={backupSelected === opt.value}
            />
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
