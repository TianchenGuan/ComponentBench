'use client';

/**
 * split_button-mantine-T04: Output: match example chip to select Download (Mantine)
 *
 * Layout: isolated card titled "Output" centered in the viewport.
 *
 * Guidance (mixed): Example chip with icon + text label "Download".
 * Menu items: Printer-"Print", Download-"Download", Share-"Share", Link-"Copy link"
 *
 * Initial state: Selected action is "Share".
 * Success: selectedAction equals "download"
 */

import React, { useState } from 'react';
import { Card, Button, Group, Menu, Text, Badge, Box } from '@mantine/core';
import { IconChevronDown, IconPrinter, IconDownload, IconShare, IconLink } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const options = [
  { key: 'print', label: 'Print', icon: IconPrinter },
  { key: 'download', label: 'Download', icon: IconDownload },
  { key: 'share', label: 'Share', icon: IconShare },
  { key: 'copy_link', label: 'Copy link', icon: IconLink },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('share');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const getLabel = (key: string) => options.find(o => o.key === key)?.label || key;

  const handleSelect = (key: string) => {
    setSelectedAction(key);
    if (key === 'download' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Output</Text>

      {/* Example chip (mixed guidance) */}
      <Box mb="md">
        <Text size="sm" c="dimmed" mb="xs">Example:</Text>
        <Badge
          data-reference-token="example_download_chip"
          leftSection={<IconDownload size={14} />}
          variant="light"
          size="lg"
        >
          Download
        </Badge>
      </Box>

      {/* Non-interactive preview image placeholder */}
      <Box 
        style={{ 
          padding: 24, 
          background: '#f8f9fa', 
          borderRadius: 4,
          textAlign: 'center',
          color: '#adb5bd',
          marginBottom: 16
        }}
      >
        🖼️ Preview placeholder
      </Box>

      <div
        data-testid="split-button-root"
        data-selected-action={selectedAction}
      >
        <Group gap={0}>
          <Button style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
            {getLabel(selectedAction)}
          </Button>
          <Menu position="bottom-end">
            <Menu.Target>
              <Button 
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: 8, paddingRight: 8 }}
              >
                <IconChevronDown size={16} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <Menu.Item 
                    key={option.key} 
                    leftSection={<Icon size={16} />}
                    onClick={() => handleSelect(option.key)}
                  >
                    {option.label}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </Card>
  );
}
