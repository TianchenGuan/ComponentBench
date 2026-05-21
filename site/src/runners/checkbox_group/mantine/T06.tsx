'use client';

/**
 * checkbox_group-mantine-T06: Pick three topics from a scrollable list
 *
 * Scene: light theme; compact spacing; a settings panel centered in the viewport.
 * Mantine settings panel page (light theme) with compact spacing.
 * A panel titled "Email digests" contains one Checkbox.Group labeled "Topics".
 * The group is inside a scrollable area with about 15 topic options:
 * Announcements, Product news, Tips & tricks, Community stories, Events, Surveys, 
 * Billing reminders, Security updates, Performance alerts, Release notes, API changes, etc.
 * Initial state: Announcements and Tips & tricks are checked by default.
 * Success: Exactly Product news, Security updates, and Release notes are checked.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Checkbox, Stack, Box, ScrollArea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const topicOptions = [
  'Announcements', 'Product news', 'Tips & tricks', 'Community stories', 
  'Events', 'Surveys', 'Billing reminders', 'Security updates', 
  'Performance alerts', 'Release notes', 'API changes', 'Beta features',
  'Partner updates', 'Maintenance notices', 'Feature requests'
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Announcements', 'Tips & tricks']);

  useEffect(() => {
    const targetSet = new Set(['Product news', 'Security updates', 'Release notes']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="sm">Email digests</Text>
      <Text fw={500} size="sm" mb="xs">Topics</Text>
      <ScrollArea h={250} data-testid="cg-topics-scroll">
        <Checkbox.Group
          data-testid="cg-topics"
          value={selected}
          onChange={setSelected}
        >
          <Stack gap={6}>
            {topicOptions.map(topic => (
              <Checkbox key={topic} value={topic} label={topic} size="sm" />
            ))}
          </Stack>
        </Checkbox.Group>
      </ScrollArea>
    </Card>
  );
}
