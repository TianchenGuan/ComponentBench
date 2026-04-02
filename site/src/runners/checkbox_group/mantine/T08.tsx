'use client';

/**
 * checkbox_group-mantine-T08: Set privacy telemetry options (dark, small)
 *
 * Scene: dark theme; compact spacing; a single isolated card centered in the viewport; small-sized controls.
 * Mantine page rendered in dark theme with compact spacing and small control sizing.
 * A single card titled "Privacy" is centered.
 * The card contains one Checkbox.Group labeled "Privacy options" with 12 tightly spaced options:
 * Share profile, Share profile photo, Share email, Share phone, Show online status, Show last seen,
 * Personalized ads, Usage analytics, Crash reports, Third-party integrations, Beta features, Partner offers.
 * Initial state: Share profile and Personalized ads are checked by default.
 * Success: Exactly Usage analytics, Crash reports, Third-party integrations, and Beta features are checked.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Checkbox, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const privacyOptions = [
  'Share profile', 'Share profile photo', 'Share email', 'Share phone',
  'Show online status', 'Show last seen', 'Personalized ads', 'Usage analytics',
  'Crash reports', 'Third-party integrations', 'Beta features', 'Partner offers'
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Share profile', 'Personalized ads']);

  useEffect(() => {
    const targetSet = new Set(['Usage analytics', 'Crash reports', 'Third-party integrations', 'Beta features']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 380 }}>
      <Text fw={600} size="md" mb="sm">Privacy</Text>
      <Text fw={500} size="xs" mb="xs">Privacy options</Text>
      <Checkbox.Group
        data-testid="cg-privacy-options"
        value={selected}
        onChange={setSelected}
      >
        <Stack gap={4}>
          {privacyOptions.map(option => (
            <Checkbox key={option} value={option} label={option} size="xs" />
          ))}
        </Stack>
      </Checkbox.Group>
    </Card>
  );
}
