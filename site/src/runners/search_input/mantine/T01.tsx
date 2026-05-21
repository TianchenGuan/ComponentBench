'use client';

/**
 * search_input-mantine-T01: Mantine TextInput: type a simple query
 *
 * Baseline isolated card centered in the viewport titled "Library".
 * Contains one Mantine TextInput labeled "Search" with a magnifying-glass icon in the left section.
 * Initial state: empty; placeholder "Search…".
 * Feedback: the list of items below filters live as you type (no Enter required), and a small count text updates.
 * No other clutter.
 *
 * Success: The Mantine TextInput labeled "Search" has value exactly "kittens".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TextInput, Text, List } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const items = [
  'Books about kittens',
  'Cat toys',
  'Kitten food',
  'Dog treats',
  'Bird cages',
  'Fish tanks',
  'Kittens care guide',
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const hasSucceeded = useRef(false);

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    if (value === 'kittens' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Library</Text>
      <TextInput
        label="Search"
        placeholder="Search…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        leftSection={<IconSearch size={16} />}
        data-testid="search-library"
        mb="sm"
      />
      <Text size="sm" c="dimmed" mb="xs">
        Results: {filteredItems.length}
      </Text>
      <List size="sm">
        {filteredItems.map((item, index) => (
          <List.Item key={index}>{item}</List.Item>
        ))}
      </List>
    </Card>
  );
}
