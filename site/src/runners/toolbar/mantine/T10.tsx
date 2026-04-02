'use client';

/**
 * toolbar-mantine-T10: Reset toolbar layout with confirm/cancel popover
 *
 * The page is a settings_panel containing a section titled "Layout". At the top of the 
 * section is a Mantine Group toolbar labeled "Layout" with several action chips: 
 * Widgets, Filters, Export, Settings, and a right-aligned button labeled "Reset layout".
 * Initial state: the toolbar is in a customized (non-default) order: Export, Widgets, Settings, Filters.
 * Clicking "Reset layout" opens an inline confirmation popover.
 * Only after clicking "Confirm reset" does the toolbar order change to the default order: 
 * Widgets, Filters, Export, Settings.
 */

import React, { useState } from 'react';
import { Paper, Group, Chip, Button, Popover, Text, Title, Box, Switch, Checkbox } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface LayoutItem {
  id: string;
  label: string;
}

const INITIAL_ORDER: LayoutItem[] = [
  { id: 'export', label: 'Export' },
  { id: 'widgets', label: 'Widgets' },
  { id: 'settings', label: 'Settings' },
  { id: 'filters', label: 'Filters' },
];

const DEFAULT_ORDER: LayoutItem[] = [
  { id: 'widgets', label: 'Widgets' },
  { id: 'filters', label: 'Filters' },
  { id: 'export', label: 'Export' },
  { id: 'settings', label: 'Settings' },
];

const TARGET_ORDER = ['widgets', 'filters', 'export', 'settings'];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<LayoutItem[]>(INITIAL_ORDER);
  const [committedOrder, setCommittedOrder] = useState<string[]>(
    INITIAL_ORDER.map((i) => i.id)
  );
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleConfirmReset = () => {
    setItems(DEFAULT_ORDER);
    const newOrder = DEFAULT_ORDER.map((i) => i.id);
    setCommittedOrder(newOrder);
    setPopoverOpen(false);

    if (JSON.stringify(newOrder) === JSON.stringify(TARGET_ORDER)) {
      onSuccess();
    }
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 550 }}>
      <Title order={5} mb="md">
        Layout
      </Title>

      {/* Clutter: other settings */}
      <Box mb="md" pb="md" style={{ borderBottom: '1px solid #e8e8e8' }}>
        <Group justify="space-between" mb="xs">
          <Text size="sm">Auto-refresh</Text>
          <Switch size="sm" />
        </Group>
        <Group justify="space-between" mb="xs">
          <Text size="sm">Show grid</Text>
          <Switch size="sm" defaultChecked />
        </Group>
        <Checkbox size="sm" label="Enable animations" />
      </Box>

      {/* Layout toolbar */}
      <Group justify="space-between" mb="sm" data-testid="mantine-toolbar-layout">
        <Group gap="xs">
          {items.map((item) => (
            <Chip
              key={item.id}
              checked={false}
              variant="outline"
              data-item-id={item.id}
            >
              {item.label}
            </Chip>
          ))}
        </Group>

        <Popover
          opened={popoverOpen}
          onChange={setPopoverOpen}
          position="bottom"
          shadow="md"
        >
          <Popover.Target>
            <Button
              variant="subtle"
              size="sm"
              onClick={() => setPopoverOpen(true)}
              data-testid="mantine-toolbar-layout-reset"
            >
              Reset layout
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="sm" mb="xs">
              Reset to default layout?
            </Text>
            <Group gap="xs">
              <Button
                size="xs"
                onClick={handleConfirmReset}
                data-testid="mantine-popover-confirm-reset"
              >
                Confirm reset
              </Button>
              <Button
                size="xs"
                variant="subtle"
                onClick={() => setPopoverOpen(false)}
                data-testid="mantine-popover-cancel"
              >
                Cancel
              </Button>
            </Group>
          </Popover.Dropdown>
        </Popover>
      </Group>

      <Text size="sm" c="dimmed">
        Order: {committedOrder.join(', ')}
      </Text>
    </Paper>
  );
}
