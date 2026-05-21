'use client';

/**
 * breadcrumb-mantine-T06: Match separator style (Mantine)
 * 
 * Target shows: Home → Gallery → Item (arrow symbol)
 * Three options with different separators.
 * Click the arrow one.
 */

import React, { useState } from 'react';
import { Breadcrumbs, Text, Card, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (selected) return;
    setSelected(id);
    if (id === 'arrow') {
      onSuccess();
    }
  };

  const BreadcrumbOption = ({
    separator,
    id,
  }: {
    separator: string;
    id: string;
  }) => (
    <Box
      onClick={() => handleSelect(id)}
      data-testid={`mantine-breadcrumb-${id}-sep`}
      style={{
        padding: '8px 16px',
        borderRadius: 4,
        border: selected === id ? '2px solid #228be6' : '1px solid #dee2e6',
        cursor: 'pointer',
        marginBottom: 8,
        background: selected === id ? '#e7f5ff' : '#fff',
      }}
    >
      <Breadcrumbs separator={separator}>
        <Text>Home</Text>
        <Text>Gallery</Text>
        <Text>Item</Text>
      </Breadcrumbs>
    </Box>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text size="lg" fw={600} mb="md">Separator Match</Text>

      <Box mb="md">
        <Text size="xs" c="dimmed" mb={4}>
          Target sample:
        </Text>
        <Box
          data-testid="mantine-target-separator"
          style={{
            padding: '8px 16px',
            background: '#e7f5ff',
            borderRadius: 4,
            border: '2px solid #228be6',
          }}
        >
          <Breadcrumbs separator="→">
            <Text>Home</Text>
            <Text>Gallery</Text>
            <Text>Item</Text>
          </Breadcrumbs>
        </Box>
      </Box>

      <Text size="xs" c="dimmed" mb={8}>
        Click the matching breadcrumb:
      </Text>

      <BreadcrumbOption separator="/" id="slash" />
      <BreadcrumbOption separator=">" id="chevron" />
      <BreadcrumbOption separator="→" id="arrow" />

      {selected && (
        <Text c={selected === 'arrow' ? 'green' : 'red'} fw={500} mt="md">
          {selected === 'arrow' ? 'Correct match!' : 'Incorrect selection'}
        </Text>
      )}
    </Card>
  );
}
