'use client';

/**
 * segmented_control-mantine-T09: Service Gamma environment → Prod (compact table)
 *
 * Layout: table cell interaction in a compact panel placed near the bottom-right of the viewport.
 * A table lists three rows:
 * - Service Alpha
 * - Service Beta
 * - Service Gamma
 *
 * The "Environment" column contains a Mantine SegmentedControl in each row with options:
 * "Dev", "Staging", "Prod".
 *
 * Styling: compact spacing and small scale make the segments smaller than default.
 *
 * Initial states:
 * - Alpha: Dev
 * - Beta: Staging
 * - Gamma: Dev
 *
 * Clutter (medium): the table has a sticky header and a small "Add service" button above; not required.
 * No Apply button; selection is immediate.
 *
 * Success: In row "Service Gamma", the Environment SegmentedControl selected value = Prod.
 */

import React, { useState } from 'react';
import { Card, Text, Table, Button, SegmentedControl } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const envOptions = ['Dev', 'Staging', 'Prod'];

interface Service {
  key: string;
  name: string;
  env: string;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [services, setServices] = useState<Service[]>([
    { key: 'alpha', name: 'Service Alpha', env: 'Dev' },
    { key: 'beta', name: 'Service Beta', env: 'Staging' },
    { key: 'gamma', name: 'Service Gamma', env: 'Dev' },
  ]);

  const handleEnvChange = (key: string, value: string) => {
    setServices(prev => prev.map(s => s.key === key ? { ...s, env: value } : s));
    if (key === 'gamma' && value === 'Prod') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 420 }}>
      <Text fw={600} size="sm" mb="xs">Services</Text>
      <Button size="xs" variant="light" mb="xs">Add service</Button>
      
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Service</Table.Th>
            <Table.Th>Environment</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {services.map(service => (
            <Table.Tr key={service.key}>
              <Table.Td>{service.name}</Table.Td>
              <Table.Td>
                <SegmentedControl
                  data-testid={`env-${service.key}`}
                  data-canonical-type="segmented_control"
                  data-selected-value={service.env}
                  data={envOptions}
                  value={service.env}
                  onChange={(value) => handleEnvChange(service.key, value)}
                  size="xs"
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
