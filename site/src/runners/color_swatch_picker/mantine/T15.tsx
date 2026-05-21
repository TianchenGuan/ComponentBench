'use client';

/**
 * color_swatch_picker-mantine-T15: Set Pending row highlight color in table cell
 *
 * Layout: table_cell with a small table containing one editable ColorInput.
 * The "Pending" row has an editable color picker.
 *
 * Initial state: Pending highlight is #228be6.
 * Success: Selected color equals #7950f2.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, Table, Badge, Popover, ActionIcon, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../types';

const TARGET_COLOR = '#7950f2';

export default function T15({ task, onSuccess }: TaskComponentProps) {
  const [pendingColor, setPendingColor] = useState<string>('#228be6');
  const [opened, { open, close }] = useDisclosure(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(pendingColor, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [pendingColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const rows = [
    { status: 'Pending', description: 'Awaiting review', editable: true, color: pendingColor },
    { status: 'In progress', description: 'Currently being worked on', editable: false, color: '#228be6' },
    { status: 'Done', description: 'Completed', editable: false, color: '#40c057' },
  ];

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={600} size="lg" mb="md">Statuses</Text>
      
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Status</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Highlight color</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.status}>
              <Table.Td>
                <Badge color={row.color}>{row.status}</Badge>
              </Table.Td>
              <Table.Td>{row.description}</Table.Td>
              <Table.Td>
                {row.editable ? (
                  <div data-testid="pending-highlight-color">
                    <Popover
                      opened={opened}
                      onChange={(isOpen) => isOpen ? open() : close()}
                      position="bottom-start"
                      withArrow
                    >
                      <Popover.Target>
                        <ActionIcon
                          variant="light"
                          onClick={open}
                          style={{ backgroundColor: row.color }}
                          data-testid="pending-color-trigger"
                        >
                          <Box w={16} h={16} />
                        </ActionIcon>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <ColorInput
                          value={pendingColor}
                          onChange={(val) => {
                            setPendingColor(val);
                          }}
                          format="hex"
                          swatches={MANTINE_SWATCHES}
                          withPicker={false}
                          size="xs"
                          style={{ width: 200 }}
                        />
                      </Popover.Dropdown>
                    </Popover>
                  </div>
                ) : (
                  <Box
                    w={24}
                    h={24}
                    style={{
                      backgroundColor: row.color,
                      borderRadius: 4,
                      border: '1px solid var(--mantine-color-gray-3)',
                    }}
                  />
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <div data-testid="pending-highlight-color-value" style={{ display: 'none' }}>
        {normalizeHex(pendingColor)}
      </div>
    </Card>
  );
}
