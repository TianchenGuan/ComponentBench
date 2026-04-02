'use client';

/**
 * split_button-mantine-T03: Send: set selected action to Schedule send (Mantine)
 *
 * Layout: isolated card titled "Message" centered in the viewport.
 * Target component: Mantine split button pattern (Button + Menu).
 *
 * Menu items: "Send now", "Schedule send", "Save draft", "Discard"
 * Initial state: Selected action is "Send now" (left label).
 *
 * Success: selectedAction equals "schedule_send"
 */

import React, { useState } from 'react';
import { Card, Button, Group, Menu, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const options = [
  { key: 'send_now', label: 'Send now' },
  { key: 'schedule_send', label: 'Schedule send' },
  { key: 'save_draft', label: 'Save draft' },
  { key: 'discard', label: 'Discard' },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('send_now');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const getLabel = (key: string) => options.find(o => o.key === key)?.label || key;

  const handleSelect = (key: string) => {
    setSelectedAction(key);
    if (key === 'schedule_send' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Message</Text>

      {/* Read-only fields (distractors) */}
      <Text size="sm" c="dimmed" mb="xs">To: user@example.com</Text>
      <Text size="sm" c="dimmed" mb="md">Subject: Meeting reminder</Text>

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
              {options.map((option) => (
                <Menu.Item 
                  key={option.key} 
                  onClick={() => handleSelect(option.key)}
                >
                  {option.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </Card>
  );
}
