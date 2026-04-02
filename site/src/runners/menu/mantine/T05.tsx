'use client';

/**
 * menu-mantine-T05: Match a colored badge reference to the correct menu item
 * 
 * Scene: theme=dark, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Left: a "Target" card shows a single colored badge (a purple dot) with no text.
 *
 * Right: a Mantine Menu triggered by a button labeled "Priority".
 * - When opened, each Menu.Item displays a colored dot in the leftSection and a label:
 *   - High (red dot)
 *   - Medium (purple dot) ← target
 *   - Low (blue dot)
 *   - Info (green dot)
 *
 * Initial state:
 * - Menu is closed.
 * - Status text below reads "Selected priority: None".
 *
 * Success: The selected priority corresponds to the purple badge reference (label "Medium").
 */

import React, { useState, useEffect } from 'react';
import { Menu, Button, Paper, Text, Group, Box } from '@mantine/core';
import { IconChevronDown, IconCircleFilled } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const priorityItems = [
  { key: 'High', color: '#e03131' },
  { key: 'Medium', color: '#7950f2' },
  { key: 'Low', color: '#228be6' },
  { key: 'Info', color: '#40c057' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedPriority === 'Medium' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPriority, successTriggered, onSuccess]);

  return (
    <Group gap="lg" align="flex-start">
      {/* Target Card */}
      <Paper
        shadow="sm"
        p="lg"
        radius="md"
        style={{ width: 120, textAlign: 'center', background: '#25262b' }}
      >
        <Text size="xs" c="dimmed" mb="md">Target</Text>
        <IconCircleFilled
          size={48}
          style={{ color: '#7950f2' }}
          data-testid="target-badge"
        />
      </Paper>

      {/* Priority Menu */}
      <Paper shadow="sm" p="lg" radius="md" style={{ width: 250, background: '#25262b' }}>
        <Text size="lg" c="white" fw={500} mb="md">Priority Settings</Text>
        
        <Menu shadow="md" width={180}>
          <Menu.Target>
            <Button
              variant="outline"
              color="gray"
              rightSection={<IconChevronDown size={16} />}
              data-testid="menu-button-priority"
            >
              Priority
            </Button>
          </Menu.Target>

          <Menu.Dropdown data-testid="menu-priority">
            {priorityItems.map((item) => (
              <Menu.Item
                key={item.key}
                leftSection={<IconCircleFilled size={12} style={{ color: item.color }} />}
                onClick={() => setSelectedPriority(item.key)}
                data-testid={`menu-item-${item.key.toLowerCase()}`}
              >
                {item.key}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

        <Text size="sm" c="dimmed" mt="md" pt="md" style={{ borderTop: '1px solid #373a40' }}>
          Selected priority: <strong style={{ color: '#fff' }} data-testid="selected-priority">{selectedPriority || 'None'}</strong>
        </Text>
      </Paper>
    </Group>
  );
}
