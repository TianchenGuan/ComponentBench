'use client';

/**
 * select_native-mantine-v2-T32: Country group drawer — choose Jordan and save
 *
 * "Regional shipping rules" button opens a drawer with one Mantine NativeSelect
 * "Destination country" using native group labels by region. Starts at Germany.
 * Jordan is in a later group (Middle East). Read-only rate table present.
 * "Save regional rules" commits; "Cancel" discards.
 *
 * Success: Destination country = "JO"/"Jordan", Save regional rules clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, NativeSelect, Button, Group, Drawer, Table, Stack, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T32({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState('DE');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && country === 'JO') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, country, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setOpen(false);
  };

  return (
    <Box p="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 440 }}>
        <Text fw={600} size="lg" mb="xs">Logistics</Text>
        <Text size="sm" c="dimmed" mb="md">
          Manage regional shipping rules and rate tables.
        </Text>
        <Button onClick={() => setOpen(true)}>Regional shipping rules</Button>
      </Card>

      <Drawer opened={open} onClose={() => setOpen(false)} title="Regional Shipping Rules" position="right" size="md">
        <Stack gap="md">
          <NativeSelect
            data-testid="destination-country"
            data-canonical-type="select_native"
            data-selected-value={country}
            label="Destination country"
            value={country}
            onChange={(e) => { setCountry(e.target.value); setSaved(false); }}
          >
            <optgroup label="Europe">
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="GB">United Kingdom</option>
              <option value="ES">Spain</option>
              <option value="IT">Italy</option>
            </optgroup>
            <optgroup label="Asia Pacific">
              <option value="JP">Japan</option>
              <option value="KR">South Korea</option>
              <option value="SG">Singapore</option>
              <option value="AU">Australia</option>
            </optgroup>
            <optgroup label="Middle East">
              <option value="AE">United Arab Emirates</option>
              <option value="SA">Saudi Arabia</option>
              <option value="JO">Jordan</option>
              <option value="QA">Qatar</option>
            </optgroup>
            <optgroup label="Americas">
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="BR">Brazil</option>
              <option value="MX">Mexico</option>
            </optgroup>
          </NativeSelect>

          <Text fw={500} size="sm" mt="sm">Rate Table (read-only)</Text>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Weight</Table.Th>
                <Table.Th>Rate</Table.Th>
                <Table.Th>ETA</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr><Table.Td>0–1 kg</Table.Td><Table.Td>$8.50</Table.Td><Table.Td>5–7 days</Table.Td></Table.Tr>
              <Table.Tr><Table.Td>1–5 kg</Table.Td><Table.Td>$14.00</Table.Td><Table.Td>5–7 days</Table.Td></Table.Tr>
              <Table.Tr><Table.Td>5–20 kg</Table.Td><Table.Td>$28.00</Table.Td><Table.Td>7–10 days</Table.Td></Table.Tr>
            </Table.Tbody>
          </Table>
        </Stack>

        <Group mt="xl" gap="sm">
          <Button onClick={handleSave}>Save regional rules</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        </Group>
      </Drawer>
    </Box>
  );
}
