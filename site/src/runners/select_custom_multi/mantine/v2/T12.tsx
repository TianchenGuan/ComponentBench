'use client';

/**
 * select_custom_multi-mantine-v2-T12: Incident categories modal exact-set repair
 *
 * Modal flow, compact spacing, medium clutter. "Edit incident categories" opens
 * a centered Mantine Modal. One MultiSelect labeled "Incident categories".
 * Options: Authentication, Auth (legacy), Billing, Billing Export, Search, Search Infra,
 *          Deployments, Rollbacks, Notifications, Availability.
 * Initial: [Auth (legacy), Search, Rollbacks].
 * Target: [Authentication, Billing, Search, Deployments].
 * Modal footer: Cancel / Apply categories.
 *
 * Success: Incident categories = {Authentication, Billing, Search, Deployments}, Apply categories clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, Text, MultiSelect, Button, Modal, Group, Stack, Table, Badge,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const categoryOptions = [
  'Authentication', 'Auth (legacy)', 'Billing', 'Billing Export',
  'Search', 'Search Infra', 'Deployments', 'Rollbacks', 'Notifications', 'Availability',
];

const incidentRows = [
  { id: 'INC-401', title: 'Login failures spike', status: 'Open', severity: 'P1' },
  { id: 'INC-402', title: 'Search latency degraded', status: 'Investigating', severity: 'P2' },
  { id: 'INC-403', title: 'Billing webhook timeout', status: 'Resolved', severity: 'P3' },
];

export default function T12({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Auth (legacy)', 'Search', 'Rollbacks']);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && setsEqual(categories, ['Authentication', 'Billing', 'Search', 'Deployments'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, categories, onSuccess]);

  const handleApply = () => {
    setCommitted(true);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 16 }}>
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ maxWidth: 560, marginBottom: 16 }}>
        <Group justify="space-between" mb="sm">
          <Text fw={600} size="lg">Incidents</Text>
          <Badge color="red" variant="light">3 active</Badge>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Severity</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {incidentRows.map(row => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.id}</Table.Td>
                <Table.Td>{row.title}</Table.Td>
                <Table.Td><Badge size="sm" variant="light">{row.status}</Badge></Table.Td>
                <Table.Td>{row.severity}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Button onClick={() => setModalOpen(true)}>Edit incident categories</Button>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Edit Incident Categories">
        <Stack gap="md">
          <MultiSelect
            label="Incident categories"
            searchable
            clearable
            data={categoryOptions}
            value={categories}
            onChange={(v) => { setCategories(v); setCommitted(false); }}
            placeholder="Select categories"
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleApply}>Apply categories</Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
