'use client';

/**
 * number_input_spinbutton-mantine-T09: Inventory table: set restock threshold
 * 
 * The UI is a compact inventory table with rows for "Green tea", "Black tea", and "Coffee".
 * The "Restock threshold" column contains a Mantine NumberInput in each row (3 instances):
 * - Green tea threshold: 10 (TARGET)
 * - Black tea threshold: 8
 * - Coffee threshold: 12
 * Each input uses small scale and compact spacing to fit in table cells; step=1, min=0, max=100.
 * When a row value is edited, an "Update" button appears in that row (and a "Discard" link appears as a distractor). Clicking Update commits the change for that row.
 * 
 * Success: The numeric value of the target number input (Green tea / Restock threshold) is 15, and the Update button for that row has been clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, NumberInput, Text, Button, Table, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface InventoryRow {
  id: string;
  item: string;
  threshold: number;
  originalThreshold: number;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<InventoryRow[]>([
    { id: 'green-tea', item: 'Green tea', threshold: 10, originalThreshold: 10 },
    { id: 'black-tea', item: 'Black tea', threshold: 8, originalThreshold: 8 },
    { id: 'coffee', item: 'Coffee', threshold: 12, originalThreshold: 12 },
  ]);
  const [greenTeaSaved, setGreenTeaSaved] = useState(false);

  useEffect(() => {
    const greenTea = items.find(i => i.id === 'green-tea');
    if (greenTea && greenTea.threshold === 15 && greenTeaSaved) {
      onSuccess();
    }
  }, [items, greenTeaSaved, onSuccess]);

  const handleThresholdChange = (id: string, value: string | number) => {
    const numVal = typeof value === 'number' ? value : parseInt(value, 10);
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, threshold: isNaN(numVal) ? item.threshold : numVal } : item
    ));
    if (id === 'green-tea') {
      setGreenTeaSaved(false);
    }
  };

  const handleUpdate = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, originalThreshold: item.threshold } : item
    ));
    if (id === 'green-tea') {
      setGreenTeaSaved(true);
    }
  };

  const handleDiscard = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, threshold: item.originalThreshold } : item
    ));
  };

  const rows = items.map((item) => {
    const isDirty = item.threshold !== item.originalThreshold;
    return (
      <Table.Tr key={item.id} data-row={item.id}>
        <Table.Td>{item.item}</Table.Td>
        <Table.Td>
          <NumberInput
            size="xs"
            min={0}
            max={100}
            step={1}
            value={item.threshold}
            onChange={(val) => handleThresholdChange(item.id, val)}
            style={{ width: 80 }}
            data-testid={`${item.id}-threshold-input`}
          />
        </Table.Td>
        <Table.Td>
          {isDirty && (
            <Group gap="xs">
              <Button 
                size="xs" 
                onClick={() => handleUpdate(item.id)}
                data-testid={`${item.id}-update-btn`}
              >
                Update
              </Button>
              <Button 
                size="xs" 
                variant="subtle"
                onClick={() => handleDiscard(item.id)}
              >
                Discard
              </Button>
            </Group>
          )}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Inventory</Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Item</Table.Th>
            <Table.Th>Restock threshold</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Card>
  );
}
