'use client';

/**
 * checkbox_group-mantine-T03: Clear all Team tools selections
 *
 * Scene: light theme; comfortable spacing; a single isolated card centered in the viewport.
 * Mantine isolated card titled "Project setup".
 * A Checkbox.Group labeled "Team tools" includes four options:
 * Slack, Jira, GitHub, Notion.
 * Initial state: Slack and GitHub are checked; Jira and Notion are unchecked.
 * Success: The 'Team tools' checkbox group has no options checked.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Checkbox, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = ['Slack', 'Jira', 'GitHub', 'Notion'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Slack', 'GitHub']);

  useEffect(() => {
    if (selected.length === 0) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Project setup</Text>
      <Text fw={500} size="sm" mb="xs">Team tools</Text>
      <Checkbox.Group
        data-testid="cg-team-tools"
        value={selected}
        onChange={setSelected}
      >
        <Stack gap="xs">
          {options.map(option => (
            <Checkbox key={option} value={option} label={option} />
          ))}
        </Stack>
      </Checkbox.Group>
    </Card>
  );
}
