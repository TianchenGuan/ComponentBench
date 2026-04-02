'use client';

/**
 * table_static-mantine-T03: Focus the table wrapper
 *
 * A centered isolated card shows a small read-only table styled with Mantine Table, titled "Periodic Table
 * sample". The table wrapper is focusable (tabIndex=0) and renders a focus outline when focused. The table has two columns
 * (Element, Symbol) and a few rows. Initial state: the table is not focused; no other interactive elements exist.
 */

import React, { useState, useRef } from 'react';
import { Table, Card, Text, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface ElementData {
  key: string;
  element: string;
  symbol: string;
}

const elementsData: ElementData[] = [
  { key: '1', element: 'Hydrogen', symbol: 'H' },
  { key: '2', element: 'Helium', symbol: 'He' },
  { key: '3', element: 'Lithium', symbol: 'Li' },
  { key: '4', element: 'Beryllium', symbol: 'Be' },
  { key: '5', element: 'Boron', symbol: 'B' },
  { key: '6', element: 'Carbon', symbol: 'C' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [isFocused, setIsFocused] = useState(false);
  const successFiredRef = useRef(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (!successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="md" mb="md">Periodic Table sample</Text>
      <Box
        tabIndex={0}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-cb-focused={isFocused}
        style={{
          outline: isFocused ? '2px solid var(--mantine-color-blue-6)' : 'none',
          outlineOffset: 2,
          borderRadius: 4,
        }}
      >
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Element</Table.Th>
              <Table.Th>Symbol</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {elementsData.map((row) => (
              <Table.Tr key={row.key}>
                <Table.Td>{row.element}</Table.Td>
                <Table.Td>{row.symbol}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
      <Text size="sm" c={isFocused ? 'blue' : 'dimmed'} mt="sm">
        {isFocused ? 'Table focused' : 'Click or tab to focus the table'}
      </Text>
    </Card>
  );
}
