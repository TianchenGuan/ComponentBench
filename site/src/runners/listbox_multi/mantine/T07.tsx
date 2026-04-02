'use client';

/**
 * listbox_multi-mantine-T07: Dark dashboard: select compliance checks
 *
 * Layout: dashboard in dark theme. The main area shows security score widgets and a table of recent events.
 * In a right-side panel titled "Compliance" there is a card listbox labeled "Compliance checks".
 * The listbox is implemented with Mantine Checkbox.Group and Checkbox.Card items.
 * Options (12): SOC 2, ISO 27001, GDPR, HIPAA, PCI DSS, FedRAMP, SOX, NIST, CSA STAR, etc.
 * Initial state: ISO 27001 is preselected.
 * Clutter: many unrelated dashboard widgets and buttons are visible.
 *
 * Success: The target listbox has exactly: SOC 2, GDPR, HIPAA.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Text,
  Checkbox,
  Stack,
  Grid,
  Paper,
  Group,
  Badge,
  Title,
  Box,
  Button,
  MantineProvider,
  Table,
} from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const options = [
  'SOC 2', 'ISO 27001', 'GDPR', 'HIPAA', 'PCI DSS', 'FedRAMP',
  'SOX', 'NIST', 'CSA STAR', 'CCPA', 'LGPD', 'APPI',
];

const targetSet = ['SOC 2', 'GDPR', 'HIPAA'];
const initialSelected = ['ISO 27001'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <MantineProvider defaultColorScheme="dark">
      <Box
        style={{
          background: '#1a1b1e',
          minHeight: 500,
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Group justify="space-between" mb="md">
          <Title order={4} c="white">
            Security Dashboard
          </Title>
          <Group>
            <Button size="xs" variant="outline" color="gray">
              Export
            </Button>
            <Button size="xs" variant="outline" color="gray">
              Settings
            </Button>
          </Group>
        </Group>

        <Grid>
          <Grid.Col span={8}>
            <Paper p="md" bg="#25262b" radius="md" mb="md">
              <Group justify="space-between" mb="sm">
                <Text c="dimmed" size="sm">
                  Security Score
                </Text>
                <Badge color="green" size="lg">
                  92/100
                </Badge>
              </Group>
              <Box
                style={{
                  height: 100,
                  background: '#2c2e33',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text c="dimmed">[Security Score Chart]</Text>
              </Box>
            </Paper>

            <Paper p="md" bg="#25262b" radius="md">
              <Text c="dimmed" size="sm" mb="sm">
                Recent Events
              </Text>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Event</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Time</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>Login attempt</Table.Td>
                    <Table.Td>
                      <Badge color="green" size="xs">
                        Success
                      </Badge>
                    </Table.Td>
                    <Table.Td>2 min ago</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>API access</Table.Td>
                    <Table.Td>
                      <Badge color="green" size="xs">
                        Success
                      </Badge>
                    </Table.Td>
                    <Table.Td>5 min ago</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Paper>
          </Grid.Col>

          <Grid.Col span={4}>
            <Paper p="md" bg="#25262b" radius="md">
              <Text c="white" fw={500} mb="sm">
                Compliance
              </Text>
              <Text c="dimmed" size="sm" mb="sm">
                Compliance checks
              </Text>
              <Checkbox.Group
                data-testid="listbox-compliance-checks"
                value={selected}
                onChange={setSelected}
              >
                <Stack gap="xs">
                  {options.map((opt) => (
                    <Checkbox.Card
                      key={opt}
                      value={opt}
                      radius="sm"
                      checked={selected.includes(opt)}
                      p="xs"
                      bg={selected.includes(opt) ? '#364fc7' : '#2c2e33'}
                    >
                      <Group wrap="nowrap" align="center">
                        <Checkbox.Indicator />
                        <Text size="sm" c="white">
                          {opt}
                        </Text>
                      </Group>
                    </Checkbox.Card>
                  ))}
                </Stack>
              </Checkbox.Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </Box>
    </MantineProvider>
  );
}
