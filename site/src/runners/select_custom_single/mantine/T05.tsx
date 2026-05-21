'use client';

/**
 * select_custom_single-mantine-T05: Search and select São Paulo (GRU) airport
 *
 * Layout: isolated card anchored near the top-right of the viewport.
 * The card title is "Flight settings". Default component size, comfortable spacing.
 *
 * The card contains one Mantine Select labeled "Airport" with searchable=true.
 * Initial state: empty (placeholder "Pick an airport").
 *
 * The dropdown contains 30 airports with similar formatting "City (CODE)", e.g., "San Francisco (SFO)", "Seattle (SEA)", etc.
 * Target: "São Paulo (GRU)". The list is long enough that scrolling is possible, but searching is the intended approach.
 *
 * Feedback: selecting the airport immediately updates the Select value and closes the dropdown.
 * No other interactive elements are present.
 *
 * Success: The Mantine Select labeled "Airport" has selected value exactly "São Paulo (GRU)".
 */

import React, { useState } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const airports = [
  'Atlanta (ATL)', 'Beijing (PEK)', 'Chicago (ORD)', 'Dallas (DFW)', 'Denver (DEN)',
  'Dubai (DXB)', 'Frankfurt (FRA)', 'Hong Kong (HKG)', 'Istanbul (IST)', 'Las Vegas (LAS)',
  'London (LHR)', 'Los Angeles (LAX)', 'Madrid (MAD)', 'Mexico City (MEX)', 'Miami (MIA)',
  'Mumbai (BOM)', 'New York (JFK)', 'Paris (CDG)', 'Phoenix (PHX)', 'Rome (FCO)',
  'San Francisco (SFO)', 'São Paulo (GRU)', 'Seattle (SEA)', 'Seoul (ICN)', 'Shanghai (PVG)',
  'Singapore (SIN)', 'Sydney (SYD)', 'Tokyo (NRT)', 'Toronto (YYZ)', 'Washington (IAD)',
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'São Paulo (GRU)') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="lg" mb="md">Flight settings</Text>
      <Select
        data-testid="airport-select"
        label="Airport"
        placeholder="Pick an airport"
        data={airports.map(a => ({ value: a, label: a }))}
        value={value}
        onChange={handleChange}
        searchable
        maxDropdownHeight={250}
      />
    </Card>
  );
}
