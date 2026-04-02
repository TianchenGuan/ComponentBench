'use client';

/**
 * textarea-mantine-T09: Locate the compliance comment field in a dashboard
 *
 * A dashboard page (dashboard layout) is anchored toward the bottom-left of the viewport.
 * - Light theme, comfortable spacing, default scale.
 * - The page contains many cards and tables (clutter high): "Overview", "Alerts", "Audit log", and "Compliance".
 * - The "Compliance" card is below the fold and requires scrolling the main page to reach.
 * - Inside "Compliance" there is one Mantine Textarea labeled "Compliance comment", initially empty, rows=3.
 * - Several other inputs exist elsewhere (search field, filters) as distractors.
 *
 * Success: Value equals "Reviewed on Jan 30, 2026. No issues found." (trim whitespace)
 */

import React, { useState, useEffect } from 'react';
import { Card, Textarea, Text, TextInput, Badge, Table, Group, Stack, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = 'Reviewed on Jan 30, 2026. No issues found.';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === TARGET_VALUE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Box style={{ width: 500, maxHeight: '80vh', overflowY: 'auto' }}>
      {/* Header with distractor search */}
      <Group mb="md" justify="space-between">
        <Text fw={600} size="lg">
          Dashboard
        </Text>
        <TextInput
          placeholder="Search..."
          size="xs"
          style={{ width: 150 }}
          data-testid="input-search"
        />
      </Group>

      {/* Overview Card */}
      <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
        <Text fw={500} mb="sm">
          Overview
        </Text>
        <Group>
          <Box>
            <Text size="xs" c="dimmed">
              Active users
            </Text>
            <Text size="xl" fw={700}>
              1,234
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">
              Revenue
            </Text>
            <Text size="xl" fw={700}>
              $45,678
            </Text>
          </Box>
        </Group>
      </Card>

      {/* Alerts Card */}
      <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
        <Text fw={500} mb="sm">
          Alerts
        </Text>
        <Stack gap="xs">
          <Group>
            <Badge color="yellow" size="sm">
              Warning
            </Badge>
            <Text size="sm">High CPU usage detected</Text>
          </Group>
          <Group>
            <Badge color="green" size="sm">
              OK
            </Badge>
            <Text size="sm">All services operational</Text>
          </Group>
        </Stack>
      </Card>

      {/* Audit Log Card */}
      <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
        <Text fw={500} mb="sm">
          Audit log
        </Text>
        <Table horizontalSpacing="xs" verticalSpacing="xs" fz="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Time</Table.Th>
              <Table.Th>Action</Table.Th>
              <Table.Th>User</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>10:32 AM</Table.Td>
              <Table.Td>Login</Table.Td>
              <Table.Td>admin</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>10:15 AM</Table.Td>
              <Table.Td>Config update</Table.Td>
              <Table.Td>system</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>09:45 AM</Table.Td>
              <Table.Td>Backup complete</Table.Td>
              <Table.Td>cron</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>

      {/* Compliance Card - Target */}
      <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
        <Text fw={500} mb="sm">
          Compliance
        </Text>
        <Textarea
          label="Compliance comment"
          placeholder="Add compliance notes..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          minRows={3}
          data-testid="textarea-compliance-comment"
        />
      </Card>
    </Box>
  );
}
