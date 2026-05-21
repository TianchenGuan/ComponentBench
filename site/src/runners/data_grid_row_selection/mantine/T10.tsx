'use client';

/**
 * data_grid_row_selection-mantine-T10: Dark dashboard: match pinned incidents and apply
 *
 * The scene is a dashboard in dark theme. The main card is titled "Incidents" and contains:
 *   • A left area with a Mantine Table that has a composed checkbox selection column.
 *   • A right side panel titled "Pinned incidents" showing three compact cards with incident IDs
 *     (INC-709, INC-712, INC-728) and a small severity icon.
 * Below the table is a sticky action bar with a primary button labeled "Apply".
 * Spacing is comfortable and scale is default. The incidents table has 25 rows with columns: Incident ID,
 * Service, Updated.
 * Initial state: no incidents selected. Many IDs are similar (INC-728 vs INC-729), and the dark theme
 * reduces contrast, increasing misread risk.
 * Selection is only committed when Apply is clicked; after Apply, a toast "Selection applied" appears
 * (feedback). Guidance is mixed: match the pinned (visual) cards to the table IDs.
 *
 * Success: selected_row_ids equals ['inc_709', 'inc_712', 'inc_728'] AND require_confirm (Apply clicked)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Table, Card, Text, Checkbox, Button, Group, ScrollArea, Box, Paper,
  MantineProvider, createTheme,
} from '@mantine/core';
import { notifications, Notifications } from '@mantine/notifications';
import { IconAlertTriangle } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface IncidentData {
  key: string;
  incidentId: string;
  service: string;
  updated: string;
}

const services = ['API Gateway', 'Auth Service', 'Database', 'Cache', 'Worker', 'Frontend', 'Analytics'];

// Generate 25 incidents
const incidentsData: IncidentData[] = Array.from({ length: 25 }, (_, i) => {
  const num = 705 + i;
  return {
    key: `inc_${num}`,
    incidentId: `INC-${num}`,
    service: services[i % services.length],
    updated: `${(i % 24) + 1}h ago`,
  };
});

const darkTheme = createTheme({
  primaryColor: 'blue',
});

function PinnedCard({ incidentId }: { incidentId: string }) {
  return (
    <Paper p="xs" mb="xs" bg="dark.6" radius="sm">
      <Group gap="xs">
        <IconAlertTriangle size={14} color="#f59e0b" />
        <Text size="xs" c="white">{incidentId}</Text>
      </Group>
    </Paper>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [committedSelection, setCommittedSelection] = useState<string[]>([]);
  const hasSucceeded = useRef(false);

  const toggleRow = (key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleApply = () => {
    setCommittedSelection(Array.from(selectedKeys));
    notifications.show({
      message: 'Selection applied',
      color: 'green',
    });
  };

  // Check success condition
  useEffect(() => {
    if (!hasSucceeded.current && selectionEquals(committedSelection, ['inc_709', 'inc_712', 'inc_728'])) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [committedSelection, onSuccess]);

  return (
    <MantineProvider theme={darkTheme} forceColorScheme="dark">
      <Notifications />
      <Box
        style={{
          width: 800,
          background: '#1a1b1e',
          borderRadius: 8,
          padding: 16,
        }}
      >
        <Text fw={500} size="md" c="white" mb="md">Incidents</Text>
        
        <div style={{ display: 'flex', gap: 16 }}>
          {/* Main table area */}
          <div style={{ flex: 2 }}>
            <ScrollArea h={400}>
              <Table
                highlightOnHover
                data-testid="incidents-table"
                data-selected-row-ids={JSON.stringify(Array.from(selectedKeys))}
                styles={{
                  table: { fontSize: 13 },
                  tr: { borderColor: '#2c2e33' },
                  th: { color: '#909296', borderColor: '#2c2e33' },
                  td: { color: '#c1c2c5', borderColor: '#2c2e33' },
                }}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ width: 40 }} />
                    <Table.Th>Incident ID</Table.Th>
                    <Table.Th>Service</Table.Th>
                    <Table.Th>Updated</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {incidentsData.map((row) => (
                    <Table.Tr
                      key={row.key}
                      bg={selectedKeys.has(row.key) ? 'dark.6' : undefined}
                      data-row-id={row.key}
                      data-selected={selectedKeys.has(row.key)}
                    >
                      <Table.Td>
                        <Checkbox
                          checked={selectedKeys.has(row.key)}
                          onChange={() => toggleRow(row.key)}
                          aria-label={`Select ${row.incidentId}`}
                        />
                      </Table.Td>
                      <Table.Td>{row.incidentId}</Table.Td>
                      <Table.Td>{row.service}</Table.Td>
                      <Table.Td>{row.updated}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </div>

          {/* Pinned incidents panel */}
          <div style={{ flex: 1 }}>
            <Text size="sm" c="dimmed" mb="sm">Pinned incidents</Text>
            <PinnedCard incidentId="INC-709" />
            <PinnedCard incidentId="INC-712" />
            <PinnedCard incidentId="INC-728" />
          </div>
        </div>

        {/* Action bar */}
        <Group justify="flex-end" mt="md" pt="md" style={{ borderTop: '1px solid #2c2e33' }}>
          <Button onClick={handleApply} data-testid="apply-btn">
            Apply
          </Button>
        </Group>

        <div
          style={{ display: 'none' }}
          data-testid="committed-selection"
          data-selected-row-ids={JSON.stringify(committedSelection)}
        />
      </Box>
    </MantineProvider>
  );
}
