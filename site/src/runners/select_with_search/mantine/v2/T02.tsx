'use client';

/**
 * select_with_search-mantine-v2-T02: Material row binding in inventory table with save
 *
 * Inventory table with 2 editable rows, each with a searchable Mantine Select in the Material
 * column and a row-local Save action. Long alphabetized material list; Walnut initially offscreen.
 * Initial: Row 1 = Aluminum, Row 2 = Steel.
 * Success: Row 1 Material = "Walnut", Row 2 still "Steel", Save for row 1 clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Select, Button, Table, Group } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const materials = [
  'Acrylic', 'Aluminum', 'Bamboo', 'Birch', 'Brass', 'Bronze', 'Carbon Fiber',
  'Cedar', 'Ceramic', 'Cherry', 'Copper', 'Cork', 'Cotton', 'Ebony',
  'Elm', 'Felt', 'Fiberglass', 'Granite', 'Hemp', 'Iron',
  'Jute', 'Kevlar', 'Linen', 'Mahogany', 'Maple', 'Marble',
  'Neoprene', 'Nylon', 'Oak', 'Olive', 'Pine', 'Plywood', 'Polyester',
  'Rosewood', 'Rubber', 'Silk', 'Silver', 'Spruce', 'Steel',
  'Teak', 'Tin', 'Titanium', 'Tungsten',
  'Vinyl', 'Walnut', 'Wenge', 'Willow', 'Zinc',
];

const materialOptions = materials.map((m) => ({ value: m, label: m }));

export default function T02({ onSuccess }: TaskComponentProps) {
  const [row1Material, setRow1Material] = useState<string | null>('Aluminum');
  const [row2Material, setRow2Material] = useState<string | null>('Steel');
  const [row1Saved, setRow1Saved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (row1Saved && row1Material === 'Walnut' && row2Material === 'Steel') {
      successFired.current = true;
      onSuccess();
    }
  }, [row1Saved, row1Material, row2Material, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-start' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 560 }}>
        <Text fw={600} size="lg" mb="md">Inventory</Text>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Row</Table.Th>
              <Table.Th>Item</Table.Th>
              <Table.Th>Material</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td><Text size="sm">1</Text></Table.Td>
              <Table.Td><Text size="sm">Shelf Panel</Text></Table.Td>
              <Table.Td>
                <Select
                  searchable
                  size="xs"
                  data={materialOptions}
                  value={row1Material}
                  onChange={(val) => { setRow1Material(val); setRow1Saved(false); }}
                  style={{ minWidth: 160 }}
                />
              </Table.Td>
              <Table.Td>
                <Button
                  size="xs"
                  variant="filled"
                  data-testid="save-row-1"
                  onClick={() => setRow1Saved(true)}
                >
                  Save
                </Button>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td><Text size="sm">2</Text></Table.Td>
              <Table.Td><Text size="sm">Frame Rail</Text></Table.Td>
              <Table.Td>
                <Select
                  searchable
                  size="xs"
                  data={materialOptions}
                  value={row2Material}
                  onChange={(val) => { setRow2Material(val); }}
                  style={{ minWidth: 160 }}
                />
              </Table.Td>
              <Table.Td>
                <Button size="xs" variant="light" data-testid="save-row-2">
                  Save
                </Button>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>

        <Group gap="xs" mt="md">
          <Text size="xs" c="dimmed">Last updated: 10 min ago · Warehouse: A3</Text>
        </Group>
      </Card>
    </div>
  );
}
