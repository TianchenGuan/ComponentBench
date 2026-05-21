'use client';

/**
 * menu_button-mantine-T04: Choose quick tool by matching icon reference
 * 
 * Layout: isolated_card centered titled "Quick tools".
 * A small "Reference icon" preview appears above the menu button (the Download icon).
 * The menu button label is "Quick tools: None" and opens a Mantine Menu.Dropdown.
 * 
 * The dropdown contains four Menu.Item entries with left icons:
 * "Search", "Filter", "Download", "Settings".
 * Guidance is visual: the desired choice is specified by matching the icon glyph.
 * 
 * Success: The selected item is "Download" (matches reference icon).
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Menu, Text, Box } from '@mantine/core';
import { IconChevronDown, IconSearch, IconFilter, IconDownload, IconSettings } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const tools = [
  { key: 'search', label: 'Search', icon: IconSearch },
  { key: 'filter', label: 'Filter', icon: IconFilter },
  { key: 'download', label: 'Download', icon: IconDownload },
  { key: 'settings', label: 'Settings', icon: IconSettings },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedTool === 'Download' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedTool, successTriggered, onSuccess]);

  const handleSelect = (label: string) => {
    setSelectedTool(label);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Quick tools</Text>
      
      <Box mb="md">
        <Text size="sm" c="dimmed" mb={8}>Reference icon:</Text>
        <Box
          style={{
            width: 48,
            height: 48,
            border: '1px solid #dee2e6',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          data-ref-id="icon_ref_2"
        >
          <IconDownload size={24} />
        </Box>
      </Box>

      <Menu>
        <Menu.Target>
          <Button
            variant="default"
            rightSection={<IconChevronDown size={16} />}
            data-testid="menu-button-quick-tools"
          >
            Quick tools: {selectedTool || 'None'}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {tools.map(tool => (
            <Menu.Item
              key={tool.key}
              leftSection={<tool.icon size={16} />}
              onClick={() => handleSelect(tool.label)}
            >
              {tool.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Card>
  );
}
