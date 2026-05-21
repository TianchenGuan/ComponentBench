'use client';

/**
 * slider_single-mantine-T09: Set EU tax rate to 18% in a table
 * 
 * Layout: table_cell scene centered in the viewport.
 * A table titled "Regional tax rates" has three rows: "US", "EU", and "APAC".
 * Each row has a Mantine Slider in the "Tax rate" column.
 * Slider configuration (all rows): range 0–25, step=1, no marks, compact thumb; each cell shows a small "XX%" readout to the right of the slider.
 * Initial state: US=7%, EU=20%, APAC=12%.
 * Clutter: the table includes a header row with a region filter dropdown and a search box (not required).
 * Changes apply immediately; no Apply/Cancel step.
 * 
 * Success: The slider in the 'EU' row equals 18. The correct instance is required: only the EU row counts.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Slider, Table, TextInput, Select, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [usTax, setUsTax] = useState(7);
  const [euTax, setEuTax] = useState(20);
  const [apacTax, setApacTax] = useState(12);
  const [searchText, setSearchText] = useState('');
  const [regionFilter, setRegionFilter] = useState<string | null>(null);

  useEffect(() => {
    if (euTax === 18) {
      onSuccess();
    }
  }, [euTax, onSuccess]);

  const rows = [
    { region: 'US', value: usTax, setValue: setUsTax, testId: 'slider-tax-us' },
    { region: 'EU', value: euTax, setValue: setEuTax, testId: 'slider-tax-eu' },
    { region: 'APAC', value: apacTax, setValue: setApacTax, testId: 'slider-tax-apac' },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Regional tax rates</Text>
      
      <Group mb="md">
        <TextInput
          placeholder="Search regions..."
          value={searchText}
          onChange={(e) => setSearchText(e.currentTarget.value)}
          size="xs"
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filter by region"
          value={regionFilter}
          onChange={setRegionFilter}
          data={[
            { value: 'all', label: 'All regions' },
            { value: 'us', label: 'US' },
            { value: 'eu', label: 'EU' },
            { value: 'apac', label: 'APAC' },
          ]}
          size="xs"
          clearable
          style={{ width: 140 }}
        />
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Region</Table.Th>
            <Table.Th>Tax rate</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.region}>
              <Table.Td>{row.region}</Table.Td>
              <Table.Td>
                <Group gap="sm">
                  <Slider
                    value={row.value}
                    onChange={row.setValue}
                    min={0}
                    max={25}
                    step={1}
                    size="sm"
                    style={{ flex: 1 }}
                    data-testid={row.testId}
                  />
                  <Text size="sm" style={{ minWidth: 35 }}>{row.value}%</Text>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
