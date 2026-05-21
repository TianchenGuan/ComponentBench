'use client';

/**
 * accordion-mantine-T08: Top-left narrow card: match reference to truncated label
 * 
 * Placement is top_left. The target card is intentionally narrow, causing long accordion 
 * labels to truncate with ellipses. At the top of the card, a reference chip shows the 
 * full target label together with a small icon. Below is a Mantine Accordion with 7 items 
 * whose control rows each include an icon + a long label (some share the same prefix).
 * Initial state: all items collapsed.
 * 
 * Success: expanded_item_ids equals exactly: [reference_target]
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text, Box, Group, Badge, Tooltip } from '@mantine/core';
import { 
  IconUser, 
  IconShield, 
  IconKey, 
  IconDevices,
  IconBell,
  IconDatabase,
  IconSettings
} from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const items = [
  { value: 'account_settings_profile', label: 'Account settings — Profile', Icon: IconUser },
  { value: 'account_settings_security', label: 'Account settings — Security', Icon: IconShield },
  { value: 'reference_target', label: 'Account settings — API Keys', Icon: IconKey }, // Target
  { value: 'account_settings_sessions', label: 'Account settings — Sessions', Icon: IconDevices },
  { value: 'account_settings_notifications', label: 'Account settings — Notifications', Icon: IconBell },
  { value: 'account_settings_data', label: 'Account settings — Data', Icon: IconDatabase },
  { value: 'account_settings_advanced', label: 'Account settings — Advanced', Icon: IconSettings },
];

// The target item
const targetItem = items[2];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (value === 'reference_target') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder 
      style={{ width: 280 }} // Narrow card to cause truncation
    >
      <Text fw={600} size="md" mb="sm">Account</Text>
      
      {/* Reference chip with full label */}
      <Box mb="md" p="xs" style={{ backgroundColor: '#f8f9fa', borderRadius: 8 }}>
        <Text size="xs" c="dimmed" mb="xs">Open this section:</Text>
        <Badge 
          leftSection={<targetItem.Icon size={14} />}
          variant="light"
          size="lg"
          style={{ maxWidth: '100%' }}
        >
          {targetItem.label}
        </Badge>
      </Box>
      
      <Accordion 
        value={value} 
        onChange={setValue} 
        data-testid="accordion-root"
        styles={{
          control: {
            padding: '10px 12px',
          },
          label: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }}
      >
        {items.map(({ value: itemValue, label, Icon }) => (
          <Accordion.Item key={itemValue} value={itemValue}>
            <Tooltip label={label} position="right" openDelay={300}>
              <Accordion.Control>
                <Group gap="xs" wrap="nowrap">
                  <Icon size={16} style={{ flexShrink: 0 }} />
                  <Text size="sm" truncate style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label}
                  </Text>
                </Group>
              </Accordion.Control>
            </Tooltip>
            <Accordion.Panel>
              Content for {label}.
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Card>
  );
}
