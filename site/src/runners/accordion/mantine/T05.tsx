'use client';

/**
 * accordion-mantine-T05: Visual reference: open the item with matching symbol
 * 
 * A centered isolated card titled "Quick guide" shows a small "Reference symbol" badge 
 * above the accordion (a simple geometric symbol, e.g., a hollow triangle). Below it is 
 * a Mantine Accordion with 6 items. Each item control starts with a small symbol badge 
 * followed by a short text label. Text labels are intentionally generic; the primary 
 * cue is the symbol badge. Initial state: all items collapsed.
 * 
 * Success: expanded_item_ids equals exactly: [symbol_target]
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text, Box, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

// Symbol components
const TriangleSymbol = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <polygon points="10,2 18,18 2,18" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const CircleSymbol = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const SquareSymbol = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <rect x="2" y="2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const StarSymbol = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <polygon 
      points="10,1 12.5,7.5 19,7.5 14,12 16,19 10,15 4,19 6,12 1,7.5 7.5,7.5" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
  </svg>
);

const DiamondSymbol = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <polygon points="10,1 19,10 10,19 1,10" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const HexagonSymbol = () => (
  <svg width="20" height="20" viewBox="0 0 20 20">
    <polygon 
      points="10,1 18,5 18,15 10,19 2,15 2,5" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    />
  </svg>
);

const symbols = [
  { key: 'topic_1', label: 'Topic 1', Symbol: TriangleSymbol },
  { key: 'topic_2', label: 'Topic 2', Symbol: CircleSymbol },
  { key: 'symbol_target', label: 'Topic 3', Symbol: StarSymbol }, // Target
  { key: 'topic_4', label: 'Topic 4', Symbol: SquareSymbol },
  { key: 'topic_5', label: 'Topic 5', Symbol: DiamondSymbol },
  { key: 'topic_6', label: 'Topic 6', Symbol: HexagonSymbol },
];

// The target symbol is Star (Topic 3)
const targetSymbol = symbols[2];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (value === 'symbol_target') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Quick guide</Text>
      
      {/* Reference symbol */}
      <Box mb="md" p="sm" style={{ backgroundColor: '#f8f9fa', borderRadius: 8 }}>
        <Text size="sm" c="dimmed" mb="xs">Reference symbol:</Text>
        <targetSymbol.Symbol />
      </Box>
      
      <Accordion value={value} onChange={setValue} data-testid="accordion-root">
        {symbols.map(({ key, label, Symbol }) => (
          <Accordion.Item key={key} value={key}>
            <Accordion.Control>
              <Group gap="sm">
                <Symbol />
                <Text>{label}</Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              Content for {label}. This section contains helpful information.
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Card>
  );
}
