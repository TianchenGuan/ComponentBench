'use client';

/**
 * slider_single-mantine-v2-T36: Regional tax rates — EU row Save commits
 */

import React, { useEffect, useState } from 'react';
import { Button, Card, Group, Slider, Table, Text, TextInput } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

type RowKey = 'us' | 'eu' | 'apac';

export default function T36({ onSuccess }: TaskComponentProps) {
  const [draft, setDraft] = useState({ us: 7, eu: 12, apac: 10 });
  const [committed, setCommitted] = useState({ us: 7, eu: 12, apac: 10 });

  useEffect(() => {
    if (committed.eu === 18 && committed.us === 7 && committed.apac === 10) {
      onSuccess();
    }
  }, [committed, onSuccess]);

  const setRow = (key: RowKey, v: number) => setDraft((d) => ({ ...d, [key]: v }));

  const saveRow = (key: RowKey) => {
    if (key === 'eu') {
      setCommitted((c) => ({ ...c, eu: draft.eu }));
    } else if (key === 'us') {
      setCommitted((c) => ({ ...c, us: draft.us }));
    } else {
      setCommitted((c) => ({ ...c, apac: draft.apac }));
    }
  };

  const row = (
    label: string,
    key: RowKey,
    testId: string,
    saveTestId?: string,
  ) => (
    <Table.Tr>
      <Table.Td>
        <Text size="sm" fw={500}>
          {label}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">
          Tax rate
        </Text>
        <Slider
          value={draft[key]}
          onChange={(v) => setRow(key, v)}
          min={0}
          max={25}
          step={1}
          mt={4}
          data-testid={testId}
        />
        <Text size="xs" mt={4}>
          {draft[key]}%
        </Text>
      </Table.Td>
      <Table.Td>
        <Button size="xs" variant="light" onClick={() => saveRow(key)} data-testid={saveTestId}>
          Save
        </Button>
      </Table.Td>
    </Table.Tr>
  );

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 520 }}>
      <Text fw={600} size="sm" mb="xs">
        Regional tax rates
      </Text>
      <Group mb="sm" gap="xs">
        <TextInput size="xs" placeholder="Search regions…" style={{ flex: 1 }} />
        <Button size="xs" variant="default">
          Export CSV
        </Button>
        <Button size="xs" variant="light">
          Compare
        </Button>
      </Group>
      <Text size="xs" c="dimmed" mb="sm">
        Committed: US {committed.us}% · EU {committed.eu}% · APAC {committed.apac}%
      </Text>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Region</Table.Th>
            <Table.Th>Rate</Table.Th>
            <Table.Th w={90} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {row('US / Tax rate', 'us', 'slider-tax-us', 'save-us-tax-rate')}
          {row('EU / Tax rate', 'eu', 'slider-tax-eu', 'save-eu-tax-rate')}
          {row('APAC / Tax rate', 'apac', 'slider-tax-apac', 'save-apac-tax-rate')}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
