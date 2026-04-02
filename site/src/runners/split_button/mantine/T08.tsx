'use client';

/**
 * split_button-mantine-T08: Project: scroll menu to select Archive project (Mantine, dark)
 *
 * Layout: isolated card titled "Project" in dark theme, positioned near bottom-right (placement=bottom_right) with compact spacing.
 *
 * Target component: Mantine split button with scrollable menu (~16 items).
 * "Archive project" is near the bottom (requires scrolling).
 *
 * Initial state: Selected action is "Open".
 * Success: selectedAction equals "archive_project"
 */

import React, { useState } from 'react';
import { Card, Button, Group, Menu, Text, Box } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const allActions = [
  { key: 'open', label: 'Open' },
  { key: 'rename', label: 'Rename…' },
  { key: 'change_owner', label: 'Change owner…' },
  { key: 'export', label: 'Export…' },
  { key: 'duplicate', label: 'Duplicate' },
  { key: 'move', label: 'Move…' },
  { key: 'share', label: 'Share…' },
  { key: 'settings', label: 'Settings' },
  { key: 'permissions', label: 'Permissions…' },
  { key: 'activity', label: 'View activity' },
  { key: 'comments', label: 'Comments' },
  { key: 'tags', label: 'Edit tags…' },
  { key: 'favorite', label: 'Add to favorites' },
  { key: 'pin', label: 'Pin' },
  { key: 'archive_project', label: 'Archive project' },
  { key: 'delete_project', label: 'Delete project', danger: true },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('open');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const getLabel = (key: string) => allActions.find(a => a.key === key)?.label || key;

  const handleSelect = (key: string) => {
    setSelectedAction(key);
    if (key === 'archive_project' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder 
      style={{ 
        width: 360,
        background: '#1a1b1e',
        borderColor: '#2c2e33'
      }}
    >
      <Text fw={500} size="lg" mb="sm" c="white">Project</Text>

      {/* Static project summary (distractor) */}
      <Text size="sm" c="dimmed" mb="md">
        Last modified: 2 hours ago
      </Text>

      <div
        data-testid="split-button-root"
        data-selected-action={selectedAction}
        aria-label="Project actions"
      >
        <Group gap={0}>
          <Button 
            size="sm"
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          >
            {getLabel(selectedAction)}
          </Button>
          <Menu position="bottom-end">
            <Menu.Target>
              <Button 
                size="sm"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: 8, paddingRight: 8 }}
              >
                <IconChevronDown size={14} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown style={{ maxHeight: 200, overflowY: 'auto' }}>
              {allActions.map((action) => (
                <Menu.Item 
                  key={action.key}
                  color={action.danger ? 'red' : undefined}
                  onClick={() => handleSelect(action.key)}
                >
                  {action.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </Card>
  );
}
