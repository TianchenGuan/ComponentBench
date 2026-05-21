'use client';

/**
 * virtual_list-mantine-T08: Select an item in the correct instance under dark theme
 *
 * Theme: dark. Two Mantine Cards side-by-side:
 *   - Left: "Primary Endpoints" (distractor, one row preselected)
 *   - Right: "Backup Endpoints" (TARGET)
 * Each list has 30 endpoints with unique region names.
 *
 * Success: In Backup Endpoints, select 'bkp-0021' (Tokyo)
 */

import React, { useState, useEffect } from 'react';
import { Paper, Text, Box, Group, MantineProvider, ScrollArea } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

interface EndpointItem {
  key: string;
  id: string;
  region: string;
  latency: string;
}

const REGIONS_PRIMARY = [
  'Tokyo', 'Singapore', 'Sydney', 'Mumbai', 'Frankfurt', 'London',
  'São Paulo', 'Virginia', 'Oregon', 'Ireland', 'Seoul', 'Jakarta',
  'Cape Town', 'Milan', 'Stockholm', 'Bahrain', 'Osaka', 'Hong Kong',
  'Montreal', 'Ohio', 'California', 'Paris', 'Zurich', 'Tel Aviv',
  'Dubai', 'Beijing', 'Taipei', 'Melbourne', 'Delhi', 'Warsaw',
];

const REGIONS_BACKUP = [
  'Singapore', 'Sydney', 'Mumbai', 'Frankfurt', 'London', 'São Paulo',
  'Virginia', 'Oregon', 'Ireland', 'Seoul', 'Jakarta', 'Cape Town',
  'Milan', 'Stockholm', 'Bahrain', 'Osaka', 'Hong Kong', 'Montreal',
  'Ohio', 'California', 'Tokyo', 'Paris', 'Zurich', 'Tel Aviv',
  'Dubai', 'Beijing', 'Taipei', 'Melbourne', 'Delhi', 'Warsaw',
];

const latencies = ['12ms', '18ms', '25ms', '34ms', '41ms', '8ms', '55ms', '22ms', '30ms', '15ms',
  '47ms', '62ms', '19ms', '28ms', '36ms', '11ms', '50ms', '44ms', '33ms', '27ms',
  '39ms', '16ms', '53ms', '21ms', '45ms', '31ms', '58ms', '14ms', '42ms', '37ms'];

const primaryEndpoints: EndpointItem[] = REGIONS_PRIMARY.map((region, i) => ({
  key: `prm-${String(i + 1).padStart(4, '0')}`,
  id: `PRM-${String(i + 1).padStart(4, '0')}`,
  region,
  latency: latencies[i],
}));

const backupEndpoints: EndpointItem[] = REGIONS_BACKUP.map((region, i) => ({
  key: `bkp-${String(i + 1).padStart(4, '0')}`,
  id: `BKP-${String(i + 1).padStart(4, '0')}`,
  region,
  latency: latencies[(i + 5) % latencies.length],
}));

const TARGET_KEY = 'bkp-0021';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primarySelectedKey, setPrimarySelectedKey] = useState<string | null>('prm-0010');
  const [backupSelectedKey, setBackupSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (backupSelectedKey === TARGET_KEY) {
      onSuccess();
    }
  }, [backupSelectedKey, onSuccess]);

  const renderList = (
    items: EndpointItem[],
    selectedKey: string | null,
    onSelect: (key: string) => void,
    testId: string,
  ) => (
    <ScrollArea h={300} style={{ border: '1px solid #dee2e6', borderRadius: 4 }}>
      {items.map(item => (
        <Box
          key={item.key}
          data-item-key={item.key}
          aria-selected={selectedKey === item.key}
          onClick={() => onSelect(item.key)}
          style={{
            padding: '10px 16px',
            cursor: 'pointer',
            borderBottom: '1px solid #dee2e6',
            backgroundColor: selectedKey === item.key ? '#e7f5ff' : 'transparent',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text size="sm">{item.id} — {item.region}</Text>
          <Text size="xs" c="dimmed">{item.latency}</Text>
        </Box>
      ))}
    </ScrollArea>
  );

  return (
    <MantineProvider forceColorScheme="dark">
      <Group gap="lg" align="flex-start">
        <Paper shadow="sm" p="md" withBorder style={{ width: 340 }} data-testid="vl-primary-endpoints">
          <Text fw={600} size="lg" mb="sm">Primary Endpoints</Text>
          {renderList(primaryEndpoints, primarySelectedKey, setPrimarySelectedKey, 'vl-primary')}
          <Text size="sm" c="dimmed" mt="xs">
            Selected: {primarySelectedKey || 'none'}
          </Text>
        </Paper>

        <Paper shadow="sm" p="md" withBorder style={{ width: 340 }} data-testid="vl-backup-endpoints">
          <Text fw={600} size="lg" mb="sm">Backup Endpoints</Text>
          {renderList(backupEndpoints, backupSelectedKey, setBackupSelectedKey, 'vl-backup')}
          <Text size="sm" c="dimmed" mt="xs">
            Selected: {backupSelectedKey ? backupEndpoints.find(e => e.key === backupSelectedKey)?.id : 'none'}
          </Text>
        </Paper>
      </Group>
    </MantineProvider>
  );
}
