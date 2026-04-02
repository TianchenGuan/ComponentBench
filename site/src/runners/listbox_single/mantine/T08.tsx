'use client';

/**
 * listbox_single-mantine-T08: City list: scroll to São Paulo
 *
 * Scene: light theme, compact spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is small. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is none.
 * A centered card titled "City" contains a scrollable listbox built from Mantine NavLink rows inside a ScrollArea
 * (height ~220px) in compact spacing and small scale. Options are grouped with visual headings (not selectable)
 * such as "North America", "Europe", "South America". Within "South America", items include "Bogotá", "Buenos Aires",
 * "Lima", "São Paulo". Some unrelated items elsewhere are disabled (grayed out) to resemble real availability.
 * Initial active selection is "Lima". The target "São Paulo" is not visible initially and requires scrolling
 * within the ScrollArea.
 *
 * Success: Selected option value equals: sao_paulo
 */

import React, { useState } from 'react';
import { Card, Text, NavLink, Stack, ScrollArea, Divider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface CityOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CityGroup {
  region: string;
  cities: CityOption[];
}

const cityGroups: CityGroup[] = [
  {
    region: 'North America',
    cities: [
      { value: 'new_york', label: 'New York' },
      { value: 'los_angeles', label: 'Los Angeles' },
      { value: 'chicago', label: 'Chicago', disabled: true },
      { value: 'toronto', label: 'Toronto' },
    ],
  },
  {
    region: 'Europe',
    cities: [
      { value: 'london', label: 'London' },
      { value: 'paris', label: 'Paris' },
      { value: 'berlin', label: 'Berlin', disabled: true },
      { value: 'madrid', label: 'Madrid' },
    ],
  },
  {
    region: 'South America',
    cities: [
      { value: 'bogota', label: 'Bogotá' },
      { value: 'buenos_aires', label: 'Buenos Aires' },
      { value: 'lima', label: 'Lima' },
      { value: 'sao_paulo', label: 'São Paulo' },
    ],
  },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('lima');

  const handleSelect = (value: string) => {
    setSelected(value);
    if (value === 'sao_paulo') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 300 }}>
      <Text fw={600} size="sm" mb="sm">City</Text>

      <ScrollArea h={220} data-cb-listbox-root data-cb-selected-value={selected}>
        <Stack gap={0} role="listbox">
          {cityGroups.map((group, groupIdx) => (
            <div key={group.region}>
              {groupIdx > 0 && <Divider my="xs" />}
              <Text size="xs" c="dimmed" fw={500} px="xs" py={4}>
                {group.region}
              </Text>
              {group.cities.map(city => (
                <NavLink
                  key={city.value}
                  label={city.label}
                  active={selected === city.value}
                  disabled={city.disabled}
                  onClick={() => !city.disabled && handleSelect(city.value)}
                  data-cb-option-value={city.value}
                  role="option"
                  aria-selected={selected === city.value}
                  styles={{ label: { fontSize: 12 } }}
                />
              ))}
            </div>
          ))}
        </Stack>
      </ScrollArea>
    </Card>
  );
}
