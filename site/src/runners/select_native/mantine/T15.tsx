'use client';

/**
 * select_native-mantine-T15: Set Payments environment to Production (dense table)
 *
 * Layout: a feature flags table anchored near the top-left of the viewport.
 * Spacing: compact. Scale: small, so table cell controls are tight.
 *
 * The table has four rows visible (four native selects in the Environment column):
 * Columns:
 * - Feature name
 * - Description
 * - Environment (native select per row)  ← TARGET COLUMN
 *
 * Environment options (label → value):
 * - Dev → dev
 * - Staging → staging
 * - Production → prod  ← TARGET OPTION
 *
 * Rows:
 * 1) Search → Environment initial: Dev
 * 2) Payments → Environment initial: Staging  ← TARGET ROW
 * 3) Notifications → Environment initial: Dev
 * 4) Analytics → Environment initial: Production
 *
 * Clutter: high — there are filter pills above the table, a "Create flag" button, and column sort icons.
 * Feedback: immediate; no Save button.
 *
 * Success: The target native select labeled "Environment for Payments" has selected option value 'prod' (label 'Production').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect, Button, Table, Group, Badge, TextInput } from '@mantine/core';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const envOptions = [
  { label: 'Dev', value: 'dev' },
  { label: 'Staging', value: 'staging' },
  { label: 'Production', value: 'prod' },
];

const initialFlags = [
  { name: 'Search', description: 'Full-text search feature', env: 'dev' },
  { name: 'Payments', description: 'Payment processing', env: 'staging' },
  { name: 'Notifications', description: 'Push notifications', env: 'dev' },
  { name: 'Analytics', description: 'User analytics tracking', env: 'prod' },
];

export default function T15({ onSuccess }: TaskComponentProps) {
  const [flags, setFlags] = useState(initialFlags);
  const [search, setSearch] = useState('');

  const handleEnvChange = (flagName: string, newEnv: string) => {
    setFlags(prev => 
      prev.map(f => f.name === flagName ? { ...f, env: newEnv } : f)
    );
    if (flagName === 'Payments' && newEnv === 'prod') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 600 }}>
      <Group justify="space-between" mb="sm">
        <Text fw={600} size="md">Feature Flags</Text>
        <Button size="xs">Create flag</Button>
      </Group>

      <Group gap="xs" mb="sm">
        <TextInput
          placeholder="Search flags..."
          leftSection={<IconSearch size={14} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="xs"
          style={{ width: 150 }}
        />
        <Badge variant="light" leftSection={<IconFilter size={12} />} style={{ cursor: 'pointer' }}>
          All
        </Badge>
        <Badge variant="outline" style={{ cursor: 'pointer' }}>
          Enabled
        </Badge>
        <Badge variant="outline" style={{ cursor: 'pointer' }}>
          Disabled
        </Badge>
      </Group>

      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ fontSize: 12 }}>Feature name</Table.Th>
            <Table.Th style={{ fontSize: 12 }}>Description</Table.Th>
            <Table.Th style={{ fontSize: 12 }}>Environment</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {flags.map((flag) => (
            <Table.Tr key={flag.name} data-row={flag.name.toLowerCase()}>
              <Table.Td style={{ fontSize: 12 }}>{flag.name}</Table.Td>
              <Table.Td style={{ fontSize: 12 }}>{flag.description}</Table.Td>
              <Table.Td>
                <NativeSelect
                  data-testid={`env-${flag.name.toLowerCase()}`}
                  data-canonical-type="select_native"
                  data-selected-value={flag.env}
                  value={flag.env}
                  onChange={(e) => handleEnvChange(flag.name, e.target.value)}
                  data={envOptions}
                  size="xs"
                  style={{ width: 90 }}
                  aria-label={`Environment for ${flag.name}`}
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
