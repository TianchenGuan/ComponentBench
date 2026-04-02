'use client';

/**
 * slider_range-mantine-v2-T47: Gateway / Billing retry window in table, row-local Save
 * Success: Gateway [20±1, 60±1], Billing unchanged [15, 45]; row Save clicked.
 */

import React, { useEffect, useState } from 'react';
import {
  Button,
  Group,
  Menu,
  RangeSlider,
  Table,
  Text,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T47({ onSuccess }: TaskComponentProps) {
  const [gwDraft, setGwDraft] = useState<[number, number]>([10, 50]);
  const [billDraft, setBillDraft] = useState<[number, number]>([15, 45]);
  const [gwCommitted, setGwCommitted] = useState<[number, number]>([10, 50]);
  const [billCommitted, setBillCommitted] = useState<[number, number]>([15, 45]);

  const saveGateway = () => {
    setGwCommitted(gwDraft);
  };

  const saveBilling = () => {
    setBillCommitted(billDraft);
  };

  useEffect(() => {
    if (
      Math.abs(gwCommitted[0] - 20) <= 1 &&
      Math.abs(gwCommitted[1] - 60) <= 1 &&
      billCommitted[0] === 15 &&
      billCommitted[1] === 45
    ) {
      onSuccess();
    }
  }, [gwCommitted, billCommitted, onSuccess]);

  return (
    <div style={{ maxWidth: 640 }}>
      <Group justify="space-between" mb="xs">
        <Text fw={700} size="sm">
          Service windows
        </Text>
        <Group gap={4}>
          <Button size="compact-xs" variant="light">
            Export
          </Button>
          <Menu shadow="md" width={160}>
            <Menu.Target>
              <Button size="compact-xs" variant="default">
                Actions ▾
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Refresh rows</Menu.Item>
              <Menu.Item>Duplicate view</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <Table striped highlightOnHover withTableBorder withColumnBorders fz="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Service</Table.Th>
            <Table.Th>Retry window</Table.Th>
            <Table.Th w={120}>Selected</Table.Th>
            <Table.Th w={100}> </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td fw={600}>Gateway</Table.Td>
            <Table.Td>
              <RangeSlider
                size="xs"
                value={gwDraft}
                onChange={setGwDraft}
                min={0}
                max={100}
                step={1}
                data-testid="gateway-retry-window-range"
              />
            </Table.Td>
            <Table.Td>
              <Text size="xs" c="dimmed">
                {gwDraft[0]}–{gwDraft[1]}s
              </Text>
            </Table.Td>
            <Table.Td>
              <Button size="compact-xs" onClick={saveGateway} data-testid="save-gateway-retry-window">
                Save
              </Button>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td fw={600}>Billing</Table.Td>
            <Table.Td>
              <RangeSlider
                size="xs"
                value={billDraft}
                onChange={setBillDraft}
                min={0}
                max={100}
                step={1}
                data-testid="billing-retry-window-range"
              />
            </Table.Td>
            <Table.Td>
              <Text size="xs" c="dimmed">
                {billDraft[0]}–{billDraft[1]}s
              </Text>
            </Table.Td>
            <Table.Td>
              <Button size="compact-xs" variant="light" onClick={saveBilling} data-testid="save-billing-retry-window">
                Save
              </Button>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  );
}
