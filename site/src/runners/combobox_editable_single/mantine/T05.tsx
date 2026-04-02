'use client';

/**
 * combobox_editable_single-mantine-T05: Match Team field to reference badge (dark theme)
 *
 * A dark-themed settings panel titled "Team assignment" contains one Mantine Autocomplete
 * input labeled "Team" and a visual reference badge.
 * - Scene: settings_panel layout, center placement, dark theme, comfortable spacing, default scale.
 * - Guidance: A "Reference" badge shows the target team.
 * - Options: Support, Sales, Marketing, Engineering, Finance, People Ops.
 * - Initial state: empty.
 * - Distractors: toggle "Auto-assign on signup" and a read-only text line.
 *
 * Success: The "Team" combobox value matches the text in the Reference badge.
 */

import React, { useState } from 'react';
import { Card, Text, Autocomplete, Switch, Badge, Stack, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const teams = ['Support', 'Sales', 'Marketing', 'Engineering', 'Finance', 'People Ops'];

// Deterministic reference value
const referenceTeam = 'Engineering';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === referenceTeam) {
      onSuccess();
    }
  };

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      style={{ width: 450, background: '#1a1b1e' }}
    >
      <Text fw={600} size="lg" mb="md" c="white">Team assignment</Text>
      
      <Group mb="md">
        <Text size="sm" c="dimmed">Reference:</Text>
        <Badge id="team-reference" color="green" variant="filled">
          {referenceTeam}
        </Badge>
      </Group>

      <Stack gap="md">
        <div>
          <Text fw={500} size="sm" mb={8} c="white">Team</Text>
          <Autocomplete
            data-testid="team-autocomplete"
            placeholder="Select team"
            data={teams}
            value={value}
            onChange={handleChange}
            styles={{
              input: { background: '#25262b', color: '#fff', borderColor: '#373a40' },
            }}
          />
        </div>

        <Switch 
          label="Auto-assign on signup" 
          styles={{ 
            label: { color: '#909296' },
          }}
        />

        <Text size="xs" c="dimmed">Last updated: today</Text>
      </Stack>
    </Card>
  );
}
