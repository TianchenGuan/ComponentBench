'use client';

/**
 * autocomplete_restricted-mantine-T06: Match team from profile badge
 *
 * setup_description:
 * The page shows an isolated "Onboarding" card.
 *
 * At the top is a small sample badge that reads:
 * - **TEAM: Alpha** (reference)
 *
 * Below it is one Mantine Select labeled **Team** with placeholder "Pick a team".
 * - Theme: light; spacing: comfortable; size: default.
 * - Options: Alpha, Beta, Gamma, Delta.
 * - Restricted options-only selection; no Save button.
 *
 * The instruction refers to the badge rather than naming the target option directly.
 *
 * Success: The "Team" Select has selected value "Alpha" (matching the reference badge).
 */

import React, { useState } from 'react';
import { Card, Text, Select, Badge, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const teams = [
  { label: 'Alpha', value: 'Alpha' },
  { label: 'Beta', value: 'Beta' },
  { label: 'Gamma', value: 'Gamma' },
  { label: 'Delta', value: 'Delta' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Alpha') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Onboarding</Text>

      {/* Sample badge (reference) */}
      <Box
        style={{
          background: '#f1f3f5',
          borderRadius: 8,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <Text size="sm" c="dimmed" mb={8}>Sample Badge</Text>
        <Badge data-testid="sample-badge.team" color="blue" size="lg">
          TEAM: Alpha
        </Badge>
      </Box>

      {/* Target Select */}
      <Text fw={500} size="sm" mb={4}>Team</Text>
      <Select
        data-testid="team-select"
        placeholder="Pick a team"
        data={teams}
        value={value}
        onChange={handleChange}
      />
    </Card>
  );
}
