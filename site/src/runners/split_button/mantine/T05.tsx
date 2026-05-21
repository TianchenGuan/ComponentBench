'use client';

/**
 * split_button-mantine-T05: Library: search split-button menu and select Duplicate (Mantine)
 *
 * Layout: settings_panel titled "Item actions".
 * Target component: Mantine split button with custom dropdown containing search input.
 *
 * Menu items (~10): "Open", "Rename…", "Duplicate", "Move…", "Share…", "Archive", "Delete", etc.
 * Initial state: Selected action: "Open". Menu closed.
 *
 * Success: selectedAction equals "duplicate"
 */

import React, { useState } from 'react';
import { Card, Button, Group, Menu, Text, TextInput, Breadcrumbs, Anchor, Box } from '@mantine/core';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const allActions = [
  { key: 'open', label: 'Open' },
  { key: 'rename', label: 'Rename…' },
  { key: 'duplicate', label: 'Duplicate' },
  { key: 'move', label: 'Move…' },
  { key: 'share', label: 'Share…' },
  { key: 'archive', label: 'Archive' },
  { key: 'delete', label: 'Delete' },
  { key: 'download', label: 'Download' },
  { key: 'copy_link', label: 'Copy link' },
  { key: 'properties', label: 'Properties…' },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('open');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const getLabel = (key: string) => allActions.find(a => a.key === key)?.label || key;

  const filteredActions = allActions.filter(a =>
    a.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (key: string) => {
    setSelectedAction(key);
    setMenuOpen(false);
    setSearchTerm('');
    if (key === 'duplicate' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="md">Item actions</Text>

      {/* Read-only breadcrumb (distractor) */}
      <Box mb="md" style={{ opacity: 0.6 }}>
        <Breadcrumbs>
          <Anchor size="sm">Home</Anchor>
          <Anchor size="sm">Documents</Anchor>
          <Text size="sm">Current Item</Text>
        </Breadcrumbs>
      </Box>

      <div
        data-testid="split-button-root"
        data-selected-action={selectedAction}
      >
        <Group gap={0}>
          <Button style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
            {getLabel(selectedAction)}
          </Button>
          <Menu 
            position="bottom-end" 
            opened={menuOpen}
            onChange={(opened) => {
              setMenuOpen(opened);
              if (!opened) setSearchTerm('');
            }}
          >
            <Menu.Target>
              <Button 
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: 8, paddingRight: 8 }}
              >
                <IconChevronDown size={16} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <TextInput
                placeholder="Search actions…"
                leftSection={<IconSearch size={14} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                mb="xs"
                autoFocus
              />
              <Box style={{ maxHeight: 200, overflowY: 'auto' }}>
                {filteredActions.map((action) => (
                  <Menu.Item 
                    key={action.key}
                    onClick={() => handleSelect(action.key)}
                  >
                    {action.label}
                  </Menu.Item>
                ))}
              </Box>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>

      {/* Disabled button (distractor) */}
      <Button disabled variant="outline" mt="md">New folder</Button>
    </Card>
  );
}
