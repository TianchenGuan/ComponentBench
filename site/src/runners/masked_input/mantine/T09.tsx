'use client';

/**
 * masked_input-mantine-T09: Set IPv4 in server table
 * 
 * Dashboard-style table centered on the page listing several servers (Server A, Server B, Server C) with columns (Name, Region, IPv4).
 * Only the IPv4 cell for "Server B" contains an editable masked Mantine TextInput; other rows show read-only IPs.
 * The IPv4 mask enforces three digits per octet with dots and allows leading zeros, showing a placeholder like "___.___.___.___".
 * The Server B IPv4 field starts as "010.000.010.010" and must be updated to a new value.
 * Additional dashboard elements (summary chips, filter dropdowns) are visible as realistic clutter but are not required for success.
 * 
 * Success: The editable IPv4 masked input value equals "010.000.010.200".
 */

import React, { useState, useEffect } from 'react';
import { Table, Badge, Card, Text, Group, Select } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [ipValue, setIpValue] = useState('010.000.010.010');

  useEffect(() => {
    if (ipValue === '010.000.010.200') {
      onSuccess();
    }
  }, [ipValue, onSuccess]);

  const rows = [
    { name: 'Server A', region: 'US-East', ip: '010.000.001.001', editable: false },
    { name: 'Server B', region: 'US-West', ip: ipValue, editable: true },
    { name: 'Server C', region: 'EU-West', ip: '010.000.003.001', editable: false },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Server Dashboard</Text>
        <Group gap="xs">
          <Badge variant="light" color="green">3 Online</Badge>
          <Badge variant="light" color="gray">0 Offline</Badge>
        </Group>
      </Group>
      
      <Group mb="md" gap="sm">
        <Select
          placeholder="Filter by region"
          data={['All Regions', 'US-East', 'US-West', 'EU-West']}
          defaultValue="All Regions"
          size="xs"
          style={{ width: 140 }}
        />
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Region</Table.Th>
            <Table.Th>IPv4</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.name} data-row={row.name}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>
                <Badge variant="light" size="sm">{row.region}</Badge>
              </Table.Td>
              <Table.Td>
                {row.editable ? (
                  <IMaskInput
                    mask="000.000.000.000"
                    definitions={{
                      '0': /[0-9]/
                    }}
                    placeholder="___.___.___.___ "
                    value={ipValue}
                    onAccept={(val: string) => setIpValue(val)}
                    data-testid="server-ipv4"
                    style={{
                      width: 140,
                      padding: '4px 8px',
                      fontSize: 12,
                      lineHeight: 1.5,
                      border: '1px solid #ced4da',
                      borderRadius: 4,
                      outline: 'none',
                      fontFamily: 'monospace',
                    }}
                  />
                ) : (
                  <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{row.ip}</span>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
