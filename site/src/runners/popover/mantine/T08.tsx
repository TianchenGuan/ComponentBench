'use client';

/**
 * popover-mantine-T08: Match reference to open correct fee popover (Mantine table)
 *
 * Table-cell layout with compact spacing and small scale.
 * A 'Reference' card at the top shows the target fee name in text and a small snippet preview.
 * Below is a compact table with three rows: 'Convenience fee', 'Handling fee', 'Membership fee'.
 * Each row has an ActionIcon (ⓘ) in the last column that toggles a Mantine Popover dropdown.
 * Icons are small and rows are tightly spaced.
 * Initial state: all popovers closed.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Card, Text, Popover, ActionIcon, Table, Badge } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

const FEE_OPTIONS = ['Convenience fee', 'Handling fee', 'Membership fee'] as const;
type FeeType = typeof FEE_OPTIONS[number];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const targetFee = useMemo(() => {
    const index = Math.floor(Math.random() * FEE_OPTIONS.length);
    return FEE_OPTIONS[index];
  }, []);

  const [openFee, setOpenFee] = useState<FeeType | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (openFee === targetFee && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [openFee, targetFee, onSuccess]);

  const handleToggle = (fee: FeeType) => {
    setOpenFee((prev) => (prev === fee ? null : fee));
  };

  const feeDescriptions: Record<FeeType, string> = {
    'Convenience fee': 'A small fee for using online payment methods.',
    'Handling fee': 'A fee for order processing and preparation.',
    'Membership fee': 'A recurring fee for premium membership benefits.',
  };

  const fees: { name: FeeType; amount: string }[] = [
    { name: 'Convenience fee', amount: '$1.50' },
    { name: 'Handling fee', amount: '$2.00' },
    { name: 'Membership fee', amount: '$4.99' },
  ];

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 380 }}>
      <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
        <Text size="xs" c="dimmed" mb={4}>Reference:</Text>
        <Badge variant="light" data-testid="reference-fee-name">{targetFee}</Badge>
      </div>
      
      <Text size="sm" c="dimmed" mb="sm">
        Open the matching fee popover in the table.
      </Text>

      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ fontSize: 12 }}>Fee type</Table.Th>
            <Table.Th style={{ fontSize: 12 }}>Amount</Table.Th>
            <Table.Th style={{ fontSize: 12, width: 50 }}>Info</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {fees.map((fee) => (
            <Table.Tr key={fee.name}>
              <Table.Td style={{ fontSize: 12 }}>{fee.name}</Table.Td>
              <Table.Td style={{ fontSize: 12 }}>{fee.amount}</Table.Td>
              <Table.Td>
                <Popover
                  opened={openFee === fee.name}
                  onChange={(opened) => opened ? setOpenFee(fee.name) : setOpenFee(null)}
                  width={200}
                  position="left"
                  withArrow
                  shadow="md"
                >
                  <Popover.Target>
                    <ActionIcon
                      variant="subtle"
                      size="xs"
                      onClick={() => handleToggle(fee.name)}
                      data-testid={`fee-popover-target-${fee.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <IconInfoCircle size={14} />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Text size="sm" fw={500} mb={4}>{fee.name}</Text>
                    <Text size="xs">{feeDescriptions[fee.name]}</Text>
                  </Popover.Dropdown>
                </Popover>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
