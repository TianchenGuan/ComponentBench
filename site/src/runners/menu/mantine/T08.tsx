'use client';

/**
 * menu-mantine-T08: Choose Most recent and apply in a menu with footer actions
 * 
 * Scene: theme=light, spacing=comfortable, layout=settings_panel, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A Mantine Menu triggered by a button labeled "Sort".
 * - The dropdown contains a single-choice option list (radio-like) plus a footer row with "Apply" and "Cancel".
 *
 * Options:
 * - Name (currently applied)
 * - Most recent ← target
 * - Oldest
 *
 * State model / feedback:
 * - Clicking an option updates "Pending sort: …" immediately.
 * - The "Applied sort: …" line updates only after clicking Apply.
 * - Clicking Cancel discards the pending choice.
 *
 * Initial state:
 * - Menu is closed.
 * - Applied sort is Name.
 *
 * Success: The committed/applied sort value is "Most recent" after pressing Apply.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Button, Paper, Text, Group, Box, Divider } from '@mantine/core';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const sortOptions = ['Name', 'Most recent', 'Oldest'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [appliedSort, setAppliedSort] = useState<string>('Name');
  const [pendingSort, setPendingSort] = useState<string>('Name');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (appliedSort === 'Most recent' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [appliedSort, successTriggered, onSuccess]);

  const handleApply = () => {
    setAppliedSort(pendingSort);
    setMenuOpen(false);
  };

  const handleCancel = () => {
    setPendingSort(appliedSort);
    setMenuOpen(false);
  };

  const handleOpenChange = (opened: boolean) => {
    setMenuOpen(opened);
    if (opened) {
      setPendingSort(appliedSort);
    }
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 350 }}>
      <Text size="lg" fw={500} mb="md">Results</Text>

      <Text size="xs" c="dimmed" fw={500} mb="xs">Sort by</Text>
      
      <Menu
        shadow="md"
        width={200}
        opened={menuOpen}
        onChange={handleOpenChange}
        closeOnItemClick={false}
      >
        <Menu.Target>
          <Button
            variant="outline"
            rightSection={<IconChevronDown size={16} />}
            data-testid="menu-button-sort"
          >
            Sort
          </Button>
        </Menu.Target>

        <Menu.Dropdown data-testid="menu-sort">
          {sortOptions.map((option) => (
            <Menu.Item
              key={option}
              leftSection={pendingSort === option ? <IconCheck size={14} /> : <span style={{ width: 14 }} />}
              onClick={() => setPendingSort(option)}
              data-testid={`menu-item-${option.toLowerCase().replace(/ /g, '-')}`}
            >
              {option}
            </Menu.Item>
          ))}
          <Divider my="xs" />
          <Group p="xs" justify="flex-end" gap="xs">
            <Button size="xs" variant="subtle" onClick={handleCancel} data-testid="btn-cancel">
              Cancel
            </Button>
            <Button size="xs" onClick={handleApply} data-testid="btn-apply">
              Apply
            </Button>
          </Group>
        </Menu.Dropdown>
      </Menu>

      <Box mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        <Text size="sm" c="dimmed">
          Pending sort: <strong data-testid="pending-sort">{pendingSort}</strong>
        </Text>
        <Text size="sm" c="dimmed">
          Applied sort: <strong style={{ color: 'green' }} data-testid="applied-sort">{appliedSort}</strong>
        </Text>
      </Box>
    </Paper>
  );
}
