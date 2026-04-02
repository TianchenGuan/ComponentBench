'use client';

/**
 * listbox_single-mantine-v2-T45: ScrollArea city list: select São Paulo and apply
 *
 * A settings panel has a Mantine ScrollArea with NavLink stack as a single-select listbox
 * labeled "Preferred city". Group headings divide cities by region (not selectable). The list
 * viewport is small so São Paulo is not visible on load. "Apply city" commits the value.
 *
 * Success: Preferred city = "sao_paulo", "Apply city" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, NavLink, Stack, Button, ScrollArea, Group, Badge, Divider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

interface CityGroup {
  region: string;
  cities: { value: string; label: string }[];
}

const cityGroups: CityGroup[] = [
  { region: 'Europe', cities: [
    { value: 'london', label: 'London' },
    { value: 'paris', label: 'Paris' },
    { value: 'berlin', label: 'Berlin' },
    { value: 'madrid', label: 'Madrid' },
    { value: 'rome', label: 'Rome' },
  ]},
  { region: 'Asia', cities: [
    { value: 'tokyo', label: 'Tokyo' },
    { value: 'seoul', label: 'Seoul' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'bangkok', label: 'Bangkok' },
    { value: 'singapore', label: 'Singapore' },
  ]},
  { region: 'Africa', cities: [
    { value: 'cairo', label: 'Cairo' },
    { value: 'lagos', label: 'Lagos' },
    { value: 'nairobi', label: 'Nairobi' },
  ]},
  { region: 'Americas', cities: [
    { value: 'new_york', label: 'New York' },
    { value: 'bogota', label: 'Bogotá' },
    { value: 'buenos_aires', label: 'Buenos Aires' },
    { value: 'sao_paulo', label: 'São Paulo' },
    { value: 'lima', label: 'Lima' },
  ]},
];

export default function T45({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('london');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && selected === 'sao_paulo') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, selected, onSuccess]);

  const handleSelect = (value: string) => {
    setSelected(value);
    setApplied(false);
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-start' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 340 }}>
        <Text fw={600} size="lg" mb="xs">Preferred city</Text>
        <Text size="sm" c="dimmed" mb="md">Select your default destination city.</Text>

        <ScrollArea h={200} style={{ border: '1px solid #dee2e6', borderRadius: 6 }}>
          <Stack
            gap={0}
            data-cb-listbox-root
            data-cb-selected-value={selected}
            role="listbox"
          >
            {cityGroups.map(group => (
              <div key={group.region}>
                <Text size="xs" fw={700} c="dimmed" px="sm" py={4} style={{ background: '#f8f9fa' }}>
                  {group.region}
                </Text>
                {group.cities.map(city => (
                  <NavLink
                    key={city.value}
                    label={city.label}
                    active={selected === city.value}
                    onClick={() => handleSelect(city.value)}
                    data-cb-option-value={city.value}
                    role="option"
                    aria-selected={selected === city.value}
                  />
                ))}
              </div>
            ))}
          </Stack>
        </ScrollArea>

        <Divider my="sm" />

        <Group>
          <Badge size="sm" variant="light">Region: Global</Badge>
          <Badge size="sm" variant="light" color="teal">Active routes: 12</Badge>
        </Group>

        <Group justify="flex-end" mt="md">
          <Button onClick={() => setApplied(true)}>Apply city</Button>
        </Group>
      </Card>
    </div>
  );
}
