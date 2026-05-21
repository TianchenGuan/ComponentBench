'use client';

/**
 * split_button-mantine-T06: Send: reset to default Send now (Mantine)
 *
 * Layout: isolated card titled "Message" centered in the viewport.
 * Target component: Mantine split button pattern.
 *
 * Initial state: Selected action is "Save draft" (left label).
 * Menu items: "Send now" (default), "Schedule send", "Save draft", Divider, "Reset to default"
 *
 * Success: selectedAction equals "send_now"
 */

import React, { useState } from 'react';
import { Card, Button, Group, Menu, Text, Divider } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('save_draft');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const getLabel = (key: string) => {
    const labels: Record<string, string> = {
      'send_now': 'Send now',
      'schedule_send': 'Schedule send',
      'save_draft': 'Save draft',
    };
    return labels[key] || key;
  };

  const handleSelect = (key: string) => {
    if (key === 'reset_default') {
      setSelectedAction('send_now');
      if (!hasTriggeredSuccess) {
        setHasTriggeredSuccess(true);
        onSuccess();
      }
    } else {
      setSelectedAction(key);
      if (key === 'send_now' && !hasTriggeredSuccess) {
        setHasTriggeredSuccess(true);
        onSuccess();
      }
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Message</Text>

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
              <Menu.Item onClick={() => handleSelect('send_now')}>Send now</Menu.Item>
              <Menu.Item onClick={() => handleSelect('schedule_send')}>Schedule send</Menu.Item>
              <Menu.Item onClick={() => handleSelect('save_draft')}>Save draft</Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={() => handleSelect('reset_default')}>
                Reset to default
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Text size="xs" c="dimmed" mt="xs">
          Default action: Send now
        </Text>
      </div>
    </Card>
  );
}
