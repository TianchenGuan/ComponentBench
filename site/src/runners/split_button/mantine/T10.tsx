'use client';

/**
 * split_button-mantine-T10: Table: start Delete then Cancel in the correct row (Mantine)
 *
 * Layout: table_cell scene with a compact data table (clutter=high).
 * Two rows have split buttons: Row 5 actions (distractor), Row 7 actions (target).
 *
 * Target component: Split button in Row 7 with inline confirmation.
 * Menu items: "View", "Duplicate", Divider, "Delete…" (danger)
 * After "Delete…": inline confirmation with "Delete this row?" and "Confirm"/"Cancel" buttons.
 *
 * Success: confirmationResult equals "cancelled", lastInvokedAction remains "none"
 */

import React, { useState } from 'react';
import { Card, Button, Group, Menu, Text, Table, TextInput, Checkbox, Box } from '@mantine/core';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface SplitButtonState {
  lastInvokedAction: string | null;
  confirmationResult: 'none' | 'confirmed' | 'cancelled';
  showConfirm: boolean;
  menuOpen: boolean;
}

function RowSplitButton({ 
  rowLabel, 
  instance,
  state, 
  onStateChange, 
  onSuccess 
}: { 
  rowLabel: string;
  instance: string;
  state: SplitButtonState;
  onStateChange: (newState: Partial<SplitButtonState>) => void;
  onSuccess?: () => void;
}) {
  const handleDelete = () => {
    onStateChange({ showConfirm: true });
  };

  const handleConfirm = () => {
    onStateChange({ 
      lastInvokedAction: 'delete', 
      confirmationResult: 'confirmed',
      showConfirm: false,
      menuOpen: false
    });
  };

  const handleCancel = () => {
    onStateChange({ 
      confirmationResult: 'cancelled',
      showConfirm: false,
      menuOpen: false
    });
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div
      data-testid="split-button-root"
      data-instance={instance}
      data-last-invoked-action={state.lastInvokedAction}
      data-confirmation-result={state.confirmationResult}
      aria-label={rowLabel}
    >
      <Group gap={0}>
        <Button 
          size="xs"
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        >
          Actions
        </Button>
        <Menu 
          position="bottom-end" 
          opened={state.menuOpen}
          onChange={(opened) => onStateChange({ menuOpen: opened, showConfirm: false })}
        >
          <Menu.Target>
            <Button 
              size="xs"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: 6, paddingRight: 6 }}
            >
              <IconChevronDown size={12} />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {state.showConfirm ? (
              <Box p="sm" data-testid="inline-confirm">
                <Text size="sm" fw={500} mb="sm">Delete this row?</Text>
                <Group gap="xs">
                  <Button size="xs" variant="default" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="xs" color="red" onClick={handleConfirm}>
                    Confirm
                  </Button>
                </Group>
              </Box>
            ) : (
              <>
                <Menu.Item>View</Menu.Item>
                <Menu.Item>Duplicate</Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" onClick={handleDelete} closeMenuOnClick={false}>
                  Delete…
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
}

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [row5State, setRow5State] = useState<SplitButtonState>({
    lastInvokedAction: null,
    confirmationResult: 'none',
    showConfirm: false,
    menuOpen: false,
  });
  
  const [row7State, setRow7State] = useState<SplitButtonState>({
    lastInvokedAction: null,
    confirmationResult: 'none',
    showConfirm: false,
    menuOpen: false,
  });

  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const handleRow7Cancel = () => {
    if (!hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  // Table data
  const rows = Array.from({ length: 10 }, (_, i) => ({
    key: String(i + 1),
    row: `Row ${i + 1}`,
    data: `Data item ${i + 1}`,
    status: [5, 7].includes(i + 1) ? 'Has actions' : 'Normal',
  }));

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={500} size="lg" mb="md">Data table</Text>

      {/* Header with disabled controls (clutter) */}
      <Group mb="md" gap="sm">
        <TextInput 
          placeholder="Search..." 
          leftSection={<IconSearch size={14} />} 
          style={{ width: 180 }}
          disabled
        />
        <Box 
          style={{ 
            padding: '4px 8px', 
            background: '#f1f3f5', 
            borderRadius: 4, 
            fontSize: 12,
            color: '#adb5bd'
          }}
        >
          All statuses
        </Box>
      </Group>

      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: 40 }}><Checkbox disabled size="xs" /></Table.Th>
            <Table.Th>Row</Table.Th>
            <Table.Th>Data</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.key}>
              <Table.Td><Checkbox disabled size="xs" /></Table.Td>
              <Table.Td>{row.row}</Table.Td>
              <Table.Td>{row.data}</Table.Td>
              <Table.Td>{row.status}</Table.Td>
              <Table.Td>
                {row.row === 'Row 5' ? (
                  <RowSplitButton
                    rowLabel="Row 5 actions"
                    instance="row5"
                    state={row5State}
                    onStateChange={(newState) => setRow5State(prev => ({ ...prev, ...newState }))}
                  />
                ) : row.row === 'Row 7' ? (
                  <RowSplitButton
                    rowLabel="Row 7 actions"
                    instance="row7"
                    state={row7State}
                    onStateChange={(newState) => setRow7State(prev => ({ ...prev, ...newState }))}
                    onSuccess={handleRow7Cancel}
                  />
                ) : (
                  <Text size="xs" c="dimmed">—</Text>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
